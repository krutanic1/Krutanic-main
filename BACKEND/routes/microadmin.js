const express = require("express");
const router = express.Router();
const AdminMail = require("../models/AdminMail");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { sendDikshanntOtpEmail } = require("../controllers/emailController");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");

// Route to send OTP specifically for the new MicroAdmin portal
router.post("/otpsend", expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const admin = await AdminMail.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Administrator identity not recognized" });
    }

    const otp = crypto.randomInt(100000, 1000000);

    const EmailMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 20px; overflow: hidden; background: #fdfdfd; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background-color: #0F172A; color: #fff; text-align: center; padding: 30px;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">DIKSHANNT</h1>
                <p style="margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; opacity: 0.6;">Dikshannt Institutional Access</p>
              </div>
              <div style="padding: 40px; text-align: center;">
                <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">Welcome back, <strong>${admin.fullname || "Administrator"}</strong>,</p>
                <p style="font-size: 14px; color: #64748B;">Your dynamic access sequence for root authorization is:</p>
                <div style="background: #F8FAFC; border: 1px dashed #CBD5E1; padding: 20px; border-radius: 12px; margin: 25px 0;">
                   <p style="font-size: 36px; font-weight: bold; color: #0F172A; letter-spacing: 8px; margin: 0;">${otp}</p>
                </div>
                <p style="font-size: 12px; color: #94A3B8;">This sequence is valid for <strong>10 minutes</strong>. Do not expose this credentials to unauthorized personnel.</p>
              </div>
              <div style="text-align: center; font-size: 10px; color: #94A3B8; padding: 20px; background: #F1F5F9; border-top: 1px solid #E2E8F0;">
                <p>Proprietary Security Protocol. Unauthorized attempts are logged.</p>
                <p>&copy; 2024 Dikshannt. All Rights Reserved.</p>
              </div>
            </div>
          `;
    admin.otp = otp;
    await Promise.all([
      admin.save(),
      sendDikshanntOtpEmail({ email, subject: "Dikshannt Root Access Challenge", message: EmailMessage }),
    ]);
    res.status(200).json({ message: "Security sequence dispatched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to dispatch OTP", error: error.message });
  }
})
);

// Route to verify OTP and issue the admin session
router.post("/otpverify", expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  try {
    const admin = await AdminMail.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin session context lost" });
    }

    if (admin.otp !== otp) {
      return res.status(401).json({ error: "Invalid security sequence" });
    }

    // Success: Clear OTP and issue token
    admin.otp = null;
    await admin.save();

    const token = jwt.sign(
      { email: admin.email, role: 'root_admin' },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.status(200).json({ 
      message: "Authorization successful", 
      token,
      adminId: admin._id,
      adminName: admin.fullname || "Admin"
    });
  } catch (error) {
    res.status(500).json({ message: "Verification protocol failed", error: error.message });
  }
})
);

// Unified Authentication check for MicroAdmin Protected Routes
router.get("/is-authenticated", verifyAdminCookie, (req, res) => {
  res.status(200).json({ isAuthenticated: true, admin: req.admin });
});

// Explicit Logout for MicroAdmin Portal
router.post("/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  res.status(200).json({ message: "Session terminated safely" });
});

module.exports = router;
