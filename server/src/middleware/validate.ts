import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ZodType } from 'zod';
import { AppError } from '../utils/appError';

const validateBody = <T>(schema: ZodType<T>) => (
  req: Request<ParamsDictionary, Record<string, never>, T, ParsedQs, Record<string, never>>,
  res: Response,
  next: NextFunction
): void => {
  try{
  const result = schema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(result.error.message, 400));
    return;
  }
  next();
  } catch (error) {
    console.error('Unexpected body validation error', error);
    next(new AppError('Invalid request body', 400));
  }
};

const validateQuery = <T>(schema: ZodType<T>) => (
  req: Request<ParamsDictionary, Record<string, never>, Record<string, never>, T, Record<string, never>>,
  res: Response,
  next: NextFunction
): void => {
  try {                                                                                                
      const result = schema.safeParse(req.query);                                                        
      if (!result.success) {                                                                             
        console.error('Query validation failed', result.error);                                          
        next(new AppError(result.error.message, 400));                                                   
        return;                                                                                          
      }                                                                                                  
      next();                                                                                            
    } catch (err) {                                                                                      
      console.error('Unexpected query validation error', err);                                           
      next(new AppError('Invalid query params', 400));
    }    
};

const validateParams = <T>(schema: ZodType<T>) => (
  req: Request<T, Record<string, never>, Record<string, never>, ParsedQs, Record<string, never>>,
  res: Response,
  next: NextFunction
): void => {
  try {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    next(new AppError(result.error.message, 400));
    return;
  }
  next();
  } catch (error) {
    console.error('Unexpected params validation error', error);
    next(new AppError('Invalid route parameters', 400));
  }
};

export { validateBody, validateQuery, validateParams };
