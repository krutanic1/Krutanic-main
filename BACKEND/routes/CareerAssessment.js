const express = require("express");
const router = express.Router();
const CareerAssessment = require("../models/CareerAssessment");
const AssessmentSlot = require("../models/AssessmentSlot");
const Razorpay = require('razorpay');

// POST: Create a new career assessment
router.post("/careerassessment", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required to submit assessment." });
    }

    // 1. Check if this payment ID was already used (Prevent Replay Attacks)
    const existingAssessment = await CareerAssessment.findOne({ paymentId });
    if (existingAssessment) {
      return res.status(400).json({ error: "This payment has already been used for an assessment." });
    }

    // 2. Verify with Razorpay Servers directly (Prevent Spoofing)
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    try {
      const payment = await razorpayInstance.payments.fetch(paymentId);
      
      if (payment.status !== 'captured' && payment.status !== 'authorized') {
          return res.status(400).json({ error: "Payment was not successful on Razorpay's end." });
      }

      if (Number(payment.amount) < 10100) { // ₹101 in paise, allow higher if convenience fee is added
          console.error(`Amount mismatch: Received ${payment.amount}`);
          return res.status(400).json({ error: `Payment amount mismatch. Expected at least ₹101, but got ₹${payment.amount/100}.` });
      }
    } catch (rzpErr) {
      console.error("Razorpay Fetch Error:", rzpErr);
      return res.status(400).json({ error: "Invalid or fake Payment ID provided." });
    }

    // 3. Payment is 100% verified and real. Attempt to lock the slot.
    const { bookedDate, bookedTimeSlot } = req.body;
    if (!bookedDate || !bookedTimeSlot) {
        return res.status(400).json({ error: "Date and Time Slot are required." });
    }

    let slot;
    try {
        slot = await AssessmentSlot.create({
            date: bookedDate,
            timeSlot: bookedTimeSlot,
            isBooked: true
        });
    } catch (slotErr) {
        if (slotErr.code === 11000) {
            return res.status(409).json({ error: "SLOT_TAKEN", message: "This slot was just taken by someone else. Please select another slot." });
        }
        throw slotErr; // Re-throw to main catch block
    }

    // 4. Slot locked successfully! Safe to save the form to Database.
    try {
        const newAssessment = new CareerAssessment(req.body);
        const savedAssessment = await newAssessment.save();
        
        // Tie the slot to the assessment (optional but good for referential integrity)
        slot.bookedBy = savedAssessment._id;
        await slot.save();

        res.status(201).json({ message: "Assessment submitted successfully", data: savedAssessment });
    } catch (dbError) {
        // ROLLBACK: If form fails to save, unlock the slot so the user doesn't lose it forever
        await AssessmentSlot.findByIdAndDelete(slot._id);
        console.error("Error saving career assessment. Slot rolled back.", dbError);
        res.status(500).json({ error: "Failed to submit assessment due to invalid form data." });
    }
  } catch (error) {
    console.error("Error saving career assessment:", error);
    res.status(500).json({ error: "Failed to submit assessment" });
  }
});

// GET: Fetch all career assessments (for AdvTeam dashboard)
router.get("/careerassessment", async (req, res) => {
  try {
    const assessments = await CareerAssessment.find().sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching career assessments:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

module.exports = router;
