const mongoose = require("mongoose");

const InterviewQuestionSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    questions: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model("InterviewQuestion", InterviewQuestionSchema);
