/**
 * Production Readiness Check
 * Run: node tests/readiness-check.js
 * 
 * Final GO/NO-GO checklist before production
 */

require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const connectDB = require('../config/db');

const User = require('../models/User');
const NewEnroll = require('../models/NewStudentEnroll');
const Certificate = require('../models/Certificate');

const BASE_URL = 'http://localhost:5000';
const checks = [];

function addCheck(name, passed, details = '') {
  checks.push({ name, passed, details });
}

function makeRequest(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, time: Date.now() - startTime });
      });
    }).on('error', () => {
      resolve({ status: 0, time: Date.now() - startTime });
    });
  });
}

async function runReadinessCheck() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║          🚀 PRODUCTION READINESS CHECK                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n');

  // 1. MongoDB Connection
  console.log('1️⃣  MongoDB Connection');
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    addCheck('MongoDB Connected', state === 1);
    console.log(`    ${state === 1 ? '✅' : '❌'} Connection state: ${state === 1 ? 'connected' : 'disconnected'}`);
  } catch (err) {
    addCheck('MongoDB Connected', false, err.message);
    console.log(`    ❌ Connection failed: ${err.message}`);
  }

  // 2. Connection Pool
  console.log('\n2️⃣  Connection Pool Configuration');
  const poolSize = mongoose.connection.getClient().options?.maxPoolSize || 0;
  addCheck('Pool Size >= 20', poolSize >= 20, `Current: ${poolSize}`);
  console.log(`    ${poolSize >= 20 ? '✅' : '⚠️'} Max pool size: ${poolSize}`);

  // 3. Indexes
  console.log('\n3️⃣  Database Indexes');
  const models = [
    { name: 'User', model: User },
    { name: 'NewEnroll', model: NewEnroll },
    { name: 'Certificate', model: Certificate },
  ];

  for (const { name, model } of models) {
    try {
      const indexes = await model.collection.getIndexes();
      const indexCount = Object.keys(indexes).length;
      const hasIndexes = indexCount > 1; // More than just _id
      addCheck(`${name} indexes`, hasIndexes, `${indexCount} indexes`);
      console.log(`    ${hasIndexes ? '✅' : '⚠️'} ${name}: ${indexCount} indexes`);
    } catch (err) {
      addCheck(`${name} indexes`, false, err.message);
      console.log(`    ❌ ${name}: ${err.message}`);
    }
  }

  // 4. API Endpoints
  console.log('\n4️⃣  API Endpoints');
  const endpoints = ['/', '/users?limit=5', '/jobs?limit=5'];
  
  for (const endpoint of endpoints) {
    const result = await makeRequest(endpoint);
    const passed = result.status === 200 && result.time < 5000;
    addCheck(`${endpoint}`, passed, `${result.status} in ${result.time}ms`);
    console.log(`    ${passed ? '✅' : '❌'} ${endpoint}: ${result.status} (${result.time}ms)`);
  }

  // 5. Environment Variables
  console.log('\n5️⃣  Environment Variables');
  const envVars = ['DB_NAME', 'JWT_SECRET', 'NODE_ENV'];
  for (const varName of envVars) {
    const exists = !!process.env[varName];
    addCheck(`ENV: ${varName}`, exists);
    console.log(`    ${exists ? '✅' : '❌'} ${varName}: ${exists ? 'set' : 'MISSING'}`);
  }

  // 6. Error Handling
  console.log('\n6️⃣  Error Handling');
  try {
    const errorHandler = require('../middleware/errorHandler');
    const hasTimeout = typeof errorHandler.requestTimeout === 'function';
    const hasDbError = typeof errorHandler.dbErrorHandler === 'function';
    addCheck('Timeout middleware', hasTimeout);
    addCheck('DB error handler', hasDbError);
    console.log(`    ${hasTimeout ? '✅' : '❌'} Request timeout middleware`);
    console.log(`    ${hasDbError ? '✅' : '❌'} Database error handler`);
  } catch (err) {
    addCheck('Error handlers', false, err.message);
    console.log(`    ❌ Error handlers not found`);
  }

  // Summary
  console.log('\n');
  console.log('══════════════════════════════════════════════════════════════');
  console.log('                        📊 SUMMARY                            ');
  console.log('══════════════════════════════════════════════════════════════');
  
  const passed = checks.filter(c => c.passed).length;
  const failed = checks.filter(c => !c.passed).length;
  const total = checks.length;
  const percentage = ((passed / total) * 100).toFixed(0);

  console.log(`\n    Passed: ${passed}/${total} (${percentage}%)`);
  console.log(`    Failed: ${failed}\n`);

  if (failed > 0) {
    console.log('    ❌ Failed checks:');
    checks.filter(c => !c.passed).forEach(c => {
      console.log(`       - ${c.name} ${c.details ? `(${c.details})` : ''}`);
    });
    console.log('');
  }

  console.log('══════════════════════════════════════════════════════════════');
  
  if (failed === 0) {
    console.log('');
    console.log('    ╔════════════════════════════════════════╗');
    console.log('    ║   🚀 DECISION: GO FOR PRODUCTION       ║');
    console.log('    ╚════════════════════════════════════════╝');
  } else if (failed <= 2) {
    console.log('');
    console.log('    ╔════════════════════════════════════════╗');
    console.log('    ║   ⚠️  DECISION: GO WITH MONITORING     ║');
    console.log('    ╚════════════════════════════════════════╝');
  } else {
    console.log('');
    console.log('    ╔════════════════════════════════════════╗');
    console.log('    ║   ❌ DECISION: NO-GO - FIX ISSUES      ║');
    console.log('    ╚════════════════════════════════════════╝');
  }
  
  console.log('\n══════════════════════════════════════════════════════════════\n');

  process.exit(failed > 2 ? 1 : 0);
}

runReadinessCheck().catch(err => {
  console.error('❌ Readiness check failed:', err.message);
  process.exit(1);
});
