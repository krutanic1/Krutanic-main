
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

module.exports = { sendEmail, sendPaymentReminderEmail };
