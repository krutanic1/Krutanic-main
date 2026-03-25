const mongoose = require('mongoose');

const adminMailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, {
  timestamps: true,
  collection: 'adminmails'
});

module.exports = mongoose.model('AdminMail', adminMailSchema);
