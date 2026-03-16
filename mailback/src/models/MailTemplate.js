import mongoose from 'mongoose';

const mailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Untitled', trim: true },
    // variadic arrays — randomly composed per batch for anti-spam variation
    subjects:         [{ type: String }],
    greetings:        [{ type: String }],
    body_paragraphs:  [{ type: String }],
    links:            [{ type: String }],
    closings:         [{ type: String }],
    signatures:       [{ type: String }],
    // legacy plain-string format (kept for backward compatibility)
    subject: { type: String, default: '', trim: true },
    body:    { type: String, default: '' },
    link:    { type: String, default: '' }

  },
  {
    timestamps: true,
    collection: 'mailtemp'
  }
);

export const MailTemplate = mongoose.model('MailTemplate', mailTemplateSchema);
