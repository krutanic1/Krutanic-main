const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    lat: {
        type: Number,
        required: false
    },
    lng: {
        type: Number,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    deviceInfo: {
        type: String,
        required: false
    },
    isHalfDayOverride: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure a user can only have one attendance record per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Optimize monthly aggregation queries
attendanceSchema.index({ userId: 1, timestamp: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
