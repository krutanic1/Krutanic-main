const mongoose = require('mongoose');

/**
 * Template Model (Mapped to 'mailtemp' collection)
 */
const mailTemplateSchema = new mongoose.Schema({
  name: { type: String, default: 'Untitled', trim: true },
  subjects: [{ type: String }],
  greetings: [{ type: String }],
  body_paragraphs: [{ type: String }],
  links: [{ type: String }],
  closings: [{ type: String }],
  signatures: [{ type: String }],
  // Legacy fields
  subject: { type: String, default: '', trim: true },
  body: { type: String, default: '' }
}, {
  timestamps: true,
  collection: 'mailtemp'
});

module.exports = mongoose.model('Template', mailTemplateSchema);
