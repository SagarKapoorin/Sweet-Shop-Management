import { NextFunction, Request, Response } from 'express';
import redis from '../config/redis';
import { AppError } from '../utils/appError';

const toPositiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

const windowSeconds = toPositiveInteger(process.env.RATE_LIMIT_WINDOW_SECONDS, 60);
const maxRequests = toPositiveInteger(process.env.RATE_LIMIT_MAX_REQUESTS, 100);
const keyPrefix = 'rate-limit';

const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const identifier = req.ip || 'unknown';
  const key = `${keyPrefix}:${identifier}`;

  try {
    //create a transaction pipeline for redis
    const pipeline = redis.multi();
    pipeline.incr(key);
    pipeline.expire(key, windowSeconds, 'NX');
    pipeline.ttl(key);
    const results = await pipeline.exec();

    if (!results) {
      next(new AppError('Rate limiter unavailable', 503));
      return;
    }

    const count = results[0]?.[1];
    const ttlSeconds = results[2]?.[1];

    const currentCount = typeof count === 'number' ? count : Number(count);
    const retryAfter = typeof ttlSeconds === 'number' && ttlSeconds > 0 ? ttlSeconds : windowSeconds;

    if (!Number.isFinite(currentCount)) {
      next(new AppError('Rate limiter error', 500));
      return;
    }

    if (currentCount > maxRequests) {
      res.setHeader('Retry-After', retryAfter.toString());
      next(new AppError('Too many requests', 429));
      return;
    }

    next();
  } catch (error) {
    next(new AppError('Rate limiter unavailable', 503));
  }
};

export { rateLimiter };
