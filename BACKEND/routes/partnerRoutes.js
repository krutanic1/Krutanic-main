const express = require("express");
const router = express.Router();
const PartnerDM = require("../models/PartnerDM");

// POST /submit - Submit a new partnership request
router.post("/submit", async (req, res) => {
  try {
    const { collegeName, contactName, email, phone, message } = req.body;

    if (!collegeName || !contactName || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new PartnerDM({
      collegeName,
      contactName,
      email,
      phone,
      message,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (err) {
    console.error("Partner submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /all - Get all partnership requests (admin with pagination)
router.get("/all", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 30;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await PartnerDM.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNum);

    const requests = await PartnerDM.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      requests,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (err) {
    console.error("Fetch partner requests error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
