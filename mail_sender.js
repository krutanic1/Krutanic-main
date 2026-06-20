const nodemailer = require('nodemailer');

// =========================================================
// 1. Configuration
// =========================================================
// Replace these with your actual Gmail address and Google App Password.
// Note: You must enable "2-Step Verification" on your Google Account 
// to generate an App Password.
const SENDER_EMAIL = 'careeradvisor@krutanic.com'; 
const APP_PASSWORD = 'kzhv ikws bhud akfd'; 

const fs = require('fs');
const path = require('path');

// Read recipients from CSV
const getRecipients = () => {
    try {
        const csvPath = path.join(__dirname, 'recipients.csv');
        const fileData = fs.readFileSync(csvPath, 'utf8');
        const lines = fileData.split('\n').filter(line => line.trim() !== '');
        
        const list = [];
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const lastComma = line.lastIndexOf(',');
            if (lastComma > 0) {
                // remove quotes if any
                const name = line.substring(0, lastComma).replace(/^"|"$/g, '').replace(/""/g, '"').trim();
                const email = line.substring(lastComma + 1).trim();
                if (email) list.push({ name, email });
            }
        }
        return list;
    } catch (error) {
        console.error("Error reading recipients.csv:", error.message);
        return [];
    }
};

const emailList = getRecipients();

// =========================================================
// 2. Transporter Setup
// =========================================================
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD.replace(/\s+/g, '') // Remove spaces from the app password
    }
});

// =========================================================
// 3. Email Template
// =========================================================
const getReminderTemplate = (name) => {
    // If name is not provided, fallback to a generic greeting
    const greetingName = name || 'Participant';
    
    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px 30px;text-align:center;border-radius:16px 16px 0 0;">
        <h1 style="color:white;margin:0;font-size:24px;">You're Registered! 🎉</h1>
        <p style="color:rgba(255,255,255,0.85);margin:10px 0 0;">Your seat is confirmed for the live session.</p>
      </div>
      <div style="background:#ffffff;padding:30px;border:1px solid #e2e8f0;">
        <h2 style="color:#0f172a;">Hi ${greetingName},</h2>
        <p style="color:#475569;line-height:1.7;">Thank you for registering! We're excited to have you join our Live Webinar: <strong>How Freshers & Non-Tech Candidates Are Transitioning to Data Analyst Roles</strong>.</p>
        
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:20px 0;">
          <p style="margin:0 0 6px;font-size:13px;color:#6366f1;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Session Details</p>
          <p style="margin:8px 0;"><strong>Date:</strong> Saturday, 20 June 2026</p>
          <p style="margin:8px 0;"><strong>Time:</strong> 4:00 PM – 5:00 PM</p>
          <p style="margin:8px 0;"><strong>Speaker:</strong> Afsan Khan (HCLTech | 8+ Years Experience)</p>
          <p style="margin:8px 0;"><strong>Mode:</strong> Live Webinar</p>
        </div>

        <p style="color:#475569;line-height:1.7;">This session will help you understand how freshers, career switchers, and non-tech professionals are successfully transitioning into Data Analyst roles.</p>
        
        <p style="color:#475569;font-weight:bold;margin-top:20px;">🔔 Friendly Reminder: Please save the date and time in your calendar.</p>

        <a href="https://chat.whatsapp.com/J6YwJJx3S1HIncTg12vpOf" style="display:block;background:linear-gradient(135deg,#25D366,#128C7E);color:white;text-decoration:none;text-align:center;padding:16px;border-radius:12px;font-size:16px;font-weight:bold;margin:24px 0;">👉 Join WhatsApp Community for Updates</a>
        <p style="color:#64748b;font-size:13px;text-align:center;">https://chat.whatsapp.com/J6YwJJx3S1HIncTg12vpOf</p>
        
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0;">
        
        <div style="background:#fff3cd;padding:15px;border-radius:8px;border-left:4px solid #ffeeba;margin-bottom:20px;">
          <p style="color:#856404;margin:0;font-size:14px;"><strong>⚠️ Please note:</strong> The webinar class joining link will be shared in our next message closer to the session time.</p>
        </div>

        <p style="color:#0f172a;line-height:1.6;">Looking forward to seeing you there! 🚀<br><strong>Team Krutanic</strong></p>
      </div>
      <div style="background:#f8fafc;padding:16px 30px;text-align:center;color:#94a3b8;font-size:12px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:0;">
        <p style="margin:0;">&copy; ${new Date().getFullYear()} Krutanic. All rights reserved.</p>
      </div>
    </div>
    `;
};

const getTextTemplate = (name) => {
    const greetingName = name || 'Participant';
    return `Hi ${greetingName},

Thank you for registering for our Live Webinar:
How Freshers & Non-Tech Candidates Are Transitioning to Data Analyst Roles

We're excited to have you join us!

Date: Saturday, 20 June 2026
Time: 4:00 PM – 5:00 PM
Speaker: Afsan Khan (HCLTech | 8+ Years Experience)
Mode: Live Webinar

This session will help you understand how freshers, career switchers, and non-tech professionals are successfully transitioning into Data Analyst roles.

Friendly Reminder: Please save the date and time in your calendar.

Join our WhatsApp Community for updates:
https://chat.whatsapp.com/J6YwJJx3S1HIncTg12vpOf

Please note: The webinar class joining link will be shared in our next message closer to the session time.

Looking forward to seeing you there!

Team Krutanic`;
};

// =========================================================
// 4. Send Email Function
// =========================================================
const sendMails = async () => {
    if (emailList.length === 0 || emailList[0].email === 'recipient1@example.com') {
        console.warn("⚠️  Please update the emailList array with actual recipient details.");
    }
    if (SENDER_EMAIL === 'your-email@gmail.com') {
        console.warn("⚠️  Please update SENDER_EMAIL and APP_PASSWORD before running.");
        return;
    }

    console.log(`🚀 Starting to send webinar reminders to ${emailList.length} recipients...`);

    for (let i = 0; i < emailList.length; i++) {
        const { name, email } = emailList[i];
        
        if (!email) {
            console.warn(`[⚠️] Skipping entry at index ${i}: No email address provided.`);
            continue;
        }

        const mailOptions = {
            from: `"Krutanic" <${SENDER_EMAIL}>`,
            to: email,
            subject: 'Live Webinar Details: Data Analyst Roles 📊', // Removed spam-trigger words like "FREE"
            html: getReminderTemplate(name),
            text: getTextTemplate(name) // Plain-text fallback heavily reduces spam scoring
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`[${i + 1}/${emailList.length}] ✅ Successfully sent to ${email}: ${info.response}`);
        } catch (error) {
            console.error(`[${i + 1}/${emailList.length}] ❌ Failed to send to ${email}:`, error.message);
        }
        
        // 1-second delay between emails to prevent rate limiting / spam blocks
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ All webinar reminder emails have been processed.');
};

// Execute the script
sendMails();
