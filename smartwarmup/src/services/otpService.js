const crypto = require('crypto');
const OTP = require('../models/OTP');
const AdminMail = require('../models/AdminMail');
const nodemailer = require('nodemailer');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTPEmail = async (email, otp) => {
  console.log(`Attempting to send OTP to ${email}...`);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILBLASTER_OTP_FROM,
      pass: process.env.SMTP_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000
  });

  const mailOptions = {
    from: `"Krutanic Support" <${process.env.MAILBLASTER_OTP_FROM}>`,
    to: email,
    subject: 'Your Krutanic OTP Code',
    text: `Your OTP for Krutanic SmartWarmup is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Krutanic SmartWarmup</h2>
        <p>Hello,</p>
        <p>You requested an OTP for logging into the SmartWarmup dashboard.</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 Krutanic. All rights reserved.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const processOTPRequest = async (email) => {
  // Check if email is authorized
  const isAuthorized = await AdminMail.findOne({ email: email.toLowerCase() });
  console.log(`Checking authorization for ${email}: ${isAuthorized ? 'YES' : 'NO'}`);
  if (!isAuthorized) {
    throw new Error('Email not authorized for login');
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP (overwrite if exists for same email)
  console.log(`Storing OTP for ${email}...`);
  await OTP.findOneAndUpdate(
    { email: email.toLowerCase() },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
  console.log(`OTP stored for ${email}.`);

  console.log(`OTP generated for ${email}. Sending email...`);
  await sendOTPEmail(email, otp);
  console.log(`OTP email sent successfully to ${email}`);
  return { success: true, message: 'OTP sent successfully' };
};

const verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email: email.toLowerCase(), otp });
  
  if (!record) {
    throw new Error('Invalid OTP');
  }

  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    throw new Error('OTP expired');
  }

  // OTP is valid, delete it
  await OTP.deleteOne({ _id: record._id });
  return { success: true, message: 'OTP verified successfully' };
};

module.exports = {
  processOTPRequest,
  verifyOTP
};
