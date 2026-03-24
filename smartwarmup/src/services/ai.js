const axios = require('axios');

/**
 * Gemini AI Service — Multi-Key Rotation + Smart Local Fallback
 */
const keyCooldowns = {};
let keyIndex = 0;

const getAvailableKey = () => {
  const keys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
  if (keys.length === 0) throw new Error('GEMINI_API_KEY not set');
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const idx = (keyIndex + i) % keys.length;
    if (now > (keyCooldowns[keys[idx]] || 0)) {
      keyIndex = (idx + 1) % keys.length;
      return keys[idx];
    }
  }
  throw new Error('All API keys in cooldown');
};

const generateAIReply = async (originalBody) => {
  const apiKey = getAvailableKey();
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: `Reply to this email in 1-2 short professional sentences. Be natural. Return ONLY plain text.\n\nEmail: "${originalBody}"` }] }] },
      { timeout: 8000 }
    );
    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    if (error.response?.status === 429) {
      keyCooldowns[apiKey] = Date.now() + 60000;
    }
    throw error;
  }
};

/**
 * Smart Local Reply Generator — Context-aware without AI API
 * Builds unique replies by analyzing keywords in the original email
 */
const GREETINGS = [
  "Hi there,", "Hello,", "Hey,", "Good day,", "Thanks for reaching out,"
];

const TOPIC_RESPONSES = {
  meeting: [
    "I've noted the meeting details and will make sure to join on time.",
    "Thanks for the invite. I'll have my notes ready for the discussion.",
    "Looking forward to the meeting. I'll prepare the agenda items on my end."
  ],
  update: [
    "Thanks for the update. Everything looks on track from what I can see.",
    "Appreciate the status update. I'll review the details and follow up.",
    "Good to know. I'll factor this into our current timeline."
  ],
  project: [
    "The project progress looks solid. Let me review and share my feedback.",
    "Thanks for sharing the project details. I'll coordinate with the team.",
    "Great progress on the project. I'll add my inputs by end of day."
  ],
  report: [
    "I've gone through the report. The numbers look consistent with expectations.",
    "Thanks for putting this together. The report covers all the key areas.",
    "The report is well-structured. I'll share my analysis shortly."
  ],
  follow: [
    "Thanks for following up. I was just about to circle back on this.",
    "Good timing with the follow-up. I have some updates to share as well.",
    "Appreciate the reminder. Let me get back to you with the details."
  ],
  question: [
    "Great question. Let me look into this and get you a proper answer.",
    "I'll check on this and respond with the specifics you need.",
    "Good point. I'll gather the relevant information and respond shortly."
  ],
  deadline: [
    "Noted on the timeline. I'll ensure we stay on track with the deadline.",
    "Thanks for the heads up on the deadline. I'll prioritize accordingly.",
    "I'll make sure everything is wrapped up well before the due date."
  ],
  review: [
    "I'll review this carefully and share my thoughts with you.",
    "Thanks for sending this over for review. I'll get to it today.",
    "I'll go through this in detail and provide my feedback."
  ],
  default: [
    "Thanks for your email. I'll review the details and get back to you.",
    "Appreciate you reaching out. I'll look into this and follow up shortly.",
    "Noted and understood. I'll take the necessary steps on my end.",
    "Thanks for keeping me in the loop. I'll coordinate accordingly.",
    "Got it. I'll work on this and share an update with you soon.",
    "Thanks for sharing. I'll review and circle back with my thoughts.",
    "Understood. Let me look into the details and respond properly.",
    "Thank you for the information. I'll factor this into our plans.",
    "Appreciate the heads up. I'll make sure to address this promptly.",
    "Good to hear from you. I'll follow up on this shortly."
  ]
};

const SIGN_OFFS = [
  "Best regards", "Kind regards", "Thanks", "Best", "Cheers", "Regards", "Thank you", "Warm regards"
];

const NAMES = [
  "Team", "Colleague", "Partner"
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateSmartReply = (originalBody = "") => {
  const lower = originalBody.toLowerCase();
  
  // Detect topic from email content
  let responses = TOPIC_RESPONSES.default;
  for (const [topic, replies] of Object.entries(TOPIC_RESPONSES)) {
    if (topic !== 'default' && lower.includes(topic)) {
      responses = replies;
      break;
    }
  }

  const greeting = pick(GREETINGS);
  const body = pick(responses);
  const signOff = pick(SIGN_OFFS);

  return `${greeting}\n\n${body}\n\n${signOff}`;
};

module.exports = { generateAIReply, generateSmartReply };
