import mongoose from 'mongoose';

let connected = false;
let connectPromise = null;

function getConnectOptions() {
  const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 15000);
  const socketTimeoutMS = Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000);

  return {
    serverSelectionTimeoutMS: Number.isFinite(serverSelectionTimeoutMS) ? serverSelectionTimeoutMS : 15000,
    socketTimeoutMS: Number.isFinite(socketTimeoutMS) ? socketTimeoutMS : 45000
  };
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectDB() {
  if (connected || isDBConnected()) {
    connected = true;
    return;
  }

  if (connectPromise) {
    return connectPromise;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in .env');

  connectPromise = mongoose
    .connect(uri, getConnectOptions())
    .then(() => {
      connected = true;
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      connected = false;
      throw err;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}
