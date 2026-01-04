/**
 * Query Performance Test
 * Run: node tests/query-perf-test.js
 * 
 * Validates:
 * - .lean() vs normal query performance
 * - .limit() prevents large data transfers
 * - Heavy queries are identified
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const NewEnroll = require('../models/NewStudentEnroll');
const Certificate = require('../models/Certificate');

async function measureQuery(name, queryFn) {
  const startTime = Date.now();
  const result = await queryFn();
  const time = Date.now() - startTime;
  const count = Array.isArray(result) ? result.length : (result ? 1 : 0);
  return { name, time, count };
}

async function runPerformanceTest() {
  console.log('\n🧪 === QUERY PERFORMANCE TEST ===\n');

  await connectDB();

  // Test 1: Compare .lean() vs regular queries
  console.log('1️⃣ Testing .lean() optimization...\n');

  const leanTests = [
    {
      name: 'Users (regular)',
      query: () => User.find().limit(50),
    },
    {
      name: 'Users (lean)',
      query: () => User.find().limit(50).lean(),
    },
    {
      name: 'NewEnroll (regular)',
      query: () => NewEnroll.find().limit(50),
    },
    {
      name: 'NewEnroll (lean)',
      query: () => NewEnroll.find().limit(50).lean(),
    },
  ];

  for (const test of leanTests) {
    const result = await measureQuery(test.name, test.query);
    const icon = test.name.includes('lean') ? '🚀' : '🐢';
    console.log(`   ${icon} ${result.name}: ${result.time}ms (${result.count} docs)`);
  }

  // Test 2: Test .limit() effectiveness
  console.log('\n2️⃣ Testing .limit() effectiveness...\n');

  const limitTests = [
    { name: 'Users limit(10)', query: () => User.find().limit(10).lean() },
    { name: 'Users limit(50)', query: () => User.find().limit(50).lean() },
    { name: 'Users limit(100)', query: () => User.find().limit(100).lean() },
  ];

  for (const test of limitTests) {
    const result = await measureQuery(test.name, test.query);
    console.log(`   📊 ${result.name}: ${result.time}ms (${result.count} docs)`);
  }

  // Test 3: Check for heavy queries
  console.log('\n3️⃣ Checking collection sizes...\n');

  const collections = [
    { name: 'users', model: User },
    { name: 'newenrolls', model: NewEnroll },
    { name: 'certificates', model: Certificate },
  ];

  for (const { name, model } of collections) {
    try {
      const count = await model.countDocuments();
      const icon = count > 1000 ? '⚠️' : '✅';
      console.log(`   ${icon} ${name}: ${count} documents`);
      
      if (count > 1000) {
        console.log(`      └─ Consider pagination for large collections`);
      }
    } catch (err) {
      console.log(`   ⚠️ ${name}: Could not count - ${err.message}`);
    }
  }

  // Test 4: Memory usage check
  console.log('\n4️⃣ Memory usage after queries...');
  const memUsage = process.memoryUsage();
  console.log(`   Heap used: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  console.log(`   Heap total: ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);

  // Summary
  console.log('\n========================================');
  console.log('📋 PERFORMANCE RECOMMENDATIONS');
  console.log('========================================');
  console.log('  ✅ Use .lean() for read-only queries');
  console.log('  ✅ Use .limit() to prevent large transfers');
  console.log('  ✅ Use .select() to fetch only needed fields');
  console.log('  ✅ Add indexes on frequently filtered fields');
  console.log('========================================\n');

  console.log('🏁 PERFORMANCE TEST COMPLETE\n');

  process.exit(0);
}

runPerformanceTest().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
