import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from './appError';
export const errorHandler = (err: AppError | ZodError | Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (res.headersSent) {
    _next(err);
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};