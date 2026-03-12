import mongoose from 'mongoose';

let connected = false;

export async function connectDB() {
  if (connected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in .env');
  await mongoose.connect(uri);
  connected = true;
  console.log('MongoDB connected');
}
