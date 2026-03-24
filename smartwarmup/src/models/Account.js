const mongoose = require('mongoose');

/**
 * Account Model (Mapped to 'mailsenders' collection)
 */
const senderSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  label: { type: String, default: '' },
  warmup: {
    enabled: { type: Boolean, default: true }, // Defaulting to true for warmup accounts
    dailyLimit: { type: Number, default: 50 },
    sentToday: { type: Number, default: 0 },
    warmupStartDate: { type: Date, default: Date.now }
  }
}, { //ghjkl;'
  timestamps: true,
  collection: 'mailsenders' // Explicitly map to the existing collection
});

module.exports = mongoose.model('Account', senderSchema);
