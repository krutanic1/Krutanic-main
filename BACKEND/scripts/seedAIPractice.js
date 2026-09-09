/**
 * Practice Module Seed Script for AI
 * Run: node BACKEND/scripts/seedAIPractice.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const PracticePath = require('../models/PracticePath');
const PracticeTopic = require('../models/PracticeTopic');
const PracticeSubtopic = require('../models/PracticeSubtopic');
const PracticeQuestion = require('../models/PracticeQuestion');

const DB_URL = process.env.DB_NAME || 'mongodb://localhost:27017/krutanic';

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(DB_URL);
  console.log('✅ Connected to MongoDB');

  // Clean up existing seed data (idempotent)
  await PracticeQuestion.deleteMany({ tags: 'ai-seed' });
  await PracticeSubtopic.deleteMany({ slug: 'ai-basics-subtopic' });
  await PracticeTopic.deleteMany({ slug: 'intro-to-ai' });
  await PracticePath.deleteMany({ slug: 'artificial-intelligence' });
  console.log('🧹 Cleaned up existing seed data');

  // ── 1. Create Practice Path ─────────────────
  const path = await PracticePath.create({
    title: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Learn the fundamentals of Artificial Intelligence, covering basic algorithms, machine learning concepts, neural networks, and more.',
    level: 'Beginner',
    themeColor: '#8b5cf6',
    gradientFrom: '#8b5cf6',
    gradientTo: '#4c1d95',
    estimatedDuration: '10 hours',
    order: 2,
    isPublished: true,
  });
  console.log(`✅ Created path: ${path.title}`);

  // ── 2. Create Topic ──────────────────────────
  const topic = await PracticeTopic.create({
    practicePath: path._id,
    title: 'Introduction to AI',
    slug: 'intro-to-ai',
    description: 'Foundational concepts of Artificial Intelligence, its history, and basic terminology.',
    order: 1,
    isPublished: true,
  });
  console.log(`✅ Created topic: ${topic.title}`);

  // ── 3. Create Subtopic ───────────────────────
  const subtopic = await PracticeSubtopic.create({
    topic: topic._id,
    practicePath: path._id,
    title: 'AI Basics',
    slug: 'ai-basics-subtopic',
    description: 'Practice questions on basic AI definitions and history.',
    order: 1,
    isPublished: true,
  });
  console.log(`✅ Created subtopic: ${subtopic.title}`);

  // ── 4. Create Questions ───────────────────────
  const questionBase = {
    practicePath: path._id,
    topic: topic._id,
    subtopic: subtopic._id,
    type: 'mcq',
    isPublished: true,
    tags: ['ai', 'beginner', 'ai-seed'],
  };

  const q1 = await PracticeQuestion.create({
    ...questionBase,
    title: 'What is AI?',
    slug: 'what-is-ai-mcq',
    difficulty: 'Easy',
    statement: 'What does AI stand for?',
    options: [
      { text: 'Artificial Internet', isCorrect: false },
      { text: 'Artificial Intelligence', isCorrect: true },
      { text: 'Automated Intelligence', isCorrect: false },
      { text: 'Advanced Integration', isCorrect: false },
    ],
    explanation: 'AI stands for Artificial Intelligence, which refers to the simulation of human intelligence in machines.',
    order: 1,
  });
  console.log(`✅ Created question: ${q1.title}`);

  console.log('\n🎉 Seed complete!');
  console.log(`   Path: ${path.title} (slug: ${path.slug})`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
