import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import {
  createSweet,
  getSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  SweetResponse
} from '../services/sweet.service';
import {
  CreateSweetInput,
  UpdateSweetInput,
  PurchaseInput,
  RestockInput,
  SearchInput,
  searchSchema
} from '../dtos/sweet.dto';

type EmptyParams = ParamsDictionary;

const createSweetController = asyncHandler<CreateSweetInput, ParsedQs, EmptyParams, SweetResponse>(
  async (req: Request, res: Response<SweetResponse>) => {
    const result = await createSweet(req.body);
    res.status(201).json(result);
  }
);

const listSweetsController = asyncHandler<
  Record<string, never>,
  ParsedQs,
  EmptyParams,
  SweetResponse[]
>(async (req: Request, res: Response<SweetResponse[]>) => {
  const result = await getSweets();
  res.status(200).json(result);
});

const searchSweetsController = asyncHandler<
  Record<string, never>,
  SearchInput,
  EmptyParams,
  SweetResponse[]
>(
  async (
    req: Request<EmptyParams, SweetResponse[], Record<string, never>, SearchInput>,
    res: Response<SweetResponse[]>
  ) => {
    // console.log('Search Controller Query:', req.query);
    const result = await searchSweets(req.query);
    res.status(200).json(result);
  }
);

const getSweetController = asyncHandler<
  Record<string, never>,
  ParsedQs,
  { id: string },
  SweetResponse
>(async (req: Request<{ id: string }>, res: Response<SweetResponse>) => {
  const result = await getSweetById(req.params.id);
  // console.log('Get Sweet Result:', result);
  res.status(200).json(result);
});

const updateSweetController = asyncHandler<
  UpdateSweetInput,
  ParsedQs,
  { id: string },
  SweetResponse
>(async (req: Request<{ id: string }>, res: Response<SweetResponse>) => {
  const result = await updateSweet(req.params.id, req.body);
  res.status(200).json(result);
});

const deleteSweetController = asyncHandler<Record<string, never>, ParsedQs, { id: string }, void>(
  async (req: Request<{ id: string }>, res: Response<void>) => {
    await deleteSweet(req.params.id);
    res.status(204).send();
  }
);

const purchaseSweetController = asyncHandler<
  PurchaseInput,
  ParsedQs,
  { id: string },
  SweetResponse
>(async (req: Request<{ id: string }>, res: Response<SweetResponse>) => {
  const result = await purchaseSweet(req.params.id, req.body);
  res.status(200).json(result);
});

const restockSweetController = asyncHandler<RestockInput, ParsedQs, { id: string }, SweetResponse>(
  async (req: Request<{ id: string }>, res: Response<SweetResponse>) => {
    const result = await restockSweet(req.params.id, req.body);
    //console.log('Restock Result:', result);
    res.status(200).json(result);
  }
);

export {
  createSweetController,
  listSweetsController,
  searchSweetsController,
  getSweetController,
  updateSweetController,
  deleteSweetController,
  purchaseSweetController,
  restockSweetController
};
