const mongoose = require('mongoose');

const practiceSubtopicSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticeTopic',
      required: true,
    },
    practicePath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PracticePath',
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
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Slug unique within a topic
practiceSubtopicSchema.index({ topic: 1, slug: 1 }, { unique: true });
practiceSubtopicSchema.index({ topic: 1, order: 1 });
practiceSubtopicSchema.index({ practicePath: 1 });

module.exports = mongoose.model('PracticeSubtopic', practiceSubtopicSchema);
