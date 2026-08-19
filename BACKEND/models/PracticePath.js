const mongoose = require('mongoose');

const practicePathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#6366f1',
    },
    gradientFrom: {
      type: String,
      default: '#6366f1',
    },
    gradientTo: {
      type: String,
      default: '#8b5cf6',
    },
    estimatedDuration: {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'practiceuser',
    },
  },
  { timestamps: true }
);

practicePathSchema.index({ slug: 1 }, { unique: true });
practicePathSchema.index({ isPublished: 1, order: 1 });

module.exports = mongoose.model('PracticePath', practicePathSchema);
