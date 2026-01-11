const redis = require('redis');

let client = null;

const connectRedis = async () => {
  if (client) return client;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  client = redis.createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis reconnection failed after 10 attempts');
          return new Error('Redis connection failed');
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('✅ Redis connected'));
  client.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

  await client.connect();
  return client;
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return client;
};

module.exports = { connectRedis, getRedisClient };
