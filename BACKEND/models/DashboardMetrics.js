const mongoose = require('mongoose');

// 1. Program Completion Model
const programProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    completedSessions: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 100 },
    percentage: { type: Number, default: 0 } // Automatically or manually calculated
}, { timestamps: true });

// 2. Assignment Stats Model (Updated for 3-Level Matrix)
const levelSchema = new mongoose.Schema({
    bestScore: { type: Number, default: 0 },
    latestScore: { type: Number, default: 0 },
    attemptsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
}, { _id: false });

const assignmentStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    levels: {
        Beginner: { type: levelSchema, default: () => ({}) },
        Intermediate: { type: levelSchema, default: () => ({}) },
        Advanced: { type: levelSchema, default: () => ({}) }
    }
}, { timestamps: true });

// 3. Internship Readiness Model (Replaces / Combines previous internship tracking)
const internshipReadinessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalCompletedWeeks: { type: Number, default: 0 },
    readinessScore: { type: Number, default: 0 }, // Percentage 0-100
    internshipStatus: {
        type: String,
        enum: ['Not Eligible', 'In Progress', 'Eligible for Internship'],
        default: 'Not Eligible'
    }
}, { timestamps: true });

// 4. Weekly Practical Submission Model (New)
const weeklyPracticalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekNumber: { type: Number, required: true, min: 1, max: 24 },
    submissionData: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    submittedAt: { type: Date },
    approvedAt: { type: Date }
}, { timestamps: true });

// Placement Readiness Model (Kept for backwards compatibility if needed, or we can merge it)
const placementReadinessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    scorePercentage: { type: Number, default: 0 },
    notes: { type: String, default: '' }
}, { timestamps: true });

const ProgramProgress = mongoose.model('ProgramProgress', programProgressSchema);
const AssignmentStats = mongoose.model('AssignmentStats', assignmentStatsSchema);
const InternshipReadiness = mongoose.model('InternshipReadiness', internshipReadinessSchema);
const WeeklyPractical = mongoose.model('WeeklyPractical', weeklyPracticalSchema);
const PlacementReadiness = mongoose.model('PlacementReadiness', placementReadinessSchema);

module.exports = {
    ProgramProgress,
    AssignmentStats,
    InternshipReadiness,
    WeeklyPractical,
    PlacementReadiness
};
