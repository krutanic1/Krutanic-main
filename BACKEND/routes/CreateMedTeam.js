const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");
const jwt = require("jsonwebtoken");
const CreateMedTeam = require("../models/CreateMedTeam");
const MedTeamName = require("../models/MedTeamName");
const MedEnroll = require("../models/MedEnroll");
const TransactionId = require("../models/AddTransactionId");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");
const crypto = require('crypto');

//post to create a new medteam account
router.post("/createmedteam", verifyAnyAuth, async (req, res) => {
  const { fullname, email, team, teams, designation, password } = req.body;
  try {
    const newmedteam = new CreateMedTeam({
      fullname: fullname,
      email: email,
      team: team,
      teams: teams || [], 
      designation: designation,
      password: password
    });
    await newmedteam.save();

    res.status(201).json(newmedteam);
  } catch (error) {
    console.error("Error creating MedTeam:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all medteam accounts 
router.get("/getmedteam", verifyAnyAuth, async (req, res) => {
  const { medTeamId } = req.query;
  try {
    let medteam;
    if (medTeamId) {
      medteam = await CreateMedTeam.findById(medTeamId);
      if (!medteam) {
        return res.status(404).json({ message: "MedTeam not found for the given id" });
      }
    } else {
      medteam = await CreateMedTeam.aggregate([
          { $sort: { _id: -1 } },
          {
            $project: {
              fullname: 1,
              email: 1,
              team: 1,
              teams: 1,
              designation: 1,
              otp: 1,
              mailSended: 1,
              Access: 1,
              status: 1,
              target: { $ifNull: ["$target", []] }
            }
          }
      ]);
    }
    res.status(200).json(medteam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve medteam accounts with their enrollments
router.get("/medteam-with-enrolls", verifyAnyAuth, async (req, res) => {
  try {
    const medteams = await CreateMedTeam.find({}).lean();
    const allEnrolls = await MedEnroll.find({}).lean();
    
    // Group enrollments by counselor
    const enrollsByCounselor = {};
    for (const enroll of allEnrolls) {
      const counselor = enroll.counselor ? enroll.counselor.toLowerCase() : '';
      if (!enrollsByCounselor[counselor]) {
        enrollsByCounselor[counselor] = [];
      }
      enrollsByCounselor[counselor].push(enroll);
    }
    
    // Map enrollments to each MedTeam member
    const result = medteams.map(medteam => {
      const counselorKey = medteam.fullname ? medteam.fullname.toLowerCase() : '';
      return {
        ...medteam,
        enrollments: enrollsByCounselor[counselorKey] || []
      };
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching medteam with enrolls:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// put request to edit the medteam details
router.put("/updatemedteam/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, team, teams, designation } = req.body;
    const updatedmedteam = await CreateMedTeam.findByIdAndUpdate(
      id,
      { fullname, email, password, team, teams: teams || [], designation },
      { new: true }
    );
    if (!updatedmedteam) {
      return res.status(404).json({ error: "MedTeam not found" });
    }
    res.status(200).json(updatedmedteam);
  } catch (error) {
    res.status(400).json({ error: "Error updating MedTeam" });
  }
});

//put request to update the status 
router.put("/updatemedteamstatus/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedstatus = await CreateMedTeam.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedstatus) {
      return res.status(404).json({ error: "MedTeam not found" });
    }
    res.status(200).json(updatedstatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating status" });
  }
});

//put request to update access
router.put("/updatemedteamaccess/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { Access } = req.body;
    const updatedstatus = await CreateMedTeam.findByIdAndUpdate(
      id,
      { $set: { Access } },
      { new: true }
    );
    if (!updatedstatus) {
      return res.status(404).json({ error: "MedTeam account not found" });
    }
    res.status(200).json(updatedstatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating MedTeam access" });
  }
});

//delete request to delete the account
router.delete("/deletemedteam/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedmedteam = await CreateMedTeam.findByIdAndDelete(id);
    if (!deletedmedteam) {
      return res.status(404).json({ error: "MedTeam not found" });
    }
    res.status(200).json({ message: "MedTeam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting MedTeam" });
  }
});

//Send Mail 
router.post("/sendmailtomedteam", async (req, res) => {
  const { email, fullname } = req.body;
  try {
    const medteam = await CreateMedTeam.findOne({ email });
    if (!medteam) {
      return res.status(404).json({ message: "MedTeam not found" });
    }

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Welcome to Krutanic!</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; text-transform: capitalize; color: #333;">Dear ${fullname},</p>
          <p style="font-size: 14px; color: #555;">Welcome to the Med Team at Krutanic!</p>
          <p style="font-size: 14px; color: #555;">Here are your login details:</p>
          <p style="font-size: 14px; color: #333;">Use your official company email (<strong>${email}</strong>) along with the OTP provided to log in.</p>
          <p style="font-size: 14px; color: #555;">
            <a href="https://www.krutanic.com/medloginteam" target="_blank" style="color: #F15B29; text-decoration: none;">Click here to log in</a>. 
          </p>
          <p style="font-size: 14px; color: #555;">If you need further assistance, feel free to reach out to the IT team.</p>
          <p style="font-size: 14px; color: #333;">Best regards,</p>
          <p style="font-size: 14px; color: #333;">Team Krutanic</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({ email, subject: "MedTeam Login Credentials", message: emailMessage });
    res.status(200).json({ message: "Mail sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send Mail", error: error.message });
  }
});

// Update mail sent status
router.put("/mailsendedmedteam/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { mailSended } = req.body;
    const updatedstatus = await CreateMedTeam.findByIdAndUpdate(
      id,
      { $set: { mailSended } },
      { new: true }
    );
    if (!updatedstatus) {
      return res.status(404).json({ error: "MedTeam account not found" });
    }
    res.status(200).json(updatedstatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating status" });
  }
});

//Send OTP to Email for Login
router.post("/medteamsendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const medteam = await CreateMedTeam.findOne({ email });
    if (!medteam) {
      return res.status(404).json({ message: "MedTeam not found" });
    }
    if (medteam.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }
    const otp = crypto.randomInt(100000, 1000000);
    const emailMessage = `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
              <h1>Krutanic</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
              <p style="font-size: 16px; color: #333;">Welcome back! ${medteam.fullname},</p>
              <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
              <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
          </div>
      </div>
      `;

    medteam.otp = otp;
    await Promise.all([
      medteam.save(),
      sendEmail({ email, subject: "MedTeam Login OTP", message: emailMessage }),
    ]);
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login
router.post("/medteamverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const medteam = await CreateMedTeam.findOne({ email });
    if (!medteam) {
      return res.status(404).json({ message: "MedTeam not found" });
    }
    if (medteam.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (medteam.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }
    medteam.otp = null;
    await medteam.save();

    const token = jwt.sign(
      { id: medteam._id, email: medteam.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      token,
      medTeamId: medteam._id,
      medTeamName: medteam.fullname,
      designation: medteam.designation,
      message: "Login successful!",
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
});

//add team name 
router.post("/addmedteamname", verifyAnyAuth, async (req, res) => {
  const { teamname } = req.body;
  try {
    const newTeam = new MedTeamName({ teamname });
    await newTeam.save();
    res.status(200).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all team names
router.get("/getmedteamname", verifyAnyAuth, async (req, res) => {
  try {
    const teamname = await MedTeamName.find();
    res.status(200).json(teamname);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
