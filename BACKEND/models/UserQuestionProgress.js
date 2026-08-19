const mongoose = require('mongoose');

const userQuestionProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'practiceuser',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeQuestion',
      required: true,
    },
    practicePath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticePath',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeTopic',
      required: true,
    },
    subtopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeSubtopic',
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['not_started', 'attempted', 'solved'],
      default: 'not_started',
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    lastAttemptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure one progress record per user-question pair
userQuestionProgressSchema.index({ user: 1, question: 1 }, { unique: true });
// For progress aggregation per path/topic
userQuestionProgressSchema.index({ user: 1, practicePath: 1 });
userQuestionProgressSchema.index({ user: 1, topic: 1 });
userQuestionProgressSchema.index({ user: 1, subtopic: 1 });

module.exports = mongoose.model('UserQuestionProgress', userQuestionProgressSchema);
