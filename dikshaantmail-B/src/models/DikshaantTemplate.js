import mongoose from 'mongoose';

const dikshaantTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Untitled', trim: true },
    subjects:         [{ type: String }],
    greetings:        [{ type: String }],
    body_paragraphs:  [{ type: String }],
    links:            [{ type: String }],
    closings:         [{ type: String }],
    signatures:       [{ type: String }],
    subject: { type: String, default: '', trim: true },
    body:    { type: String, default: '' },
    link:    { type: String, default: '' }
  },
  {
    timestamps: true,
    collection: 'dikshaant_templates'
  }
);

export const DikshaantTemplate = mongoose.model('DikshaantTemplate', dikshaantTemplateSchema);
