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
const NewEnrollStudent = require('../models/NewStudentEnroll');
const User = require('../models/User');

/**
 * GET /api/dashboard/:userId
 * Returns all metrics for a user including the assignment matrix and 24-week readiness.
 * Program completion is calculated from watchedSessions in NewEnroll model.
 */
router.get('/:userId', async (req, res) => {
    try {
        const { userId: userIdStr } = req.params;

        // Convert string userId to ObjectId (localStorage stores it as a string)
        if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const userId = new mongoose.Types.ObjectId(userIdStr);

        // Fetch user to get email for enrollment lookup
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch enrollment and other metrics
        const [enrollment, stats, readiness, placement] = await Promise.all([
            NewEnrollStudent.findOne({ email: user.email }).populate('domainId'),
            AssignmentStats.findOne({ userId }),
            InternshipReadiness.findOne({ userId }),
            PlacementReadiness.findOne({ userId }),
        ]);

        // Calculate program completion from watchedSessions
        let programCompletion = { completedSessions: 0, totalSessions: 0, percentage: 0 };
        if (enrollment && enrollment.domainId && enrollment.domainId.session) {
            const totalSessions = Object.keys(enrollment.domainId.session).length;
            const completedSessions = enrollment.watchedSessions ? enrollment.watchedSessions.length : 0;
            const percentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
            programCompletion = { completedSessions, totalSessions, percentage };
        }

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
        console.log(`[Dashboard] userId=${userIdStr} | enrollment found=${!!enrollment} | completedSessions=${programCompletion.completedSessions}/${programCompletion.totalSessions}`);

        // Build 24-week data
        const allWeeks = await WeeklyPractical.find({ userId });
        const weeklyProgress = Array.from({ length: 24 }, (_, i) => {
            const week = allWeeks.find(w => w.weekNumber === i + 1);
            return { week: i + 1, status: week?.status || 'Pending' };
        });

        const completedWeeks = readiness?.totalCompletedWeeks || 0;
        const readinessScore = readiness?.readinessScore || 0;

        res.json({
            // Program completion calculated from watchedSessions in NewEnroll
            programCompletion,
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
 * Updates specified metrics (placement readiness).
 * Note: programCompletion is now auto-calculated from watchedSessions in NewEnroll model.
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

        // Note: programCompletion is now read-only (calculated from watchedSessions)
        // To update program completion, update watchedSessions in NewEnroll model via /enrollments endpoint

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
