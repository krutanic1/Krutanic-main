const mongoose = require('mongoose');

/**
 * WarmupJob Schema
 * Represents an individual email task in the queue.
 */
const WarmupJobSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'done', 'failed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['send', 'reply'],
    default: 'send'
  },
  attempts: {
    type: Number,
    default: 0
  },
  error: {
    type: String
  }
}, { timestamps: true });

// --- Indexes ---

// 1. For the worker: Efficiently find pending jobs that are ready to run.
// This compound index allows the database to filter by status and sort/filter by scheduledAt in one pass.
WarmupJobSchema.index({ status: 1, scheduledAt: 1 });

// 2. For the dashboard: Quickly find all jobs related to a specific account.
WarmupJobSchema.index({ accountId: 1 });

module.exports = mongoose.model('WarmupJob', WarmupJobSchema);
