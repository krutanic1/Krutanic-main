const mongoose = require('mongoose');

const assessmentSlotSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true, // e.g., 'YYYY-MM-DD'
    },
    timeSlot: {
        type: String,
        required: true, // e.g., '16:30', '17:00'
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CareerAssessment'
    },
    lockedUntil: {
        type: Date // To handle temporary locks during payment
    }
}, { timestamps: true });

// Compound index to ensure a specific time slot on a specific date is unique
assessmentSlotSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('AssessmentSlot', assessmentSlotSchema);
