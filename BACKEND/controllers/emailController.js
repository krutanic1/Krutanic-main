
require("dotenv").config();
const nodemailer = require("nodemailer");

// Default transporter for OTP and general emails (noreply@krutanic.com)
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

// Dedicated transporter for Dikshannt OTP flow (new-project micro admin)
let dikshanntOtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL,
    pass: process.env.DIKSHANNT_PASSWORD || process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

// Separate transporter for payment reminders (operations@krutanic.com)
let operationsTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_OFFFERMAIL, // operations@krutanic.com
    pass: process.env.SMTP_OFFERPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

// Separate transporter for event reminders (events@krutanic.com)
let eventsTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EVENTS_MAIL, // events@krutanic.com
    pass: process.env.EVENTS_MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

// General email function (for OTP, etc.) - uses noreply@krutanic.com
const sendEmail = async ({ email, subject, message, bcc }) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    cc: process.env.SMTP_ADMIN_MAIL,
    bcc: bcc,
    subject: subject,
    html: message,
    priority: "high",
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent successfully!", info.response);
        resolve(info.response);
      }
    });
  });
};

// OTP sender for new-project admin login
const sendDikshanntOtpEmail = async ({ email, subject, message, bcc }) => {
  const fromEmail = process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL;
  const adminBcc = process.env.DIKSHANNT_ADMIN_MAIL;

  const mailOptions = {
    from: fromEmail,
    to: email,
    bcc: bcc || adminBcc,
    subject: subject,
    html: message,
    priority: "high",
  };

  return new Promise((resolve, reject) => {
    dikshanntOtpTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending Dikshannt OTP email:", error);
        reject(error);
      } else {
        console.log("Dikshannt OTP email sent successfully!", info.response);
        resolve(info.response);
      }
    });
  });
};

// Payment reminder email function - uses operations@krutanic.com
const sendPaymentReminderEmail = async ({ email, subject, message, bcc }) => {
  const mailOptions = {
    from: process.env.SMTP_OFFFERMAIL, // operations@krutanic.com
    to: email,
    bcc: bcc,
    subject: subject,
    html: message,
    priority: "high",
  };

  return new Promise((resolve, reject) => {
    operationsTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending payment reminder email:", error);
        reject(error);
      } else {
        console.log("Payment reminder email sent successfully!", info.response);
        resolve(info.response);
      }
    });
  });
};

// Event reminder email function - uses events@krutanic.com
const sendEventReminderEmail = async ({ email, subject, message, bcc, textVersion }) => {
  const mailOptions = {
    from: `Krutanic Events <${process.env.EVENTS_MAIL}>`, // events@krutanic.com with display name
    to: email,
    cc: "tejo.raditya@krutanic.org",
    bcc: bcc,
    subject: subject,
    text: textVersion || 'Please enable HTML to view this email.',
    html: message,
    priority: "normal",
    headers: {
      'X-Entity-Ref-ID': `EVENT-${Date.now()}`,
      'X-Mailer': 'Krutanic Event System',
      'List-Unsubscribe': '<mailto:events@krutanic.com?subject=Unsubscribe>',
    },
  };

  return new Promise((resolve, reject) => {
    eventsTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending event reminder email:", error);
        reject(error);
      } else {
        console.log("Event reminder email sent successfully!", info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = { sendEmail, sendDikshanntOtpEmail, sendPaymentReminderEmail, sendEventReminderEmail };
