import mongoose from 'mongoose';
import './load_env.js';
console.log('KEY:', process.env.MAILBLASTER_ENCRYPTION_KEY);
import { Sender } from './src/models/Sender.js';
import { encrypt } from './src/utils/cryptoUtils.js';

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const senders = await Sender.find();
    let count = 0;
    for (const s of senders) {
      if (!s.pass.includes(':')) {
        console.log(`Encrypting password for ${s.user}...`);
        s.pass = encrypt(s.pass);
        await s.save();
        count++;
      }
    }
    console.log('Migration completed. Total migrated:', count);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
//sdfghjkl;'
migrate();
