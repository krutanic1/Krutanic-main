import nodemailer from 'nodemailer';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config();

// Helper to decrypt if needed (assuming the model in main app does encryption)
// If we are just reading from DB, we might need the main app's cryptoUtils.
import { decrypt } from '../../../mailback/src/utils/cryptoUtils.js';

/**
 * Main entry point for bulk warmup
 * @param {Array} senderIds - IDs of senders in the database
 * @param {Array} customSeeds - Optional seeds passed from UI
 */
export async function runWarmupForSenders(senderIds, customSeeds = null) {
    console.log(`\n🚀 --- STARTING BULK WARMUP FOR ${senderIds.length} SENDERS ---`);
    
    // Load default seeds if none provided
    let seeds = customSeeds;
    if (!seeds) {
        try {
            const data = await fs.readFile(path.join(process.cwd(), 'seeds.json'), 'utf-8');
            seeds = JSON.parse(data);
        } catch (e) {
            console.error('❌ No seed accounts found.');
            return;
        }
    }

    const Sender = mongoose.model('MailSender');
    const senders = await Sender.find({ _id: { $in: senderIds } }).lean();

    for (const [sIndex, sender] of senders.entries()) {
        console.log(`\n📬 [Sender ${sIndex + 1}/${senders.length}] ${sender.user}`);
        
        const decryptedPass = decrypt(sender.pass);

        for (const [seedIndex, seed] of seeds.entries()) {
            console.log(`   └─ Testing against Seed ${seedIndex + 1}: ${seed.user}`);
            
            const subject = `Reputation Verification - ${sender.user} - ${new Date().toISOString().slice(0, 10)}`;
            const body = `This is a deliverability check for the infrastructure at krutanic.info. Tracking ID: ${Math.random().toString(36).slice(2, 9)}`;

            await sendTestEmail(sender, decryptedPass, seed.user, subject, body);
            
            // Wait for propagation
            await new Promise(r => setTimeout(r, 15000));
            
            await rescueFromSpam(sender.user, seed);
        }
    }
    
    console.log('\n🏁 --- BULK WARMUP COMPLETE ---');
}

async function sendTestEmail(sender, pass, toEmail, subject, body) {
    const transporter = nodemailer.createTransport({
        host: process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.DEFAULT_SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: sender.user,
            pass: pass
        }
    });

    try {
        await transporter.sendMail({
            from: sender.user,
            to: toEmail,
            subject: subject,
            text: body,
            html: `<div style="font-family:sans-serif; padding:15px; border:1px solid #ddd; border-radius:8px;">
                     <h2 style="color:#2563eb;">Infrastructure Verification</h2>
                     <p>${body}</p>
                   </div>`
        });
        console.log(`      ✅ Seed sent`);
    } catch (error) {
        console.error(`      ❌ Send fail:`, error.message);
    }
}

async function rescueFromSpam(senderEmail, seed) {
    const imapConfig = {
        imap: {
            user: seed.user,
            password: seed.pass,
            host: seed.host || 'imap.gmail.com',
            port: seed.port || 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }, // Fix for self-signed certificate errors
            authTimeout: 5000
        }
    };

    try {
        const connection = await imaps.connect(imapConfig);
        const spamFolders = ['[Gmail]/Spam', 'Spam', 'Junk', 'Junk Email'];
        let box = null;

        for (const f of spamFolders) {
            try { await connection.openBox(f); box = f; break; } catch (e) {}
        }

        if (!box) {
            await connection.openBox('INBOX');
            box = 'INBOX';
        }

        const messages = await connection.search(['UNSEEN'], { bodies: ['HEADER'] });
        
        for (const msg of messages) {
            const header = msg.parts.find(p => p.which === 'HEADER').body;
            const from = header.from ? header.from[0] : '';
            
            if (from.toLowerCase().includes(senderEmail.toLowerCase())) {
                console.log(`      🌟 FOUND IN ${box}! Rescuing...`);
                if (box !== 'INBOX') await connection.moveMessage(msg.attributes.uid, 'INBOX');
                await connection.addFlags(msg.attributes.uid, '\\Seen');
            }
        }

        await connection.end();
    } catch (e) {
        console.error(`      ❌ IMAP error:`, e.message);
    }
}
