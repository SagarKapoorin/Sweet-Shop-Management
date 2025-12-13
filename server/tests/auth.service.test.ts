import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, mongoose } from '../src/config/db';
import { register, login } from '../src/services/auth.service';
import User from '../src/models/User';
import { AppError } from '../src/utils/appError';

describe('auth.service', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
    await connectDB();
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('registers a new user and hashes password', async () => {
    const result = await register({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password',
      role: 'user'
    });
    const saved = await User.findOne({ email: 'alice@example.com' }).exec();
    if (!saved) {
      throw new Error('User not persisted');
    }
    const isHashed = saved.password !== 'password';
    const matches = await bcrypt.compare('password', saved.password);
    expect(result.user.email).toBe('alice@example.com');
    expect(result.token.length).toBeGreaterThan(0);
    expect(isHashed).toBe(true);
    expect(matches).toBe(true);
  });

  it('throws on invalid login', async () => {
    await register({ name: 'Bob', email: 'bob@example.com', password: 'secret123', role: 'user' });
    await expect(login({ email: 'bob@example.com', password: 'wrong' })).rejects.toBeInstanceOf(
      AppError
    );
  });
});
