const express = require("express");
const router = express.Router();
const CareerAssessment = require("../models/CareerAssessment");
const AssessmentSlot = require("../models/AssessmentSlot");
const Razorpay = require('razorpay');
const AdvLead = require("../models/AdvLead");
const AdvUser = require("../models/AdvUser");
const { 
  sendSkillEvaluationWelcomeEmail, 
  sendSkillEvaluationAdminNotification, 
  sendSkillEvaluationExecutiveNotification 
} = require("../utils/emailService");
// POST: Capture initial details before payment
router.post("/pre-payment", async (req, res) => {
  try {
    const { fullName, email, mobileNumber, yearsOfExperience, currentWorkingDomain } = req.body;
    
    if (!fullName || !email || !mobileNumber) {
      return res.status(400).json({ error: "Name, email, and mobile number are required." });
    }

    const newPrePayment = new CareerAssessment({
      fullName,
      email,
      mobileNumber,
      yearsOfExperience,
      currentWorkingDomain,
      city: 'Pending',
      paymentStatus: 'Pending'
    });

    await newPrePayment.save();
    return res.status(201).json({ prePaymentId: newPrePayment._id });
  } catch (error) {
    console.error("Pre-payment Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Create a new career assessment (or update existing from pre-payment)
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
    if (paymentId.startsWith('dev_bypass_payment_') && process.env.NODE_ENV !== 'production') {
        console.log("Development mode: Bypassing Razorpay verification for testing.");
    } else {
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
        const { prePaymentId, ...assessmentData } = req.body;
        
        let newAssessment;
        if (prePaymentId) {
            newAssessment = await CareerAssessment.findById(prePaymentId);
            if (!newAssessment) {
                console.warn(`Pre-payment record not found for ID: ${prePaymentId}. Creating fresh assessment.`);
                // Instead of returning 404, create a new assessment (handles edge case where pre-payment was lost)
                newAssessment = new CareerAssessment(assessmentData);
            } else {
                // Update existing with new data
                Object.assign(newAssessment, assessmentData);
            }
        } else {
            newAssessment = new CareerAssessment(assessmentData);
        }

        // ATTEMPT TO MATCH WITH EXISTING LEAD IN ADV TEAM
        try {
            const matchedLead = await AdvLead.findOne({ 
                $or: [
                    { email: req.body.email },
                    { phone_number: req.body.mobileNumber }
                ]
            });

            const executiveId = matchedLead ? (matchedLead.current_owner_id || matchedLead.owner_id) : null;

            if (executiveId) {
                newAssessment.assignedExecutiveId = executiveId;
                
                // Fetch the executive's details to get their email and manager (Check both AdvUser and AdvTeam collections)
                let executive = await AdvUser.findById(executiveId);
                if (!executive) {
                    const AdvTeam = require("../models/CreateAdvTeam");
                    executive = await AdvTeam.findById(executiveId);
                }
                
                if (executive) {
                    newAssessment.assignedExecutiveEmail = executive.email;
                    newAssessment.assignedExecutiveName = executive.fullname || executive.name;
                    newAssessment.managerId = executive.manager_id || matchedLead.manager_id;
                    
                    if (newAssessment.managerId) {
                        let manager = await AdvUser.findById(newAssessment.managerId);
                        if (!manager) {
                            const AdvTeam = require("../models/CreateAdvTeam");
                            manager = await AdvTeam.findById(newAssessment.managerId);
                        }
                        if (manager) {
                            newAssessment.managerEmail = manager.email;
                        }
                    }
                }
            }
        } catch (matchErr) {
            console.error("Error matching lead for career assessment:", matchErr);
            // Non-fatal error, proceed with saving
        }

        const savedAssessment = await newAssessment.save();
        
        // Tie the slot to the assessment (optional but good for referential integrity)
        slot.bookedBy = savedAssessment._id;
        await slot.save();

        // FIRE AUTOMATED EMAILS
        const emailPromises = [
            sendSkillEvaluationWelcomeEmail(savedAssessment.email, savedAssessment.fullName, savedAssessment.bookedDate, savedAssessment.bookedTimeSlot),
            sendSkillEvaluationAdminNotification(savedAssessment)
        ];
        
        if (savedAssessment.assignedExecutiveEmail) {
            emailPromises.push(sendSkillEvaluationExecutiveNotification(savedAssessment.assignedExecutiveEmail, savedAssessment));
        }
        
        if (savedAssessment.managerEmail) {
            emailPromises.push(sendSkillEvaluationExecutiveNotification(savedAssessment.managerEmail, savedAssessment));
        }

        // Wait for all emails to finish, but cap at 10 seconds to prevent hanging
        const emailTimeout = new Promise(resolve => setTimeout(resolve, 10000));
        await Promise.race([
            Promise.allSettled(emailPromises),
            emailTimeout
        ]);

        console.log(`Career assessment saved successfully. ID: ${savedAssessment._id}, PaymentID: ${savedAssessment.paymentId}`);
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

// GET: Fetch career assessments (for AdvTeam dashboard) with role-based filtering
router.get("/careerassessment", async (req, res) => {
  try {
    const { userId, role } = req.query;
    let query = {};

    if (role && userId) {
        const normalizedRole = role.toLowerCase().replace(/ /g, "_");

        if (normalizedRole === "sr_inside_sales_specialist" || normalizedRole === "inside_sales_specialist" || normalizedRole === "adv_member" || normalizedRole === "member" || normalizedRole === "sr._inside_sales_specialist") {
            // Executives see only their own assigned leads
            query = { assignedExecutiveId: userId };
        } else if (normalizedRole === "manager" || normalizedRole === "leader" || normalizedRole === "adv_manager" || normalizedRole === "adv_leader") {
            // Managers see their leads AND leads belonging to their team
            query = {
                $or: [
                    { assignedExecutiveId: userId },
                    { managerId: userId }
                ]
            };
        }
        // Admin or undefined role sees everything
    }

    const assessments = await CareerAssessment.find(query).sort({ createdAt: -1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching career assessments:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

module.exports = router;
