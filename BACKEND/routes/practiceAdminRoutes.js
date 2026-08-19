const express = require('express');
const router = express.Router();
const practiceAdminAuth = require('../middleware/practiceAdminAuth');
const {
  adminListPaths, createPath, updatePath, deletePath,
  adminListTopics, createTopic, updateTopic, deleteTopic,
  adminListSubtopics, createSubtopic, updateSubtopic, deleteSubtopic,
  adminListQuestions, getAdminQuestion, createQuestion, updateQuestion, deleteQuestion,
  adminStats,
} = require('../controllers/practiceAdminController');

// All routes below require practiceRole === 'admin'

// ─── Stats ───────────────────────────────────
router.get('/admin/practice/stats', practiceAdminAuth, adminStats);

// ─── Practice Paths ───────────────────────────
router.get('/admin/practice-paths', practiceAdminAuth, adminListPaths);
router.post('/admin/practice-paths', practiceAdminAuth, createPath);
router.put('/admin/practice-paths/:id', practiceAdminAuth, updatePath);
router.delete('/admin/practice-paths/:id', practiceAdminAuth, deletePath);

// ─── Topics ────────────────────────────────────
router.get('/admin/practice/topics', practiceAdminAuth, adminListTopics);
router.post('/admin/topics', practiceAdminAuth, createTopic);
router.put('/admin/topics/:id', practiceAdminAuth, updateTopic);
router.delete('/admin/topics/:id', practiceAdminAuth, deleteTopic);

// ─── Subtopics ─────────────────────────────────
router.get('/admin/practice/subtopics', practiceAdminAuth, adminListSubtopics);
router.post('/admin/subtopics', practiceAdminAuth, createSubtopic);
router.put('/admin/subtopics/:id', practiceAdminAuth, updateSubtopic);
router.delete('/admin/subtopics/:id', practiceAdminAuth, deleteSubtopic);

// ─── Questions ─────────────────────────────────
router.get('/admin/questions', practiceAdminAuth, adminListQuestions);
router.get('/admin/questions/:id', practiceAdminAuth, getAdminQuestion);
router.post('/admin/questions', practiceAdminAuth, createQuestion);
router.put('/admin/questions/:id', practiceAdminAuth, updateQuestion);
router.delete('/admin/questions/:id', practiceAdminAuth, deleteQuestion);

module.exports = router;
