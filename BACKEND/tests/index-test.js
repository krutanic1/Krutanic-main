/**
 * Index Verification Test
 * Run: node tests/index-test.js
 * 
 * Validates:
 * - Indexes exist on collections
 * - Queries use IXSCAN (not COLLSCAN)
 * - No collection scans on heavy endpoints
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
const User = require('../models/User');
const NewEnroll = require('../models/NewStudentEnroll');
const Certificate = require('../models/Certificate');

async function testIndexes() {
  console.log('\n🧪 === INDEX VERIFICATION TEST ===\n');

  await connectDB();

  // Test 1: List all indexes
  console.log('1️⃣ Checking existing indexes...\n');
  
  const collections = [
    { name: 'User', model: User },
    { name: 'NewEnroll', model: NewEnroll },
    { name: 'Certificate', model: Certificate },
  ];

  for (const { name, model } of collections) {
    try {
      const indexes = await model.collection.getIndexes();
      console.log(`   📁 ${name} indexes:`);
      Object.keys(indexes).forEach(idx => {
        console.log(`      - ${idx}: ${JSON.stringify(indexes[idx].key)}`);
      });
      console.log('');
    } catch (err) {
      console.log(`   ⚠️ ${name}: ${err.message}\n`);
    }
  }

  // Test 2: Explain queries to check index usage
  console.log('2️⃣ Testing query execution plans...\n');

  const queryTests = [
    {
      name: 'User by email',
      test: () => User.findOne({ email: 'test@example.com' }).explain('executionStats'),
    },
    {
      name: 'Users by status',
      test: () => User.find({ status: 'active' }).limit(10).explain('executionStats'),
    },
    {
      name: 'NewEnroll sorted by createdAt',
      test: () => NewEnroll.find().sort({ createdAt: -1 }).limit(10).explain('executionStats'),
    },
    {
      name: 'Certificate by email',
      test: () => Certificate.findOne({ email: 'test@example.com' }).explain('executionStats'),
    },
  ];

  for (const { name, test } of queryTests) {
    try {
      const explanation = await test();
      const stage = explanation?.queryPlanner?.winningPlan?.stage || 
                    explanation?.queryPlanner?.winningPlan?.inputStage?.stage ||
                    'UNKNOWN';
      
      const isIndexed = stage === 'IXSCAN' || stage === 'IDHACK' || stage === 'FETCH';
      const docsExamined = explanation?.executionStats?.totalDocsExamined || 0;
      
      if (isIndexed || docsExamined === 0) {
        console.log(`   ✅ ${name}: ${stage} (efficient)`);
      } else {
        console.log(`   ⚠️ ${name}: ${stage} - examined ${docsExamined} docs`);
      }
    } catch (err) {
      console.log(`   ⚠️ ${name}: Could not explain - ${err.message}`);
    }
  }

  // Test 3: Ensure indexes
  console.log('\n3️⃣ Ensuring indexes are created...');
  
  try {
    await User.createIndexes();
    await NewEnroll.createIndexes();
    await Certificate.createIndexes();
    console.log('   ✅ All model indexes ensured');
  } catch (err) {
    console.log(`   ❌ Error creating indexes: ${err.message}`);
  }

  console.log('\n========================================');
  console.log('🏁 INDEX TEST COMPLETE');
  console.log('========================================\n');

  process.exit(0);
}

testIndexes().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
