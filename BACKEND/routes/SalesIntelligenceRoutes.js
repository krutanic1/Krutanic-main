const express = require('express');
const router = express.Router();
const SalesIntelligenceController = require('../controllers/SalesIntelligenceController');

// Define routes for Sales Intelligence Dashboard
router.get('/executive', SalesIntelligenceController.getExecutiveMetrics);
router.get('/lead-sources', SalesIntelligenceController.getLeadAnalytics);
router.get('/sales-funnel', SalesIntelligenceController.getSalesFunnel);
router.get('/counselor-leaderboard', SalesIntelligenceController.getCounselorAnalytics);
router.get('/call-analytics', SalesIntelligenceController.getCallAnalytics);
router.get('/revenue', SalesIntelligenceController.getRevenueAnalytics);
router.get('/student-demographics', SalesIntelligenceController.getStudentAnalytics);
router.get('/ai-insights', SalesIntelligenceController.getAiInsights);

module.exports = router;
