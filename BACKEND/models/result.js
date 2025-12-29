const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  testDate: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Result", ResultSchema);