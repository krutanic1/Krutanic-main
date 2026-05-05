const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");
const jwt = require("jsonwebtoken");
const AdvTeam = require("../models/CreateAdvTeam");
const { cachedQuery, invalidateCache } = require("../utils/cache");
const TeamName = require("../models/TeamName");
const AdvTeamName = require("../models/AdvTeamName");
const crypto = require('crypto');

//post to create a new adv team account
router.post("/createadvteam", async (req, res) => {
  const { fullname, email, team, teams, designation, password } = req.body;
  try {
    const newAdvTeam = new AdvTeam({
      fullname: fullname,
      email: email,
      team: team,
      teams: teams || [], // Store teams array for managers
      designation: designation,
      password: password
    });
    await newAdvTeam.save();

    // ✅ Invalidate AdvTeam cache when new member is created
    invalidateCache('advteam:all', 'static');

    res.status(201).json(newAdvTeam);
  } catch (error) {
    console.error("Error creating Adv Team member:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all adv team accounts (WITH CACHING)
router.get("/getadvteam", async (req, res) => {
  const { advTeamId } = req.query;
  try {
    let advTeam;
    if (advTeamId) {
      // Don't cache individual lookups
      advTeam = await AdvTeam.findById(advTeamId);
      if (!advTeam) {
        return res.status(404).json({ message: "Adv Team member not found for the given id" });
      }
    } else {
      // ✅ CACHE: AdvTeam list (occasionally changes, 2 min TTL)
      // ✅ FIX: Use aggregation to ensure target is always an array (prevents frontend .map() crashes)
      advTeam = await cachedQuery(
        'advteam:all',
        () => AdvTeam.aggregate([
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
              // ✅ CRITICAL FIX: Ensure target is always an array, never null/undefined
              target: { $ifNull: ["$target", []] }
            }
          }
        ]),
        120,  // 2 minutes TTL
        'static'
      );

      // Add HTTP cache header for browser caching
      res.set('Cache-Control', 'public, max-age=120');
    }

    res.status(200).json(advTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// put request to edit the adv team details
router.put("/updateadvteam/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, team, teams, designation } = req.body;
    const updatedAdvTeam = await AdvTeam.findByIdAndUpdate(
      id,
      { fullname, email, password, team, teams: teams || [], designation },
      { new: true }
    );
    if (!updatedAdvTeam) {
      return res.status(404).json({ error: "Adv Team member not found" });
    }

    // ✅ Invalidate AdvTeam cache when member is updated
    invalidateCache('advteam:all', 'static');

    res.status(200).json(updatedAdvTeam);
  } catch (error) {
    res.status(400).json({ error: "Error updating adv team member" });
  }
});

//put request to update the adv team status inactive 
router.put("/updateadvteamstatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedStatus = await AdvTeam.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ error: "Adv Team member not found" });
    }

    // ✅ Invalidate AdvTeam cache when status changes
    invalidateCache('advteam:all', 'static');

    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating adv team status" });
  }
});

//put request to assign a target to adv team accounts
router.post("/assignadvteamtarget/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;
    const updatedAdvTeam = await AdvTeam.findByIdAndUpdate(
      id,
      { $push: { target } },
      { new: true }
    );
    if (!updatedAdvTeam) {
      return res.status(404).json({ error: "Adv Team member not found" });
    }
    res.status(200).json(updatedAdvTeam);
  } catch (error) {
    res.status(400).json({ error: "Error updating adv team target" });
  }
});

//delete request to delete the adv team account
router.delete("/deleteadvteam/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdvTeam = await AdvTeam.findByIdAndDelete(id);
    if (!deletedAdvTeam) {
      return res.status(404).json({ error: "Adv Team member not found" });
    }
    res.status(200).json({ message: "Adv Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting adv team member" });
  }
});

//delete request to delete the target 
router.put("/deleteadvteamtarget/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;
    const updatedAdvTeam = await AdvTeam.findByIdAndUpdate(
      id,
      { $pull: { target: target } },
      { new: true }
    );
    if (!updatedAdvTeam) {
      return res.status(404).json({ error: "Adv Team member not found" });
    }
    res.status(200).json(updatedAdvTeam);
  } catch (error) {
    res.status(400).json({ error: "Error deleting target" });
  }
});


//Send OTP to Adv Team Member Email
router.post("/advteamsendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const advTeam = await AdvTeam.findOne({ email });
    if (!advTeam) {
      return res.status(404).json({ message: "Adv Team member not found" });
    }

    if (advTeam.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }

    const otp = crypto.randomInt(100000, 1000000);

    // Send OTP via Email
    const emailMessage = `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
              <h1>Krutanic</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
              <p style="font-size: 16px; color: #333;">Welcome back! ${advTeam.fullname},</p>
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

    advTeam.otp = otp;
    await Promise.all([
      advTeam.save(),
      sendEmail({ email, subject: "Adv Team Login Credentials", message: emailMessage }),
    ]);
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login
router.post("/advteamverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const advTeam = await AdvTeam.findOne({ email });
    if (!advTeam) {
      return res.status(404).json({ message: "Adv Team member not found" });
    }

    // Regular login: OTP must match
    if (advTeam.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (advTeam.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }

    // Clear OTP after successful login
    advTeam.otp = null;
    await advTeam.save();

    const token = jwt.sign(
      { id: advTeam._id, email: advTeam.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      token,
      bdaId: advTeam._id,
      bdaName: advTeam.fullname,
      message: "Login successful!",
      user: {
        id: advTeam._id,
        name: advTeam.fullname,
        role: advTeam.designation,
        team: advTeam.team || (advTeam.teams && advTeam.teams.length > 0 ? advTeam.teams[0] : "")
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

// Manager impersonation of their team members
router.post("/manager-impersonate-advteam", async (req, res) => {
  const { userId, managerId } = req.body;
  try {
    const manager = await AdvTeam.findById(managerId);
    if (!manager || !["ADV Manager", "MANAGER", "ADV Leader", "LEADER"].includes(manager.designation)) {
      return res.status(403).json({ message: "Unauthorized: Only managers can impersonate" });
    }

    const user = await AdvTeam.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Check if user is in manager's team
    const managerTeams = manager.teams && manager.teams.length > 0 ? manager.teams : [manager.team];
    const userTeams = user.teams && user.teams.length > 0 ? user.teams : [user.team];
    
    // allow if there's any intersection
    const isInTeam = userTeams.some(t => managerTeams.includes(t)) || managerTeams.includes(user.team) || userTeams.includes(manager.team);
    
    if (!isInTeam) {
      return res.status(403).json({ message: "Unauthorized: User not in your team" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Cannot impersonate an inactive account" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      token,
      bdaId: user._id,
      bdaName: user.fullname,
      designation: user.designation,
      message: "Impersonation successful!",
      user: {
        id: user._id,
        name: user.fullname,
        role: user.designation,
        team: user.team
      }
    });

  } catch (error) {
    console.error("Manager Impersonation error:", error);
    res.status(500).json({ message: "Server error during impersonation" });
  }
});

/*
router.post("/checkadvteamauth", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the adv team member by email
    const advTeam = await AdvTeam.findOne({ email });
    if (!advTeam) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ ADMIN IMPERSONATION: If password is empty/undefined, allow admin to login as any member
    // This enables admins to test/access any account without needing their password
    const isAdminImpersonation = !password || password === "";

    if (!isAdminImpersonation && password !== advTeam.password) {
      // Regular login: password must match
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token for the account
    const token = jwt.sign(
      { id: advTeam._id, email: advTeam.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log admin impersonation for security audit
    if (isAdminImpersonation) {
      console.log(`🔐 [ADMIN IMPERSONATION] Admin logged in as: ${advTeam.email} (${advTeam.fullname})`);
    }

    res.status(200).json({
      token,
      bdaId: advTeam._id,
      bdaName: advTeam.fullname,
      designation: advTeam.designation,
      user: {
        id: advTeam._id,
        name: advTeam.fullname,
        role: advTeam.designation,
        team: advTeam.team || (advTeam.teams && advTeam.teams.length > 0 ? advTeam.teams[0] : "")
      }
    });

  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ message: "Server error" });
  }
});
*/

//put request to update the adv team access
router.put("/updateadvteamaccess/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Access } = req.body;
    const updatedStatus = await AdvTeam.findByIdAndUpdate(
      id,
      { $set: { Access } },
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ error: "Adv Team account not found" });
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating adv team account" });
  }
});

//add team name from create adv team page 
router.post("/addadvteamname", async (req, res) => {
  const { teamname } = req.body;
  try {
    const newTeam = new AdvTeamName({
      teamname,
    });
    await newTeam.save();
    res.status(200).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all adv team names
router.get("/getadvteamname", async (req, res) => {
  try {
    const teamname = await AdvTeamName.find();
    res.status(200).json(teamname);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// post request to assign target to adv team
router.post("/targetassigntoadvteam", async (req, res) => {
  try {
    const { teamId, targetValue, payments, currentMonth } = req.body;

    const newTarget = {
      currentMonth,
      targetValue,
      payments,
    };

    const updatedTeam = await AdvTeamName.findByIdAndUpdate(
      teamId,
      { $push: { target: newTarget } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Adv Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error updating adv team target:", error);
    res.status(500).json({ error: "Server error while assigning target" });
  }
});

//delete adv team last index target 
router.delete("/delete-advteam-target", async (req, res) => {
  try {
    const { teamId, targetId } = req.body;

    if (!teamId || !targetId) {
      return res.status(400).json({ error: "Missing teamId or targetId" });
    }

    const updatedTeam = await AdvTeamName.findByIdAndUpdate(
      teamId,
      { $pull: { target: { _id: targetId } } }, // precise pull
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Adv Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error deleting target:", error);
    res.status(500).json({ error: "Internal server error while deleting target" });
  }
});

module.exports = router;
