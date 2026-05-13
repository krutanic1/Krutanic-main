const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");

// Models
const BDA = require("../models/CreateBDA");
const Operation = require("../models/CreateOperation");
const AdvOperation = require("../models/CreateAdvOperation");
const AdvTeam = require("../models/CreateAdvTeam");
const MarketingTeam = require("../models/CreateMarketing");

/**
 * @route   POST /api/admin/impersonate
 * @desc    Allow Admin to log in as any staff member without OTP
 * @access  Private (Admin Only)
 */
router.post("/impersonate", verifyAdminCookie, async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "UserId and role are required" });
  }

  try {
    let user;
    let tokenPayload = {};

    const normalizedRole = role.toUpperCase();
    switch (normalizedRole) {
      case "BDA":
      case "MANAGER":
      case "LEADER":
        user = await BDA.findById(userId);
        if (user) {
          tokenPayload = { id: user._id, email: user.email };
        }
        break;
      case "OPERATION":
        user = await Operation.findById(userId);
        if (user) {
          tokenPayload = { id: user._id, email: user.email };
        }
        break;
      case "ADV_OPERATION":
        user = await AdvOperation.findById(userId);
        if (user) {
          tokenPayload = { id: user._id, email: user.email };
        }
        break;
      case "ADV_TEAM":
      case "ADV MANAGER":
      case "ADV LEADER":
      case "INSIDE SALES SPECIALIST":
      case "INSIDE_SALES_SPECIALIST":
      case "SR INSIDE SALES SPECIALIST":
      case "SR_INSIDE_SALES_SPECIALIST":
        user = await AdvTeam.findById(userId);
        if (user) {
          tokenPayload = { id: user._id, email: user.email };
        }
        break;
      case "MARKETING":
        user = await MarketingTeam.findById(userId);
        if (user) {
          tokenPayload = { id: user._id, email: user.email };
        }
        break;
      default:
        return res.status(400).json({ message: "Invalid role specified" });
    }

    if (!user) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({ message: "Cannot impersonate an inactive account" });
    }

    // Generate JWT token for the target user (Longer expiry for convenience)
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Prepare response data consistent with what the frontend expects for each role
    const responseData = {
      token,
      message: "Impersonation successful",
      user: {
        id: user._id,
        name: user.fullname,
        role: user.designation || role,
        email: user.email
      }
    };

    // Add role-specific fields using normalized checks
    if (normalizedRole.includes("BDA") || normalizedRole === "MANAGER" || normalizedRole === "LEADER") {
      responseData.bdaId = user._id;
      responseData.bdaName = user.fullname;
    } else if (normalizedRole.includes("OPERATION")) {
      responseData._id = user._id;
      responseData.operationName = user.fullname;
    } else if (normalizedRole.includes("ADV_TEAM") || normalizedRole.startsWith("ADV") || normalizedRole.includes("INSIDE SALES") || normalizedRole.includes("INSIDE_SALES")) {
      responseData.bdaId = user._id;
      responseData.bdaName = user.fullname;
      responseData.designation = user.designation;
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Impersonation error:", error);
    res.status(500).json({ message: "Server error during impersonation" });
  }
});

module.exports = router;
