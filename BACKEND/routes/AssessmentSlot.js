const express = require('express');
const router = express.Router();
const AssessmentSlot = require('../models/AssessmentSlot');

// Get all slots for a given date
router.get('/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const slots = await AssessmentSlot.find({ date });
        res.status(200).json(slots);
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
