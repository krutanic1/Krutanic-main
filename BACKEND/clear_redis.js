const redis = require('./config/redis');

async function clearAttendance() {
  try {
    const keys = await redis.keys('attendance:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} attendance keys from Redis.`);
    } else {
      console.log('No attendance keys found in Redis.');
    }
  } catch (error) {
    console.error('Error clearing redis:', error);
  }
}

clearAttendance();
