const mongoose = require('mongoose');

const assignmentAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true }, // 20 for Beginner, 15 for Intermediate, 10 for Advanced
    percentage: { type: Number, required: true },
    attemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const AssignmentAttempt = mongoose.model('AssignmentAttempt', assignmentAttemptSchema);
//dfghjkl;'
module.exports = AssignmentAttempt;
