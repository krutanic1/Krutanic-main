const mongoose = require("mongoose");

const AptitudeQuestionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["Easy", "Medium", "Hard"]
    },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model("AptitudeQuestion", AptitudeQuestionSchema);
