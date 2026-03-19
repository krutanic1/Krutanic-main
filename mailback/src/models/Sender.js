import mongoose from 'mongoose';
import { encrypt } from '../utils/cryptoUtils.js';

const senderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, trim: true, unique: true },
    pass: { type: String, required: true },
    label: { type: String, default: '' },
    blastedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Encrypt password before saving
senderSchema.pre('save', function (next) {
  if (this.isModified('pass')) {
    try {
      this.pass = encrypt(this.pass);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export const Sender = mongoose.model('MailSender', senderSchema);
