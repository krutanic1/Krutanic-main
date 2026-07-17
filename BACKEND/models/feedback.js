const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        userEmail: { type: String, required: true },
        feedback: []
    },
    {
        timestamps: true
    }
);

const feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = feedback;