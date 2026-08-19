const mongoose = require('mongoose');

const practiceTopicSchema = new mongoose.Schema(
  {
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

// Slug must be unique within a path
practiceTopicSchema.index({ practicePath: 1, slug: 1 }, { unique: true });
practiceTopicSchema.index({ practicePath: 1, order: 1 });

module.exports = mongoose.model('PracticeTopic', practiceTopicSchema);
