const express = require('express');
const router = express.Router();
const AssignmentAttempt = require('../models/AssignmentAttempt');
const { AssignmentStats } = require('../models/DashboardMetrics');

// POST /api/assignments/attempt
router.post('/attempt', async (req, res) => {
    try {
        const { userId, level, score, maxScore } = req.body;

        if (!userId || !level || score === undefined || !maxScore) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const percentage = Math.round((score / maxScore) * 100);

        // Record the attempt
        const attempt = new AssignmentAttempt({
            userId, level, score, maxScore, percentage
        });
        await attempt.save();

        // Update User Assignment Stats
        let stats = await AssignmentStats.findOne({ userId });
        if (!stats) {
            stats = new AssignmentStats({ userId });
        }

        const levelData = stats.levels[level];
        levelData.attemptsCount += 1;
        levelData.latestScore = percentage;

        if (percentage > levelData.bestScore) {
            levelData.bestScore = percentage;
        }

        // Determine status dynamically
        // E.g., if best score is 100, Completed. Else if best score > 0, In Progress. Else Not Started.
        if (levelData.bestScore >= 80) { // Or 100
            levelData.status = 'Completed';
        } else if (levelData.bestScore > 0) {
            levelData.status = 'In Progress';
        } else {
            levelData.status = 'Not Started';
        }

          await stats.save();

        res.json({ message: 'Attempt recorded', attempt, stats: stats.levels[level] });

    } catch (error) {
        console.error('Error saving assignment attempt:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
