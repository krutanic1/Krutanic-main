const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = require("../middleware/UserAuth");
const { sendEmail } = require("../controllers/emailController");
const crypto = require('crypto'); 

// create user
router.post("/users", async (req, res) => {
  const { fullname, email, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already created check in active users" });
    }
    const newUser = new User({
      fullname,
      email,
      phone,
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// fetch user
router.get("/users", async (req, res) => {
  const { userId } = req.query;
  try {
    let users;
    if (userId) {
      users = await User.findById(userId);
      if (!users) {
        return res
          .status(404)
          .json({ message: "user not found for the given userId" });
      }
    } else {
      users = await User.find().sort({ _id: -1 });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
});

// update user
router.put("/users/:id", async (req, res) => {
  const { status, fullname, email, phone, password } = req.body;
  const { id } = req.params;
  try {
    const updatedFields = {
      status,
      fullname,
      email,
      phone,
      password,
    };
    const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// check user login
router.post("/checkuserauth", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
      if (user.status === "inactive") {
        return res
          .status(403)
          .json({ message: "Your account is inactive. Please contact support." });
      }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, _id: user._id, email: user.email });
  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to the dashboard!" });
});


// send otp route
router.post("/send-otp",async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found enter a valid email" });
    }
     const otp = crypto.randomInt(100000, 1000000);
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins expiration
       const  EmailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
            <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Hello,Login to your account using the OTP below:</p>
            <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
            <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
            <p>If you didn’t request this OTP, please ignore this email or contact our IT team.</p>
            <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
    </div>
    `;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await Promise.all([
      user.save(),
      sendEmail({email ,  subject: "Your OTP for Login", message: EmailMessage}),
    ]);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// verfiy otp route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      if (user.status === "inactive") {
        return res.status(403).json({ message: "Your account is inactive. Please contact support." });
      }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, _id: user._id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// update password route
router.put("/updatepassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(email , newPassword);

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "new password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/:id/id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


module.exports = router;
