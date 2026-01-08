const mongoose = require("mongoose");

/**
 * Hardened MongoDB Connection Helper for Serverless (Vercel)
 * 
 * This module implements multiple layers of defense against duplicate connections:
 * 1. Global connection caching
 * 2. Mongoose connection state checking
 * 3. Connection promise locking
 * 4. Automatic cleanup on disconnection
 * 
 * DEFENSIVE GUARDS:
 * - Checks mongoose.connection.readyState before creating new connections
 * - Reuses existing connections even if global.mongoose is cleared
 * - Prevents race conditions during parallel imports
 * - Handles hot reloads in development
 * - Compatible with Vercel serverless functions
 * 
 * OPTIMIZATIONS APPLIED:
 * - minPoolSize: 0 (CRITICAL for serverless - allows idle connection release)
 * - maxPoolSize: 10 (appropriate for single-request serverless functions)
 * - maxIdleTimeMS: 60000 (auto-close idle connections after 60 seconds)
 * - Connection state monitoring with automatic recovery
 */

// ========================================
// DEFENSIVE GUARD #1: Global Connection Cache
// ========================================
// Store connection in global scope to survive hot reloads and module re-imports
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Get MongoDB connection with multiple defensive guards
 * 
 * Connection State Map (mongoose.connection.readyState):
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
async function connectDB() {
  // ========================================
  // DEFENSIVE GUARD #2: Mongoose Connection State Check
  // ========================================
  // CRITICAL: Check if Mongoose already has an active connection
  // This prevents duplicate connections even if global cache is cleared
  if (mongoose.connection.readyState === 1) {
    console.log('♻️  Reusing existing MongoDB connection (readyState: 1 - connected)');
    cached.conn = mongoose;
    return cached.conn;
  }

  // ========================================
  // DEFENSIVE GUARD #3: Connection In Progress Check
  // ========================================
  // If another request is already connecting, wait for it instead of creating duplicate
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB connection in progress (readyState: 2 - connecting), waiting...');

    // If we have a cached promise, wait for it
    if (cached.promise) {
      try {
        cached.conn = await cached.promise;
        return cached.conn;
      } catch (err) {
        console.error('❌ Cached connection promise failed:', err.message);
        // Fall through to create new connection
      }
    }

    // Otherwise wait for Mongoose's internal connection process
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout: waiting for in-progress connection'));
      }, 10000); // 10 second timeout

      mongoose.connection.once('connected', () => {
        clearTimeout(timeout);
        cached.conn = mongoose;
        resolve(cached.conn);
      });

      mongoose.connection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  // ========================================
  // DEFENSIVE GUARD #4: Cached Connection Check
  // ========================================
  // If we already have a cached connection, return it
  if (cached.conn) {
    console.log('✅ Returning cached MongoDB connection');
    return cached.conn;
  }

  // ========================================
  // DEFENSIVE GUARD #5: Promise Locking
  // ========================================
  // If a connection promise exists, wait for it instead of creating a new one
  // This prevents race conditions during parallel imports/requires
  if (!cached.promise) {
    // ✅ Serverless-optimized connection pool configuration
    const opts = {
      bufferCommands: false,

      // ✅ SERVERLESS FIX: Reduced pool sizes for isolated Lambda-like instances
      maxPoolSize: 10,        // Reduced from 50 (Vercel functions process 1 request at a time)
      minPoolSize: 0,         // CRITICAL: Changed from 10 (allow idle instances to release connections)
      maxIdleTimeMS: 60000,   // NEW: Auto-close idle connections after 60 seconds

      // Connection timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Retry behavior for transient serverless network issues
      retryWrites: true,
      retryReads: true
    };

    const uri = process.env.DB_NAME;

    if (!uri) {
      throw new Error("MONGODB_URI (DB_NAME) is not defined in environment variables");
    }

    console.log("🔄 Creating new MongoDB connection...");

    // ========================================
    // PROMISE LOCK: Store promise immediately to prevent duplicate connections
    // ========================================
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      console.log(`📊 Connection State: ${mongoose.connection.readyState} (1 = connected)`);
      console.log(`🔌 Active Connections: ${mongoose.connection.client?.topology?.s?.pool?.size || 'N/A'}`);

      // ✅ Setup connection monitoring for automatic recovery
      setupConnectionMonitoring();

      return mongoose;
    }).catch((err) => {
      // ========================================
      // ERROR HANDLING: Clear promise on failure for retry capability
      // ========================================
      console.error("❌ MongoDB connection failed:", err.message);
      cached.promise = null; // Allow retry on next request
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset both promise and connection on error
    cached.promise = null;
    cached.conn = null;
    console.error("❌ MongoDB connection error:", e.message);
    throw e;
  }

  return cached.conn;
}

// ========================================
// CONNECTION EVENT MONITORING
// ========================================
// Automatically handles disconnections, reconnections, and cleanup
function setupConnectionMonitoring() {
  const db = mongoose.connection;

  // ========================================
  // DEFENSIVE GUARD #6: Automatic Cache Cleanup on Disconnect
  // ========================================
  db.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Clearing cache for fresh reconnect...');
    cached.conn = null;
    cached.promise = null;
  });

  db.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected successfully');
    cached.conn = mongoose; // Update cache with reconnected instance
  });

  db.on('close', () => {
    console.log('📴 MongoDB connection closed by server');
    cached.conn = null;
    cached.promise = null;
  });

  db.on('error', (err) => {
    console.error('❌ MongoDB runtime error:', err.message);

    // On critical errors, clear cache to force reconnection
    if (err.message.includes('connection') || err.message.includes('pool')) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  // Development-only detailed logging
  if (process.env.NODE_ENV !== 'production') {
    db.on('open', () => {
      console.log('📊 MongoDB connection pool established');
      console.log(`   - maxPoolSize: 10`);
      console.log(`   - minPoolSize: 0`);
      console.log(`   - maxIdleTimeMS: 60000ms`);
    });
  }
}

// ========================================
// HELPER: Get Current Connection State (for debugging)
// ========================================
function getConnectionInfo() {
  const state = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    readyState: state,
    stateName: stateMap[state] || 'unknown',
    hasCache: !!cached.conn,
    hasPromise: !!cached.promise,
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A'
  };
}

module.exports = connectDB;
module.exports.getConnectionInfo = getConnectionInfo; // Export for debugging

