const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    }, // Advance Course Title
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    }, // Must match one of the options
    explanation: {
        type: String,
        default: ""
    }, // Optional explanation for the correct answer
    topic: {
        type: String,
        default: ""
    }, // Optional sub-topic
    version: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    } // Used for soft-deletes to prevent orphaned active tests
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
