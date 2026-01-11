const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    course: { type: String, required: true }, // Course Title
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }, // The correct option string
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
