const express = require("express");
const router = express.Router();
const Advance = require("../models/Advance");
const AdvLead = require("../models/AdvLead");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");
const crypto = require("crypto");
const { sendEmail } = require("../controllers/emailController");



router.get("/advancequeries", verifyAnyAuth, async (req, res) => {
  const { limit, all } = req.query;
  try {
    // If all=true or limit=0, fetch all records (for dashboard)
    const queryLimit = all === 'true' || limit === '0' ? 0 : (parseInt(limit) || 0);

    let queries;
    if (queryLimit > 0) {
      queries = await Advance.find()
        .sort({ _id: -1 })
        .limit(queryLimit)
        .lean();
    } else {
      // No limit - fetch all
      queries = await Advance.find()
        .sort({ _id: -1 })
        .lean();
    }
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data", error: error.message });
  }
});

router.post("/advance/register", async (req, res) => {
  const { name, email, phone, currentRole, experience, goal, goalOther, domain, domainOther, interestedDomain, reason, passedOutYear } = req.body;
  // console.log(req.body);
  try {
    const newRegistration = new Advance({
      name,
      email,
      phone,
      currentRole,
      experience,
      goal,
      goalOther: goal === "Other" ? goalOther : undefined,
      domain,
      domainOther: domain === "Other" ? domainOther : undefined,
      interestedDomain: interestedDomain,
      passedOutYear: passedOutYear || undefined,
      reason: reason
    });
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//put request to update the mentorship data in admin
router.put("/advancequery/:id", verifyAnyAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const { action } = req.body;
    const query = await Advance.findById(id);
    if (query) {
      if (action === "Share to CRM" || action === "Shared to CRM") {
        query.action = "Shared to CRM";
        
        // -- MANUAL CRM INTEGRATION --
        try {
          await AdvLead.findOneAndUpdate(
            { email: query.email.toLowerCase() },
            {
              $set: {
                full_name: query.name,
                phone_number: query.phone,
                opted_domain: query.interestedDomain,
                education_background: query.passedOutYear || "",
                current_status: query.currentRole,
                source: "Website Lead",
                last_interaction_at: new Date(),
                extra_fields: {
                  "what_best_describes_your_current_situation?": query.currentRole,
                  "what_is_your_primary_goal_right_now?": query.goal === "Other" ? query.goalOther : query.goal,
                  "what_is_your_biggest_career_challenge?": query.reason,
                  "experience": query.experience,
                  "domain": query.domain === "Other" ? query.domainOther : query.domain,
                  "passed_out_year": query.passedOutYear || ""
                }
              },
              $setOnInsert: {
                status: "fresh",
                created_at: new Date()
              }
            },
            { upsert: true, new: true }
          );
        } catch (leadError) {
          console.error("Failed to share query to CRM:", leadError);
          // Non-blocking
        }
      } else {
        query.action = action;
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

let otpStoreAdvance = {};

// ✅ Send OTP
router.post("/advance-send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 999999);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    otpStoreAdvance[email] = { otp, otpExpires };

    const EmailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 14px; color: #555;">To complete your Advanced Program application, please use the OTP below to verify your email address:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
          <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({ email, subject: "Your OTP for Advanced Program Application", message: EmailMessage });

    res.status(200).json({ message: "OTP sent successfully", otpExpires });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP. Please try again later." });
  }
});

// ✅ Verify OTP
router.post("/advance-verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStoreAdvance[email]) {
    return res.status(400).json({ success: false, message: "OTP expired or not sent." });
  }

  const { otp: storedOtp, otpExpires } = otpStoreAdvance[email];

  if (Date.now() > otpExpires) {
    delete otpStoreAdvance[email];
    return res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });
  }

  if (storedOtp !== parseInt(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
  }

  delete otpStoreAdvance[email];
  res.status(200).json({ success: true, message: "OTP verified successfully!" });
});

module.exports = router;
