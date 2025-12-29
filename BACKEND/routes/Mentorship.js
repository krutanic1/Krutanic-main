const express = require("express");
const router = express.Router();
const Mentorship = require("../models/Mentorship");
const { sendEmail } = require("../controllers/emailController");
const crypto = require('crypto'); 
// post request to add new mentorship enqueries
router.post("/mentorship/register", async (req, res) => {
  const { name, email,collegeEmail, phone , collegeName, domain , passingyear , reason } = req.body;
  try {
    const existingUser = await Mentorship.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "You have already registered with this email." });
    }
    const newRegistration = new Mentorship({
      name,
      email,
      collegeEmail ,
      phone,
      collegeName,
      domain,
      passingyear,
      reason

    });
    await newRegistration.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//get request to retrieve all the mentorship data in admin 
router.get("/mentorqueries", async (req, res) => {
  try {
      queries = await Mentorship.find().sort({ _id: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data", error: error.message });
  }
});

//put request to update the action data in admin
router.put("/queriesaction/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { action } = req.body;
    const query = await Mentorship.findById(id);
    if (query) {
      if (action === "Shared") {
        query.action = "Shared";
      }
      if (action === "Not Interested") {
        query.action = "Not Interested";
      }
      if (action === "Already Paid") {
        query.action = "Already Paid";
      }
      if (action === "Unseen") {
        query.action = "Unseen";
      }
      await query.save();

      res.status(200).json({ message: "Query updated successfully" });
      } else {
      res.status(404).json({ message: "Query not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating data", error: error.message });
  }
});

//put request to asign bda into lead
router.put("/bdaasign/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { bda , action } = req.body;
    const query = await Mentorship.findById(id);
       query.bda = bda;
       query.action = action;
      await query.save();

      res.status(200).json({ message: "Query updated successfully" });
      console.log("done")
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating data", error: error.message });
  }
});

let otpStore = {};

// ✅ Send OTP
router.post("/mentorship-send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Generate OTP & Expiry Time
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    // 2️⃣ Store OTP in Memory
    otpStore[email] = { otp, otpExpires };

    // 3️⃣ Email Content (Updated for PDF download)
    const EmailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 14px; color: #555;">To download the mentorship course brochure, please use the OTP below:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    // 4️⃣ Send Email
    await sendEmail({ email, subject: "Your OTP for Mentorship Brochure", message: EmailMessage });

    // 5️⃣ Send Response
    res.status(200).json({ message: "OTP sent successfully", otpExpires });

  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP. Please try again later." });
  }
});

// ✅ Verify OTP
router.post("/mentorship-verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // 1️⃣ Check if OTP exists
  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "OTP expired or not sent." });
  }

  const { otp: storedOtp, otpExpires } = otpStore[email];

  // 2️⃣ Check if OTP is correct and not expired
  if (Date.now() > otpExpires) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });
  }

  if (storedOtp !== parseInt(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
  }

  // 3️⃣ OTP Verified, Delete from Store
  delete otpStore[email];

  // 4️⃣ Send PDF Download Link
  const pdfDownloadLink = "https://example.com/mentorship-brochure.pdf"; // Replace with actual PDF link

  res.status(200).json({ success: true, message: "OTP verified successfully!", pdfLink: pdfDownloadLink });
});

module.exports = router;
