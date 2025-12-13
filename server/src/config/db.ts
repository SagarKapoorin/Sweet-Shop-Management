import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }
  await mongoose.connect(uri);
};

export { connectDB, mongoose };
