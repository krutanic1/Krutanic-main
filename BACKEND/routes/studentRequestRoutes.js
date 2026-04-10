const express = require("express");
const router = express.Router();
const StudentRequest = require("../models/StudentRequest");

// POST /submit - Save landing inquiry form submissions
router.post("/submit", async (req, res) => {
  try {
    const { name, mobile, email, domainInterested } = req.body;

    if (!name || !mobile || !email || !domainInterested) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new StudentRequest({
      name,
      mobile,
      email,
      domainInterested,
    });

    await newRequest.save();
    res.status(201).json({ message: "Student request submitted successfully" });
  } catch (err) {
    console.error("Student request submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /all - List all student requests for admin with pagination
router.get("/all", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await StudentRequest.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNum);

    const requests = await StudentRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      requests,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (err) {
    console.error("Fetch student requests error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
