import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is required');
}

const redis = new Redis(redisUrl);

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redis;
