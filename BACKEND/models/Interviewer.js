const mongoose = require("mongoose");

const interviewerSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Interview",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interviewer", interviewerSchema);
