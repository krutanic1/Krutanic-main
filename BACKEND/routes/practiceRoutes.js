const express = require('express');
const router = express.Router();
const practiceAuth = require('../middleware/practiceAuth');
const {
  listPaths,
  getPath,
  getSubtopicQuestions,
  getQuestion,
  submitAnswer,
  getPathProgress,
} = require('../controllers/practiceController');
const optionalPracticeAuth = require('../middleware/optionalPracticeAuth');

// All routes require authentication (login required to view questions)

// GET /api/practice — list all published paths
router.get('/practice', listPaths);

// GET /api/practice/:pathSlug — path detail with topics/subtopics
router.get('/practice/:pathSlug', getPath);

// GET /api/practice/:pathSlug/progress — user progress for a path
router.get('/practice/:pathSlug/progress', practiceAuth, getPathProgress);

// GET /api/practice/question/:questionSlug — single question page
router.get('/practice/question/:questionSlug', optionalPracticeAuth, getQuestion);

// POST /api/practice/question/:questionId/submit — submit MCQ answer
router.post('/practice/question/:questionId/submit', practiceAuth, submitAnswer);

// GET /api/practice/:pathSlug/:topicSlug/:subtopicSlug/questions — subtopic question list
router.get('/practice/:pathSlug/:topicSlug/:subtopicSlug/questions', optionalPracticeAuth, getSubtopicQuestions);

module.exports = router;
