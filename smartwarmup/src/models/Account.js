const mongoose = require('mongoose');

/**
 * Account Model (Mapped to 'mailsenders' collection)
 */
const senderSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  label: { type: String, default: '' },
  warmup: {
    enabled: { type: Boolean, default: true },
    dailyLimit: { type: Number, default: 50 },
    sentToday: { type: Number, default: 0 },
    warmupStartDate: { type: Date, default: Date.now }
  },
  smtp: {
    host: String,
    port: Number,
    secure: Boolean
  },
  imap: {
    host: String,
    port: Number,
    secure: Boolean
  }
}, { //ghjkl;'
  timestamps: true,
  collection: 'mailsenders' // Explicitly map to the existing collection
});

module.exports = mongoose.model('Account', senderSchema);
