const express = require('express');
const router = express.Router();
const { WeeklyPractical, InternshipReadiness } = require('../models/DashboardMetrics');
const authMiddleware = require("../middleware/UserAuth");

/**
 * GET /api/practicals/:userId
 * Returns all 24 weeks of practical status for a user.
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const allWeeks = await WeeklyPractical.find({ userId });
        const weeklyProgress = Array.from({ length: 24 }, (_, i) => {
            const week = allWeeks.find(w => w.weekNumber === i + 1);
            return { week: i + 1, status: week?.status || 'Pending', _id: week?._id };
        });
        res.json({ weeklyProgress });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /api/practicals/submit
 * Allows a learner to submit their notes/work for a specific week.
 * Body: { userId, weekNumber, submissionData }
 */
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { userId, weekNumber, submissionData } = req.body;
        if (!userId || !weekNumber) {
            return res.status(400).json({ error: 'userId and weekNumber are required' });
        }
        if (userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized user ID' });
        }

        let week = await WeeklyPractical.findOne({ userId, weekNumber });
        if (!week) {
            week = new WeeklyPractical({ userId, weekNumber });
        }

        week.submissionData = submissionData || '';
        week.status = 'Submitted';
        week.submittedAt = new Date();
        await week.save();

        res.json({ message: `Week ${weekNumber} submitted successfully`, week });
    } catch (error) {
        console.error('Error submitting practical:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * PATCH /api/practicals/:id/approve
 * Admin approves a weekly practical. Auto-recalculates InternshipReadiness.
 */
router.patch('/:id/approve', async (req, res) => {
    try {
        const week = await WeeklyPractical.findById(req.params.id);
        if (!week) return res.status(404).json({ error: 'Week not found' });

        week.status = 'Approved';
        week.approvedAt = new Date();
        await week.save();

        // Recalculate internship readiness for this user
        const approvedWeeks = await WeeklyPractical.countDocuments({ userId: week.userId, status: 'Approved' });
        const readinessScore = Math.round((approvedWeeks / 24) * 100);
        let internshipStatus = 'Not Eligible';
        if (readinessScore > 80) internshipStatus = 'Eligible for Internship';
        else if (readinessScore > 40) internshipStatus = 'In Progress';

        let readiness = await InternshipReadiness.findOne({ userId: week.userId });
        if (!readiness) readiness = new InternshipReadiness({ userId: week.userId });
        readiness.totalCompletedWeeks = approvedWeeks;
        readiness.readinessScore = readinessScore;
        readiness.internshipStatus = internshipStatus;
        await readiness.save();

        res.json({ message: 'Week approved', readiness });
    } catch (error) {
        console.error('Error approving practical:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * PATCH /api/practicals/:id/reject
 * Admin rejects a practical.
 */
router.patch('/:id/reject', async (req, res) => {
    try {
        const week = await WeeklyPractical.findById(req.params.id);
        if (!week) return res.status(404).json({ error: 'Week not found' });
        week.status = 'Rejected';
        await week.save();
        res.json({ message: 'Week rejected', week });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
