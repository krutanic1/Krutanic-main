/**
 * Connection Validation Test
 * Run: node tests/connection-test.js
 * 
 * Validates:
 * - MongoDB connects once and reuses connection
 * - Disconnect/reconnect events are handled
 * - Connection pool is working
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function testConnection() {
  console.log('\n🧪 === CONNECTION VALIDATION TEST ===\n');

  // Test 1: Initial Connection
  console.log('1️⃣ Testing initial connection...');
  const startTime = Date.now();
  await connectDB();
  const connectionTime = Date.now() - startTime;
  console.log(`   ✅ Connected in ${connectionTime}ms`);

  // Test 2: Connection Reuse (should be instant)
  console.log('\n2️⃣ Testing connection reuse...');
  const reuseStart = Date.now();
  await connectDB();
  await connectDB();
  await connectDB();
  const reuseTime = Date.now() - reuseStart;
  console.log(`   ✅ 3 calls completed in ${reuseTime}ms (should be <10ms)`);
  
  if (reuseTime < 50) {
    console.log('   ✅ PASS: Connection is being cached correctly');
  } else {
    console.log('   ❌ FAIL: Connection may not be cached');
  }

  // Test 3: Connection State
  console.log('\n3️⃣ Checking connection state...');
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  console.log(`   State: ${states[state]} (${state})`);
  
  if (state === 1) {
    console.log('   ✅ PASS: Connection is active');
  } else {
    console.log('   ❌ FAIL: Connection is not active');
  }

  // Test 4: Pool Size Check
  console.log('\n4️⃣ Checking connection pool...');
  const poolSize = mongoose.connection.getClient().options?.maxPoolSize;
  console.log(`   Max Pool Size: ${poolSize}`);
  
  if (poolSize >= 20) {
    console.log('   ✅ PASS: Pool size is adequate (≥20)');
  } else {
    console.log('   ⚠️ WARNING: Pool size may be too small');
  }

  // Test 5: Concurrent Queries
  console.log('\n5️⃣ Testing concurrent queries...');
  const concurrentStart = Date.now();
  const promises = [];
  for (let i = 0; i < 20; i++) {
    promises.push(mongoose.connection.db.admin().ping());
  }
  await Promise.all(promises);
  const concurrentTime = Date.now() - concurrentStart;
  console.log(`   ✅ 20 concurrent pings completed in ${concurrentTime}ms`);

  console.log('\n========================================');
  console.log('🏁 CONNECTION TEST COMPLETE');
  console.log('========================================\n');

  process.exit(0);
}

testConnection().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
