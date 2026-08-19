/**
 * Practice Module Seed Script
 * Run: node BACKEND/scripts/seedPractice.js
 *
 * Seeds one full path: Practice Python
 * → Topic: Introduction, Output and Math Operators
 *   → Subtopic: Output / printing in Python
 *     → 4 Questions (first fully detailed, others with full options too)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const PracticePath = require('../models/PracticePath');
const PracticeTopic = require('../models/PracticeTopic');
const PracticeSubtopic = require('../models/PracticeSubtopic');
const PracticeQuestion = require('../models/PracticeQuestion');

const DB_URL = process.env.DB_NAME;

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(DB_URL);
  console.log('✅ Connected to MongoDB');

  // Clean up existing seed data (idempotent)
  await PracticeQuestion.deleteMany({ tags: 'seed' });
  await PracticeSubtopic.deleteMany({ slug: 'output-printing-in-python' });
  await PracticeTopic.deleteMany({ slug: 'introduction-output-math-operators' });
  await PracticePath.deleteMany({ slug: 'practice-python' });
  console.log('🧹 Cleaned up existing seed data');

  // ── 1. Create Practice Path ─────────────────
  const path = await PracticePath.create({
    title: 'Practice Python',
    slug: 'practice-python',
    description: 'Learn Python through beginner-friendly MCQs and coding exercises covering print statements, variables, data types, and more.',
    level: 'Beginner',
    themeColor: '#3b82f6',
    gradientFrom: '#3b82f6',
    gradientTo: '#1d4ed8',
    estimatedDuration: '8 hours',
    order: 1,
    isPublished: true,
  });
  console.log(`✅ Created path: ${path.title}`);

  // ── 2. Create Topic ──────────────────────────
  const topic = await PracticeTopic.create({
    practicePath: path._id,
    title: 'Introduction, Output and Math Operators',
    slug: 'introduction-output-math-operators',
    description: 'Python programs covering print statements, basic math operations, and foundational concepts.',
    order: 1,
    isPublished: true,
  });
  console.log(`✅ Created topic: ${topic.title}`);

  // ── 3. Create Subtopic ───────────────────────
  const subtopic = await PracticeSubtopic.create({
    topic: topic._id,
    practicePath: path._id,
    title: 'Output / Printing in Python',
    slug: 'output-printing-in-python',
    description: 'Practice questions on Python\'s print() function and basic output operations.',
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
    tags: ['python', 'output', 'beginner', 'seed'],
  };

  // Question 1 — Full with 4 options
  const q1 = await PracticeQuestion.create({
    ...questionBase,
    title: 'Sum and Print - MCQ',
    slug: 'sum-and-print-mcq',
    difficulty: 'Easy',
    statement: 'What does the following code snippet do?\n\nprint(21 + 40)',
    codeSnippet: 'print(21 + 40)',
    codeLanguage: 'python',
    options: [
      { text: 'Reads two numbers from the console', isCorrect: false },
      { text: 'Adds two numbers and prints the result', isCorrect: true },
      { text: 'Multiplies two numbers and prints the result', isCorrect: false },
      { text: 'None of the above', isCorrect: false },
    ],
    explanation: 'The expression `21 + 40` is evaluated first by Python\'s arithmetic operator (+), which gives 61. Then `print()` displays the result. There is no user input here — both numbers are hardcoded literals.',
    order: 1,
  });
  console.log(`✅ Created question: ${q1.title}`);

  // Question 2
  const q2 = await PracticeQuestion.create({
    ...questionBase,
    title: 'Print Coding Chef',
    slug: 'print-coding-chef',
    difficulty: 'Easy',
    statement: 'Which of the following correctly prints the text "Coding Chef" in Python?',
    codeSnippet: '',
    options: [
      { text: 'print("Coding Chef")', isCorrect: true },
      { text: 'echo("Coding Chef")', isCorrect: false },
      { text: 'console.log("Coding Chef")', isCorrect: false },
      { text: 'printf("Coding Chef")', isCorrect: false },
    ],
    explanation: 'In Python, `print()` is the built-in function for displaying output. `echo` is used in PHP/shell, `console.log` is JavaScript, and `printf` is C/C++.',
    order: 2,
  });
  console.log(`✅ Created question: ${q2.title}`);

  // Question 3
  const q3 = await PracticeQuestion.create({
    ...questionBase,
    title: 'Identify Correct Syntax',
    slug: 'identify-correct-syntax',
    difficulty: 'Easy',
    statement: 'Which of the following is the correct syntax to print "Hello, World!" in Python?',
    options: [
      { text: 'PRINT("Hello, World!")', isCorrect: false },
      { text: 'Print("Hello, World!")', isCorrect: false },
      { text: 'print("Hello, World!")', isCorrect: true },
      { text: 'print[Hello, World!]', isCorrect: false },
    ],
    explanation: 'Python is case-sensitive. The correct function is `print()` with lowercase letters. Using square brackets instead of parentheses would cause a TypeError.',
    order: 3,
  });
  console.log(`✅ Created question: ${q3.title}`);

  // Question 4
  const q4 = await PracticeQuestion.create({
    ...questionBase,
    title: 'Print Difference of 10 and 3',
    slug: 'print-difference-of-10-and-3',
    difficulty: 'Easy',
    statement: 'What is the output of the following Python code?\n\nprint(10 - 3)',
    codeSnippet: 'print(10 - 3)',
    codeLanguage: 'python',
    options: [
      { text: '103', isCorrect: false },
      { text: '13', isCorrect: false },
      { text: '7', isCorrect: true },
      { text: 'Error', isCorrect: false },
    ],
    explanation: 'The `-` operator subtracts 3 from 10, giving 7. The `print()` function then displays 7 to the console.',
    order: 4,
  });
  console.log(`✅ Created question: ${q4.title}`);

  console.log('\n🎉 Seed complete!');
  console.log(`   Path: ${path.title} (slug: ${path.slug})`);
  console.log(`   Topic: ${topic.title}`);
  console.log(`   Subtopic: ${subtopic.title}`);
  console.log(`   Questions: 4`);
  console.log('\n   Visit /practice to see the seeded data.');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
