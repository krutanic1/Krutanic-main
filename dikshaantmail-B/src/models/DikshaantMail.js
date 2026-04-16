import mongoose from 'mongoose';

const dikshaantMailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, default: 'pending' }, // pending, sent, failed
  lastSent: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const DikshaantMail = mongoose.model('DikshaantMail', dikshaantMailSchema, 'dikshaant_mails');
