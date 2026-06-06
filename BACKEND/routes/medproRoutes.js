const express = require("express");
const router = express.Router();
const MedProLead = require("../models/MedProLead");

// POST /api/medpro/leads - Submit a new lead
router.post("/leads", async (req, res) => {
  try {
    const { name, email, phone, course, question } = req.body;
    
    // Create new lead
    const newLead = new MedProLead({
      name,
      email,
      phone,
      course,
      question
    });

    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: savedLead
    });
  } catch (error) {
    console.error("Error saving MedPro lead:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// GET /api/medpro/leads - Fetch leads for admin panel
router.get("/leads", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const totalLeads = await MedProLead.countDocuments();
    const leads = await MedProLead.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalLeads / limit);

    res.status(200).json({ leads, totalPages, totalLeads, currentPage: page });
  } catch (error) {
    console.error("Error fetching MedPro leads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/medpro/leads/:id - Delete a lead
router.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await MedProLead.findByIdAndDelete(id);
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting MedPro lead:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
