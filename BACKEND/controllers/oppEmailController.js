const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const nodemailer = require("nodemailer");

// Transporter 2
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST2,
  port: process.env.SMTP_PORT2,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL2,  // Make sure this is correct
    pass: process.env.SMTP_PASSWORD2,  // Ensure this is the right password
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

// Function to send email via Transporter 
const oppsendEmail = async ({ email, subject, message }) => {
  const mailOptions = {
    from: `"Operations Team" <${process.env.SMTP_MAIL2}>`, // Force the correct sender
    sender: process.env.SMTP_MAIL2, // Ensure the sender is set
    to: email,
    cc: process.env.SMTP_ADMIN_MAIL2,
    subject: subject,
    html: message,
    priority: "high",
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("SMTP 2 Error:", error);
        reject(error);
      } else {
        console.log("Email sent successfully from SMTP 2!", info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = {oppsendEmail};
