import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { runWarmupForSenders } from './engine/engagement-bot.js';

dotenv.config();

const app = express();
const port = process.env.WARMUP_PORT || 5005;

app.use(cors());
app.use(express.json());

// Database Connection (Compatible with the main app)
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB for Warm-up'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Sender Schema (Read-only for the existing MailSender collection)
const senderSchema = new mongoose.Schema({
  user: String,
  label: String,
  blastedCount: Number,
}, { strict: false });

const Sender = mongoose.model('MailSender', senderSchema);

// API Endpoints
app.get('/api/senders', async (req, res) => {
  try {
    const senders = await Sender.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, senders });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/senders', async (req, res) => {
  try {
    const { user, pass, label } = req.body;
    // Note: In production, encryption should be handled here or in the model pre-save.
    // The current MailSender model in main app handles it.
    const newSender = new Sender({ user, pass, label });
    await newSender.save();
    res.json({ ok: true, sender: newSender });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/warmup/trigger', async (req, res) => {
  const { senderIds, seeds } = req.body;
  
  if (!senderIds || !Array.isArray(senderIds)) {
    return res.status(400).json({ ok: false, message: 'Invalid senderIds' });
  }

  // Trigger warmup in background to avoid timeout
  runWarmupForSenders(senderIds, seeds)
    .then(() => console.log('🏁 Bulk warmup cycle finished.'))
    .catch(err => console.error('🔥 Bulk warmup error:', err));

  res.json({ ok: true, message: `Started warmup for ${senderIds.length} senders.` });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'Warm-up API is alive' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Warm-up Backend running at http://localhost:${port}`);
  });
}
