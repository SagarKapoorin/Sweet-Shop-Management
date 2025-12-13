import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type Handler<Body, Query, Params, ResBody> = (
  req: Request<Params, ResBody, Body, Query, Record<string, never>>,
  res: Response<ResBody, Record<string, never>>,
  next: NextFunction
) => Promise<void>;

const asyncHandler =
  <Body = Record<string, never>, Query = ParsedQs, Params = ParamsDictionary, ResBody = void>(
    fn: Handler<Body, Query, Params, ResBody>
  ) =>
  (
    req: Request<Params, ResBody, Body, Query, Record<string, never>>,
    res: Response<ResBody, Record<string, never>>,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
