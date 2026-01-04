/**
 * Load & Concurrency Test
 * Run: node tests/load-test.js
 * 
 * Simulates 20-30 concurrent users hitting endpoints
 * Validates connection pool doesn't exhaust
 * 
 * For heavier testing, install autocannon:
 *   npm install -g autocannon
 *   autocannon -c 30 -d 10 http://localhost:5000/users
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const CONCURRENT_USERS = 25;
const REQUESTS_PER_USER = 5;

const endpoints = [
  '/users?limit=10',
  '/getnewstudentenroll?limit=10',
  '/jobs?limit=10',
  '/advancequeries?limit=10',
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          time: Date.now() - startTime,
          size: data.length,
        });
      });
    }).on('error', (err) => {
      resolve({
        status: 0,
        time: Date.now() - startTime,
        error: err.message,
      });
    });
  });
}

async function simulateUser(userId) {
  const results = [];
  
  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const result = await makeRequest(`${BASE_URL}${endpoint}`);
    results.push({ userId, endpoint, ...result });
  }
  
  return results;
}

async function runLoadTest() {
  console.log('\n🧪 === LOAD & CONCURRENCY TEST ===\n');
  console.log(`Configuration:`);
  console.log(`  - Concurrent users: ${CONCURRENT_USERS}`);
  console.log(`  - Requests per user: ${REQUESTS_PER_USER}`);
  console.log(`  - Total requests: ${CONCURRENT_USERS * REQUESTS_PER_USER}`);
  console.log(`  - Target: ${BASE_URL}\n`);

  console.log('⏳ Starting load test...\n');
  
  const startTime = Date.now();
  
  // Launch all users concurrently
  const userPromises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i + 1));
  }
  
  const allResults = await Promise.all(userPromises);
  const flatResults = allResults.flat();
  
  const totalTime = Date.now() - startTime;

  // Analyze results
  const successful = flatResults.filter(r => r.status === 200);
  const failed = flatResults.filter(r => r.status !== 200);
  const timeouts = flatResults.filter(r => r.status === 504 || r.status === 503);
  
  const times = successful.map(r => r.time);
  const avgTime = times.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(0) : 0;
  const maxTime = times.length ? Math.max(...times) : 0;
  const minTime = times.length ? Math.min(...times) : 0;

  console.log('📊 Results:');
  console.log('========================================');
  console.log(`  Total requests:    ${flatResults.length}`);
  console.log(`  Successful (200):  ${successful.length}`);
  console.log(`  Failed:            ${failed.length}`);
  console.log(`  Timeouts (503/4):  ${timeouts.length}`);
  console.log('');
  console.log(`  Total time:        ${totalTime}ms`);
  console.log(`  Requests/sec:      ${(flatResults.length / (totalTime / 1000)).toFixed(1)}`);
  console.log('');
  console.log(`  Avg response:      ${avgTime}ms`);
  console.log(`  Min response:      ${minTime}ms`);
  console.log(`  Max response:      ${maxTime}ms`);
  console.log('========================================\n');

  // Pass/Fail criteria
  const successRate = (successful.length / flatResults.length) * 100;
  
  if (successRate >= 95 && maxTime < 8000) {
    console.log('✅ PASS: System handles concurrent load well');
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);
  } else if (successRate >= 80) {
    console.log('⚠️ WARNING: Some requests failed under load');
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);
  } else {
    console.log('❌ FAIL: System struggles under concurrent load');
    console.log(`   Success rate: ${successRate.toFixed(1)}%`);
  }

  if (failed.length > 0) {
    console.log('\n📋 Failed requests sample:');
    failed.slice(0, 5).forEach(r => {
      console.log(`   ${r.endpoint} - Status: ${r.status}, Error: ${r.error || 'HTTP error'}`);
    });
  }

  console.log('\n========================================');
  console.log('🏁 LOAD TEST COMPLETE');
  console.log('========================================\n');
}

runLoadTest().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
