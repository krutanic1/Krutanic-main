const { Redis } = require("@upstash/redis");
require("dotenv").config();

/**
 * @desc Redis configuration using Upstash
 */
const url = process.env.REDIS_URL;
const token = process.env.REDIS_TOKEN;

if (!url || !token) {
  console.error("❌ Upstash Redis credentials missing in .env!");
}

const redis = new Redis({
  url: url,
  token: token
});

module.exports = redis;
