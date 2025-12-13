import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import RedisMock from 'ioredis-mock';
import { connectDB, mongoose } from '../src/config/db';
import Sweet from '../src/models/Sweet';
import { AppError } from '../src/utils/appError';
type RedisClient = {
  get(key: string): Promise<string | null>;
  flushall(): Promise<void>;
};

vi.mock('../src/config/redis', () => {
  const redis = new RedisMock();
  return { default: redis };
});

describe('sweet.service', () => {
  let replSet: MongoMemoryReplSet;
  let service: typeof import('../src/services/sweet.service');
  const getRedis = async (): Promise<RedisClient> => {
    const { default: redis } = await import('../src/config/redis.js');
    return redis as unknown as RedisClient;
  };

  beforeAll(async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    replSet = await MongoMemoryReplSet.create({ replSet: { storageEngine: 'wiredTiger' } });
    process.env.MONGODB_URI = replSet.getUri();
    await connectDB();
    service = await import('../src/services/sweet.service.js');
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    const redis = await getRedis();
    await redis.flushall();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop();
  });

  it('creates and fetches sweets list', async () => {
    await service.createSweet({ name: 'Ladoo', category: 'Traditional', price: 5, stock: 10 });
    const initial = await service.getSweets();
    await service.createSweet({ name: 'Barfi', category: 'Traditional', price: 7, stock: 8 });
    const finalList = await service.getSweets();
    expect(initial.length).toBe(1);
    expect(finalList.length).toBe(2);
  });

  it('filters sweets by search criteria', async () => {
    await service.createSweet({ name: 'Gulab Jamun', category: 'Traditional', price: 10, stock: 5 });
    await service.createSweet({ name: 'Chocolate Fudge', category: 'Modern', price: 15, stock: 5 });
    const results = await service.searchSweets({ category: 'Traditional' });
    expect(results.length).toBe(1);
    expect(results[0]?.name).toBe('Gulab Jamun');
  });

  it('handles purchase transactions and stock checks', async () => {
    const created = await service.createSweet({ name: 'Halwa', category: 'Traditional', price: 4, stock: 3 });
    const purchased = await service.purchaseSweet(created.id, { quantity: 2 });
    const updated = await Sweet.findById(created.id).exec();
    if (!updated) {
      throw new Error('Sweet not persisted');
    }
    expect(purchased.stock).toBe(1);
    expect(updated.stock).toBe(1);
    await expect(service.purchaseSweet(created.id, { quantity: 5 })).rejects.toBeInstanceOf(AppError);
  });

  it('restocks sweets for admins', async () => {
    const created = await service.createSweet({ name: 'Sandesh', category: 'Traditional', price: 6, stock: 1 });
    const restocked = await service.restockSweet(created.id, { quantity: 4 });
    expect(restocked.stock).toBe(5);
  });
});
