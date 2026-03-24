const nodemailer = require('nodemailer');
const Template = require('../models/Template');
const { decrypt } = require('../utils/crypto');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate content from a random template in the database
 */
const generateDynamicContent = async () => {
  try {
    const count = await Template.countDocuments();
    if (count === 0) {
      return { 
        subject: "Quick update regarding our last discussion", 
        body: "Hello, I hope you're doing well. Just checking in to see if there's any progress on our side." 
      };
    }

    const random = Math.floor(Math.random() * count);
    const template = await Template.findOne().skip(random);

    // Handle variadic arrays (anti-spam logic)
    const pick = (arr) => arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : '';
    
    if (template.subjects && template.subjects.length > 0) {
      const subject = pick(template.subjects);
      const greeting = pick(template.greetings);
      const bodyPara = pick(template.body_paragraphs);
      const closing = pick(template.closings);
      const signature = pick(template.signatures);

      const body = `${greeting}\n\n${bodyPara}\n\n${closing}\n${signature}`.trim();
      return { subject, body };
    }

    // Fallback to legacy fields
    return { 
      subject: template.subject || "Warmup Email", 
      body: template.body || "This is a placeholder body." 
    };
  } catch (error) {
    console.error('Error fetching template:', error.message);
    return { subject: "Warmup Update", body: "Hello, just following up." };
  }
};

/**
 * Generate a reply based on style (legacy logic kept for versatility)
 */
const REPLY_STYLES = {
  formal: [
    "Thank you for sharing this update. I appreciate you keeping me in the loop.",
    "Received with thanks. I'll review and get back to you shortly.",
    "Thank you for the information. This is very helpful.",
    "I appreciate the prompt response. Let me take a look at this.",
    "Thanks for following up on this. I'll keep you posted on my end."
  ],
  casual: [
    "Hey, thanks for the heads up! I'll check this out.",
    "Got it, appreciate you sending this over!",
    "Awesome, thanks for sharing! Looks good.",
    "Perfect, this is exactly what I was looking for. Thanks!",
    "Nice, I'll take a look and circle back with you."
  ],
  short: [
    "Thanks! Will review.",
    "Got it, noted.",
    "Received, thank you!",
    "Great, thanks for this.",
    "Acknowledged, will follow up."
  ],
  action: [
    "I'll look into this right away and update you.",
    "Checking this now, will get back to you by end of day.",
    "Good point, let me review this and share my thoughts.",
    "I'll coordinate with the team and keep you updated.",
    "Makes sense, I'll work on this and send you a summary."
  ],
  conversational: [
    "That's a great point. I was thinking the same thing actually.",
    "Interesting perspective! Let me think about this a bit more.",
    "Completely agree with your approach here. Let's proceed.",
    "I've been looking into this as well. Happy to discuss further.",
    "Good to hear from you on this. I'll send over my notes soon."
  ]
};

const { generateAIReply, generateSmartReply } = require('./ai');

/**
 * Generate a reply: Gemini AI → Smart Local → Fixed Fallback
 */
const generateReply = async (originalSubject, originalBody = "") => {
  const subject = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`;
  
  // Layer 1: Try Gemini AI
  try {
    const aiBody = await generateAIReply(originalBody || originalSubject);
    return { subject, body: aiBody };
  } catch (error) {
    // Layer 2: Smart local reply (context-aware, unique each time)
    try {
      const smartBody = generateSmartReply(originalBody || originalSubject);
      return { subject, body: smartBody };
    } catch (e) {
      // Layer 3: Fixed fallback
      const styles = Object.keys(REPLY_STYLES);
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const options = REPLY_STYLES[randomStyle];
      const body = options[Math.floor(Math.random() * options.length)];
      return { subject, body };
    }
  }
};

/**
 * Send email using dynamic content and decrypted password
 */
const sendMail = async (config, mailOptions = {}) => {
  // Random delay 2-5s
  const delayMs = Math.floor(Math.random() * 3000) + 2000;
  await sleep(delayMs);

  const decryptedPass = decrypt(config.pass);

  const rawHost = String(config.host || process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com').trim();
  const rawPort = config.port || process.env.DEFAULT_SMTP_PORT || 465;

  const isLocal = rawHost === 'localhost' || rawHost === '127.0.0.1' || rawHost === '0.0.0.0' || rawHost === '::1';
  const host = isLocal ? 'smtp.gmail.com' : rawHost;
  const port = isLocal ? 465 : rawPort;

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port == 465,
    auth: {
      user: config.user,
      pass: decryptedPass,
    },
  });

  // Use dynamic content if subject/text not provided
  let subject = mailOptions.subject;
  let body = mailOptions.text;

  if (!subject || !body) {
    const dynamic = await generateDynamicContent();
    subject = subject || dynamic.subject;
    body = body || dynamic.body;
  }

  try {
    const info = await transporter.sendMail({
      from: config.user,
      to: mailOptions.to,
      subject: subject,
      text: body,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendMail, generateDynamicContent, generateReply };
