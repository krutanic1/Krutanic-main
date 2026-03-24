const mongoose = require('mongoose');

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // In serverless, we might not want to exit the process
    // but log it for debugging
  }
};

module.exports = dbConnect;
