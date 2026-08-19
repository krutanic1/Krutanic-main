const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: true }
);

const practiceQuestionSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'coding'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    statement: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    codeLanguage: {
      type: String,
      default: '',
    },
    // For MCQ: array of options. Default 4 options.
    options: {
      type: [optionSchema],
      default: [],
      validate: {
        validator: function (opts) {
          // For MCQ, require at least 2 options and exactly 1 correct
          if (this.type === 'mcq') {
            if (opts.length < 2) return false;
            const correctCount = opts.filter((o) => o.isCorrect).length;
            return correctCount === 1;
          }
          return true;
        },
        message: 'MCQ questions must have at least 2 options with exactly 1 correct answer.',
      },
    },
    explanation: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'practiceuser',
    },
    // Aggregate counters — updated on each submission for fast display
    attemptCount: {
      type: Number,
      default: 0,
    },
    solveCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Slug unique globally
practiceQuestionSchema.index({ slug: 1 }, { unique: true });
practiceQuestionSchema.index({ practicePath: 1, isPublished: 1, order: 1 });
practiceQuestionSchema.index({ subtopic: 1, isPublished: 1, order: 1 });
practiceQuestionSchema.index({ topic: 1, isPublished: 1 });
practiceQuestionSchema.index({ tags: 1 });

module.exports = mongoose.model('PracticeQuestion', practiceQuestionSchema);
