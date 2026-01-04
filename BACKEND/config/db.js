const mongoose = require("mongoose");

/**
 * Global MongoDB Connection Helper for Serverless (Vercel)
 * 
 * This module implements connection caching to prevent
 * Mongoose timeout issues in serverless environments.
 * Each Lambda/serverless invocation will reuse existing connections.
 * 
 * FIXES APPLIED:
 * - Removed deprecated useUnifiedTopology/useNewUrlParser flags
 * - Increased maxPoolSize from 10 to 20
 * - Added maxIdleTimeMS to close idle connections
 * - Added connection event monitoring
 */

// Global cache for the MongoDB connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we already have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    // ✅ FIX #1: Updated connection config (removed deprecated flags, increased pool)
    const opts = {
      bufferCommands: false,          // Disable buffering for serverless
      maxPoolSize: 20,                // Increased from 10 to handle more concurrent requests
      minPoolSize: 5,                 // Maintain minimum connections
      maxIdleTimeMS: 45000,           // Close idle connections after 45 seconds
      serverSelectionTimeoutMS: 8000, // Fail faster (before 10s app timeout)
      socketTimeoutMS: 45000,         // Socket timeout
      heartbeatFrequencyMS: 10000,    // Check connection health every 10s
      retryWrites: true,              // Retry failed writes
      retryReads: true,               // Retry failed reads
      // NOTE: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+
    };

    const uri = process.env.DB_NAME;
    
    if (!uri) {
      throw new Error("MONGODB_URI (DB_NAME) is not defined in environment variables");
    }

    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      
      // ✅ FIX #5: Connection error monitoring
      setupConnectionMonitoring();
      
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error so we can retry
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
}

// ✅ FIX #5: Connection Event Monitoring
function setupConnectionMonitoring() {
  const db = mongoose.connection;
  
  db.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  db.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Will attempt to reconnect...');
    cached.conn = null;
    cached.promise = null;
  });

  db.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });

  db.on('close', () => {
    console.log('📴 MongoDB connection closed');
    cached.conn = null;
    cached.promise = null;
  });

  // Monitor connection pool usage (useful for debugging)
  if (process.env.NODE_ENV !== 'production') {
    db.on('open', () => {
      console.log('📊 MongoDB connection pool established');
    });
  }
}

module.exports = connectDB;
