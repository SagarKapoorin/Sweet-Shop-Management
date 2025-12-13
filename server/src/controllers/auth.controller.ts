import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Response, Request } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { register, login, AuthResponse } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../dtos/auth.dto';

type EmptyQuery = ParsedQs;
type EmptyParams = ParamsDictionary;

const registerUser = asyncHandler<RegisterInput, EmptyQuery, EmptyParams, AuthResponse>(async (req: Request, res: Response<AuthResponse>) => {
  const result = await register(req.body);
  res.status(201).json(result);
});

const loginUser = asyncHandler<LoginInput, EmptyQuery, EmptyParams, AuthResponse>(async (req: Request, res: Response<AuthResponse>) => {
  const result = await login(req.body);
  //console.log('Login Result:', result);
  res.status(200).json(result);
});

export { registerUser, loginUser };
