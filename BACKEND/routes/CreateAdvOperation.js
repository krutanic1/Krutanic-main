const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/UserAuth");
const CreateAdvOperation = require("../models/CreateAdvOperation");
const AdvEnroll = require("../models/AdvEnroll");
const { sendEmail } = require("../controllers/emailController");
const { sendOfferLetter } = require("../controllers/offerLetter");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");

// POST to create a new ADV operation account
router.post("/createadvoperation", verifyAdminCookie, async (req, res) => {
  const { fullname, email, password, languages } = req.body;
  try {
    const newAdvOperation = new CreateAdvOperation({
      fullname: fullname,
      email: email,
      password: password,
      languages: languages,
    });
    await newAdvOperation
      .save()
      .then(() => {
        res.status(201).json(newAdvOperation);
      })
      .catch((saveError) => {
        console.error("Error saving data:", saveError);
        res.status(400).json({ message: saveError.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all ADV operation accounts
router.get("/getadvoperation", async (req, res) => {
  const { operationId } = req.query;
  try {
    let operation;
    if (operationId) {
      operation = await CreateAdvOperation.findById(operationId);
      if (!operation) {
        return res
          .status(404)
          .json({ message: "ADV Operation not found for the given userId" });
      }
    } else {
      operation = await CreateAdvOperation.find().sort({ _id: -1 }).lean();
    }
    res.status(200).json(operation);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching data",
        error: error.message,
      });
  }
});

// PUT request to edit the ADV operations details
router.put("/updateadvoperation/:id", verifyAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, languages } = req.body;
    const updatedOperation = await CreateAdvOperation.findByIdAndUpdate(
      id,
      { fullname, email, password, languages },
      { new: true }
    );
    if (!updatedOperation) {
      return res.status(404).json({ error: "ADV Operation not found" });
    }
    res.status(200).json(updatedOperation);
  } catch (error) {
    res.status(400).json({ error: "Error updating ADV operation" });
  }
});

// Toggle Online/Offline status
router.put("/toggleadvonlinestatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const operation = await CreateAdvOperation.findById(id);
    if (!operation) {
      return res.status(404).json({ error: "ADV Operation not found" });
    }
    operation.isOnline = !operation.isOnline;
    await operation.save();

    res.status(200).json({ message: "Status updated", isOnline: operation.isOnline });
  } catch (error) {
    res.status(500).json({ error: "Error updating status", details: error.message });
  }
});

// Update Active/Inactive status
router.put("/updateadvoperationstatus/:id", verifyAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const operation = await CreateAdvOperation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!operation) {
      return res.status(404).json({ error: "ADV Operation not found" });
    }
    res.status(200).json(operation);
  } catch (error) {
    res.status(500).json({ error: "Error updating status", details: error.message });
  }
});

// DELETE request to delete the ADV operation account
router.delete("/deleteadvoperation/:id", verifyAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOperation = await CreateAdvOperation.findByIdAndDelete(id);
    if (!deletedOperation) {
      return res.status(404).json({ error: "ADV Operation not found" });
    }
    res.status(200).json({ message: "ADV Operation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ADV operation" });
  }
});

/*
// Direct Login for Admin Panel Bypass
router.post("/checkadvoperation", async (req, res) => {
  const { email, password } = req.body;
  try {
    const operation = await CreateAdvOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "ADV Operation user not found" });
    }
    if (operation.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: operation._id, email: operation.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    res.status(200).json({
      token,
      _id: operation._id,
      operationName: operation.fullname,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Failed to login directly:", error);
    res
      .status(500)
      .json({ message: "Failed to login directly", error: error.message });
  }
});
*/

// Send OTP for ADV operation login
router.post("/advoperationsendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const operation = await CreateAdvOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "ADV Operation user not found" });
    }

    const otp = crypto.randomInt(100000, 1000000);

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Welcome back! ${operation.fullname},</p>
          <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>If you didn't request this OTP, please ignore this email or contact our IT team.</p>
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    operation.otp = otp;
    await Promise.all([
      operation.save(),
      sendEmail({
        email,
        subject: "ADV Operation Login Credentials",
        message: emailMessage,
      }),
    ]);

    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login for ADV operation
router.post("/advoperationverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const operation = await CreateAdvOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "ADV Operation user not found" });
    }
    if (operation.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    operation.otp = null;
    await operation.save();
    const token = jwt.sign(
      { _id: operation._id, email: operation.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    res.status(200).json({
      token,
      _id: operation._id,
      operationName: operation.fullname,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
});

// ADV Operation Dashboard
router.get("/AdvOperationDashboard", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Assign target to ADV operation
router.post("/assigntargettoadvoperation/:id", verifyAdminCookie, async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;

    const operation = await CreateAdvOperation.findById(id);
    if (!operation) {
      return res.status(404).json({ error: "ADV Operation not found" });
    }

    operation.target.push(target);
    await operation.save();

    res.status(200).json({ message: "Target assigned successfully", operation });
  } catch (error) {
    res.status(500).json({ error: "Error assigning target", details: error.message });
  }
});

// Send email to ADV operation with credentials
router.post("/sendmailtoadvoperation", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hello ${fullname},</p>
          <p style="font-size: 14px; color: #555;">Your ADV Operation account has been created. Here are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="font-size: 14px; color: #555;">Please keep these credentials secure and do not share them with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: email,
      subject: "ADV Operation Login Credentials",
      message: emailMessage,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email", details: error.message });
  }
});

// Send OTP for ADV Operation Login
router.post("/advoperationsendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const operation = await CreateAdvOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "ADV Operation user not found" });
    }

    const otp = crypto.randomInt(100000, 1000000);

    // Email message
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Welcome back! ${operation.fullname},</p>
          <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>If you didn't request this OTP, please ignore this email or contact our IT team.</p>
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    // Save OTP in database and send email simultaneously
    operation.otp = otp;
    await Promise.all([
      operation.save(),
      sendEmail({
        email,
        subject: "ADV Operation Login Credentials",
        message: emailMessage,
      }),
    ]);

    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login for ADV Operation
router.post("/advoperationverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const operation = await CreateAdvOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "ADV Operation user not found" });
    }
    if (operation.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    operation.otp = null;
    await operation.save();
    const token = jwt.sign(
      { _id: operation._id, email: operation.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({
      token,
      _id: operation._id,
      operationName: operation.fullname,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

router.get("/AdvOperationDashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to the ADV Operation dashboard!" });
});

module.exports = router;
