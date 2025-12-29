import Sweet, { SweetDocument } from '../models/Sweet';
import {
  CreateSweetInput,
  UpdateSweetInput,
  PurchaseInput,
  RestockInput,
  SearchInput
} from '../dtos/sweet.dto';
import { AppError } from '../utils/appError';
import redis from '../config/redis';
import { mongoose } from '../config/db';

type SweetResponse = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
};
type SweetWithCartTotal = SweetResponse & { cartTotal: number };

type SweetFilter = Record<string, unknown>;
type SweetAggregateResult = SweetFilter & {
  _id: typeof mongoose.Types.ObjectId.prototype;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
};

const toSweetResponse = (sweet: SweetDocument, input?: PurchaseInput): SweetResponse | SweetWithCartTotal => ({
  _id: sweet._id.toString(),
  name: sweet.name,
  category: sweet.category,
  price: sweet.price,
  stock: sweet.stock,
  description: sweet.description,
  cartTotal: input ? sweet.price * input.quantity : 0
});

const cachePrefix = 'sweets';
const cacheKeyAll = `${cachePrefix}:all`;
const cacheDurationSeconds = 60;

const buildSearchKey = (query: SearchInput): string =>
  `${cachePrefix}:search:${JSON.stringify(query)}`;

const getCached = async (key: string): Promise<SweetResponse[] | null> => {
  const cached = await redis.get(key);
  //console.log('Cache fetch for key', key, cached ? 'HIT' : 'MISS');
  if (!cached) {
    return null;
  }
  const parsed: SweetResponse[] = JSON.parse(cached);
  return parsed;
};

const cacheList = async (key: string, data: SweetResponse[]): Promise<void> => {
  await redis.setex(key, cacheDurationSeconds, JSON.stringify(data));
};

const invalidateCache = async (): Promise<void> => {
  const keys = await redis.keys(`${cachePrefix}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

const createSweet = async (input: CreateSweetInput): Promise<SweetResponse> => {
  const sweet = new Sweet(input);
  await sweet.save();
  await invalidateCache();
  return toSweetResponse(sweet);
};
const getTotalPriceById = async (id: string): Promise<number> => {
  const sweet = await Sweet.findById(id).exec();
  if (!sweet) {
    throw new AppError('Sweet not found', 404);
  }
  return sweet.price * sweet.stock;
}

const getSweets = async (): Promise<SweetResponse[]> => {
  const cached = await getCached(cacheKeyAll);
  if (cached) {
    return cached;
  }
  const sweets = await Sweet.find().exec();
  const mapped = sweets.map((sweet) => toSweetResponse(sweet));
  await cacheList(cacheKeyAll, mapped);
  return mapped;
};

const searchSweets = async (query: SearchInput): Promise<SweetResponse[]> => {
  try {
  // console.log('Search Query:', query);
  const key = buildSearchKey(query);
  const atlasSearchIndex = 'sweet-search';

  const price: { $gte?: number; $lte?: number } = {};
  if (query.minPrice !== undefined) {
    const min = Number(query.minPrice);
    if (!isNaN(min)) price.$gte = min;
  }

  if (query.maxPrice !== undefined) {
    const max = Number(query.maxPrice);
    if (!isNaN(max)) price.$lte = max;
  }

  const compoundFilters: Record<string, unknown>[] = [];
  if (query.category) {
    compoundFilters.push({
      text: {
        query: query.category,
        path: 'category',
        fuzzy: { maxEdits: 2, prefixLength: 0, maxExpansions: 50 }
      }
    });
  }
  if (price.$gte !== undefined || price.$lte !== undefined) {
    compoundFilters.push({
      range: {
        path: 'price',
        ...(price.$gte !== undefined ? { gte: price.$gte } : {}),
        ...(price.$lte !== undefined ? { lte: price.$lte } : {})
      }
    });
  }
  // console.log('Compound Filters:', compoundFilters);
  // console.log('Query:', query);

  const mustClauses: Record<string, unknown>[] = [];
  if (query.name) {
    mustClauses.push({
      text: {
        query: query.name,
        path: ['name', 'category', 'description'],
        fuzzy: { maxEdits: 2, prefixLength: 0, maxExpansions: 50 }
      }
    });
  } else {
    mustClauses.push({ exists: { path: 'name' } });
  }

  const compound: Record<string, unknown> = { must: mustClauses };
  if (compoundFilters.length > 0) {
    compound.filter = compoundFilters;
  }

  const sweets = await Sweet.aggregate<SweetAggregateResult>([
    {
      $search: {
        index: atlasSearchIndex,
        compound
      }
    },
    { $addFields: { score: { $meta: 'searchScore' } } },
    { $sort: { score: -1 } }
  ]).exec();
  // console.log(sweets);
  const mapped = sweets.map((sweet) => ({
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    stock: sweet.stock,
    description: sweet.description
  }));
  await cacheList(key, mapped);
  return mapped;
}catch (error) {
  console.error('Error in searchSweets:', error);
  throw error;
}
};

const getSweetById = async (id: string): Promise<SweetResponse> => {
  const sweet = await Sweet.findById(id).exec();
  if (!sweet) {
    throw new AppError('Sweet not found', 404);
  }
  return toSweetResponse(sweet);
};

const updateSweet = async (id: string, input: UpdateSweetInput): Promise<SweetResponse> => {
  const sweet = await Sweet.findByIdAndUpdate(id, input, { new: true, runValidators: true }).exec();
  if (!sweet) {
    throw new AppError('Sweet not found', 404);
  }
  await invalidateCache();
  //console.log('Sweet updated:', sweet);
  return toSweetResponse(sweet);
};

const deleteSweet = async (id: string): Promise<void> => {
  const sweet = await Sweet.findByIdAndDelete(id).exec();
  if (!sweet) {
    throw new AppError('Sweet not found', 404);
  }
  await invalidateCache();
};

const purchaseSweet = async (id: string, input: PurchaseInput): Promise<SweetWithCartTotal> => {
  const session = await mongoose.startSession();
  let updated: SweetResponse | null = null;
  try {
    //console.log(session start);
    await session.withTransaction(async () => {
      const sweet = await Sweet.findById(id).session(session).exec();
      if (!sweet) {
        throw new AppError('Sweet not found', 404);
      }
      if (sweet.stock < input.quantity) {
        throw new AppError('Insufficient stock', 400);
      }
      sweet.stock -= input.quantity;
      await sweet.save({ session });

      updated = toSweetResponse(sweet);
      // console.log('Sweet purchased:', updated);
    });
    //console.log(sweet purchased);
    //console.log('Transaction committed');
  } finally {
    await session.endSession();
  }
  if (!updated) {
    throw new AppError('Purchase failed', 500);
  }
  await invalidateCache();
  return toSweetResponse(updated, input) as SweetWithCartTotal;
};

const restockSweet = async (id: string, input: RestockInput): Promise<SweetResponse> => {
  const sweet = await Sweet.findById(id).exec();
  if (!sweet) {
    throw new AppError('Sweet not found', 404);
  }
  sweet.stock += input.quantity;
  await sweet.save();
  await invalidateCache();
  return toSweetResponse(sweet);
};

export {
  createSweet,
  getSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  getTotalPriceById,
  SweetResponse
};
