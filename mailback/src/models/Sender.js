import mongoose from 'mongoose';

const senderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, trim: true, unique: true },
    pass: { type: String, required: true },
    label: { type: String, default: '' },
    blastedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Sender = mongoose.model('MailSender', senderSchema);
