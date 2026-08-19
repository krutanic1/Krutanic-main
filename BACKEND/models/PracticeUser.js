const mongoose = require('mongoose');

const practiceUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    practiceRole: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for fast lookups
practiceUserSchema.index({ practiceRole: 1 });

module.exports = mongoose.model('practiceuser', practiceUserSchema);
