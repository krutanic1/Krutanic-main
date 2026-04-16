const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ProgramProgress,
    AssignmentStats,
    InternshipReadiness,
    WeeklyPractical,
    PlacementReadiness
} = require('../models/DashboardMetrics');

/**
 * GET /api/dashboard/:userId
 * Returns all metrics for a user including the assignment matrix and 24-week readiness.
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId: userIdStr } = req.params;

        // Convert string userId to ObjectId (localStorage stores it as a string)
        if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const userId = new mongoose.Types.ObjectId(userIdStr);

        const [program, stats, readiness, placement] = await Promise.all([
            ProgramProgress.findOne({ userId }),
            AssignmentStats.findOne({ userId }),
            InternshipReadiness.findOne({ userId }),
            PlacementReadiness.findOne({ userId }),
        ]);

        // Default level object
        const defaultLevel = { bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' };

        // Convert to plain JS first — spreading Mongoose subdocuments returns empty objects
        const statsObj = stats ? stats.toObject() : null;
        const levels = statsObj?.levels || {};
        const assignmentMatrix = [
            { levelName: 'Beginner', ...defaultLevel, ...(levels.Beginner || {}) },
            { levelName: 'Intermediate', ...defaultLevel, ...(levels.Intermediate || {}) },
            { levelName: 'Advanced', ...defaultLevel, ...(levels.Advanced || {}) },
        ];
        console.log(`[Dashboard] userId=${userIdStr} | assignmentStats found=${!!stats}`);

        // Build 24-week data
        const allWeeks = await WeeklyPractical.find({ userId });
        const weeklyProgress = Array.from({ length: 24 }, (_, i) => {
            const week = allWeeks.find(w => w.weekNumber === i + 1);
            return { week: i + 1, status: week?.status || 'Pending' };
        });

        const completedWeeks = readiness?.totalCompletedWeeks || 0;
        const readinessScore = readiness?.readinessScore || 0;

        res.json({
            // Legacy stat card data (kept for backwards compat with OverviewPage)
            programCompletion: program || { completedSessions: 0, totalSessions: 100, percentage: 0 },
            assignmentStats: stats || { levels: { Beginner: defaultLevel, Intermediate: defaultLevel, Advanced: defaultLevel } },
            internshipStatus: {
                status: readiness?.internshipStatus || 'Not Eligible',
                phase: readiness?.internshipStatus || 'Not Eligible',
            },
            placementReadiness: placement || { scorePercentage: 0, notes: '' },

            // New matrix data
            assignmentMatrix,
            internshipReadiness: {
                totalWeeks: 24,
                completedWeeks,
                pendingWeeks: 24 - completedWeeks,
                readinessScore: parseFloat(readinessScore.toFixed(1)),
                internshipStatus: readiness?.internshipStatus || 'Not Eligible',
                weeklyProgress,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ error: 'Server error fetching metrics' });
    }
});

/**
 * PATCH /api/dashboard/:userId
 * Updates specified legacy metrics (program completion, placement readiness).
 */
router.patch('/:userId', async (req, res) => {
    try {
        const { userId: userIdStr } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const userId = new mongoose.Types.ObjectId(userIdStr);
        const updates = req.body;
        const responseData = {};

        if (updates.programCompletion) {
            let prog = await ProgramProgress.findOne({ userId });
            if (!prog) prog = new ProgramProgress({ userId });
            if (updates.programCompletion.completedSessions !== undefined) prog.completedSessions = updates.programCompletion.completedSessions;
            if (updates.programCompletion.totalSessions !== undefined) prog.totalSessions = updates.programCompletion.totalSessions;
            if (prog.totalSessions > 0) {
                prog.percentage = Math.round((prog.completedSessions / prog.totalSessions) * 100);
            }
            await prog.save();
            responseData.programCompletion = prog;
        }

        if (updates.placementReadiness) {
            let place = await PlacementReadiness.findOne({ userId });
            if (!place) place = new PlacementReadiness({ userId });
            if (updates.placementReadiness.scorePercentage !== undefined) place.scorePercentage = updates.placementReadiness.scorePercentage;
            if (updates.placementReadiness.notes !== undefined) place.notes = updates.placementReadiness.notes;
            await place.save();
            responseData.placementReadiness = place;
        }

        res.json({ message: 'Metrics updated successfully', updatedMetrics: responseData });
    } catch (error) {
        console.error('Error updating dashboard metrics:', error);
        res.status(500).json({ error: 'Server error updating metrics' });
    }
});

module.exports = router;
