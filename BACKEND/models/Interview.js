const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        interviewName: {
            type: String,
            required: true,
            trim: true,
        },
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interviewer",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            enum: ["Online", "Offline"],
            default: "Online",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        slots: [
            {
                time: { type: String, required: true },
                isBooked: { type: Boolean, default: false },
                studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
                studentName: { type: String, default: null },
                meetingLink: { type: String, default: null },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
