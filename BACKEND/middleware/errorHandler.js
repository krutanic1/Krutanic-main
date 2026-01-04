/**
 * Request Timeout Middleware
 * 
 * FIX #4: Add Error Handling Middleware
 * - Implements request-level timeout (8 seconds, before 10s MongoDB limit)
 * - Returns proper 504 Gateway Timeout errors
 * - Prevents requests from hanging indefinitely
 */

const requestTimeout = (timeout = 8000) => {
  return (req, res, next) => {
    // Flag to track if timeout occurred
    req.timedOut = false;
    
    // Set a timeout that fires before MongoDB's 10s timeout
    const timeoutId = setTimeout(() => {
      req.timedOut = true;
      if (!res.headersSent) {
        console.error(`⏰ Request timeout: ${req.method} ${req.originalUrl}`);
        res.status(504).json({
          error: 'Gateway Timeout',
          message: 'Request took too long to process. Please try again.',
          path: req.originalUrl,
        });
      }
    }, timeout);

    // Clear timeout when response finishes
    res.on('finish', () => clearTimeout(timeoutId));
    res.on('close', () => clearTimeout(timeoutId));
    
    // Wrap res.json and res.send to prevent sending after timeout
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    
    res.json = function(data) {
      if (res.headersSent) {
        console.warn(`⚠️ Attempted to send JSON after headers sent: ${req.method} ${req.originalUrl}`);
        return res;
      }
      return originalJson(data);
    };
    
    res.send = function(data) {
      if (res.headersSent) {
        console.warn(`⚠️ Attempted to send after headers sent: ${req.method} ${req.originalUrl}`);
        return res;
      }
      return originalSend(data);
    };

    next();
  };
};

/**
 * Database Error Handler Middleware
 * 
 * Catches MongoDB-specific errors and returns appropriate responses
 */
const dbErrorHandler = (err, req, res, next) => {
  // Handle Mongoose timeout errors
  if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
    console.error(`❌ MongoDB Timeout: ${req.method} ${req.originalUrl}`, err.message);
    return res.status(503).json({
      error: 'Database Timeout',
      message: 'Database operation timed out. Please try again.',
      path: req.originalUrl,
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    console.error(`❌ MongoDB Connection Error: ${req.method} ${req.originalUrl}`, err.message);
    return res.status(503).json({
      error: 'Database Unavailable',
      message: 'Unable to connect to database. Please try again later.',
      path: req.originalUrl,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: `A record with this ${field} already exists.`,
      field: field,
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: messages.join(', '),
    });
  }

  // Pass to default error handler
  next(err);
};

/**
 * Global Error Handler
 * 
 * Catches any unhandled errors
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(`❌ Unhandled Error: ${req.method} ${req.originalUrl}`, err);
  
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
  });
};

module.exports = {
  requestTimeout,
  dbErrorHandler,
  globalErrorHandler,
};
