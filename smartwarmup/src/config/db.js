const mongoose = require('mongoose');

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = dbConnect;
