const AtdUser = require("../models/AtdUser");
const Attendance = require("../models/Attendance");
const Admin = require("../models/AdminMail");
const AdvOps = require("../models/CreateAdvOperation");
const Bda = require("../models/CreateBDA");
const Teams = require("../models/CreateAdvTeam");
const Marketing = require("../models/CreateMarketing");
const Ops = require("../models/CreateOperation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const { sendEmail } = require("./emailController");

const JWT_SECRET = process.env.JWT_SECRET || "KRUTANIC24";

/**
 * @desc Check if user exists in AtdUser, if not, sync from other collections
 * @route POST /api/atd/check-user
 */
exports.checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await AtdUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      const Profile = require("../models/Profile");
      const collections = [
        { model: Admin, role: "admin" },
        { model: AdvOps, role: "operations" },
        { model: Bda, role: "bda" },
        { model: Teams, role: "team_member" },
        { model: Marketing, role: "marketing" },
        { model: Ops, role: "operations" }
      ];

      for (let item of collections) {
        let found = await item.model.findOne({ email: email.toLowerCase() });

        if (found) {
          // Double check Profile for the most accurate name
          const profile = await Profile.findOne({ email: email.toLowerCase() });
          const namePrefix = email.split("@")[0].toUpperCase();
          const syncName = profile?.personal?.name || found.fullname || found.name || namePrefix;

          user = await AtdUser.create({
            email: found.email.toLowerCase(),
            name: syncName,
            role: found.designation || item.role,
            source: item.model.collection.name,
            pin: null,
            lastOtpLogin: null
          });
          break;
        }
      }
    }

    if (!user) {
      return res.status(403).json({ error: "Not allowed" });
    }

    res.json(user);
  } catch (error) {
    console.error("CheckUser Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Generate and send OTP via Redis (Simulated email for now)
 * @route POST /api/atd/send-otp
 */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in Redis for 5 minutes (300 seconds)
    await redis.set(`otp:${email.toLowerCase()}`, otp, { ex: 300 });

    // Send Real Email
    const emailData = {
      email: email.toLowerCase(),
      subject: "Your Krutanic Attendance Verification Code",
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; text-align: center;">Identity Verification</h2>
          <p style="color: #64748b; text-align: center;">Enter the code below to access your attendance dashboard or reset your PIN.</p>
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #FF6B00;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    try {
      await sendEmail(emailData);
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      console.error("Email send failed:", err);
      // Fallback for dev: still return success but log code
      console.log(`Fallback OTP for ${email}:`, otp);
      res.json({ success: true, message: "OTP generated (Dev Mode Fallback)", otp: process.env.NODE_ENV === 'development' ? otp : undefined });
    }
  } catch (error) {
    console.error("SendOtp Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/**
 * @desc Verify OTP and issue JWT
 * @route POST /api/atd/verify-otp
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const stored = await redis.get(`otp:${email.toLowerCase()}`);

    if (!stored || stored != otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await AtdUser.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.lastOtpLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error("VerifyOtp Error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};

/**
 * @desc Set secure PIN for the user
 * @route POST /api/atd/set-pin
 * @access Private
 */
exports.setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: "PIN is required" });

    // Assuming auth middleware sets req.user to the AtdUser document
    const user = await AtdUser.findById(req.userId || req.user?._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.pin = pin; // Store plain text
    await user.save();

    res.json({ success: true, message: "PIN set successfully" });
  } catch (error) {
    console.error("SetPin Error:", error);
    res.status(500).json({ error: "Failed to set PIN" });
  }
};

/**
 * @desc Get all members with attendance count for a month (Admin only)
 * @route GET /api/atd/admin/users
 */
exports.getAdminUsers = async (req, res) => {
  try {
    const { month, year, page = 1, limit = 50, search = "", all = false } = req.query;
    const isAll = all === "true" || all === true;
    const skip = isAll ? 0 : (parseInt(page) - 1) * parseInt(limit);
    const fetchLimit = isAll ? 0 : parseInt(limit);
    
    // Construct search filter
    const userFilter = {};
    if (search) {
      userFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Month filtering string (YYYY-MM-)
    const monthStr = (parseInt(month) + 1).toString().padStart(2, "0");
    const datePrefix = `${year}-${monthStr}-`;

    // Fetch users
    const users = await AtdUser.find(userFilter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(fetchLimit);
    
    const totalUsers = await AtdUser.countDocuments(userFilter);

    // For each user, get attendance count for the selected month
    const memberData = await Promise.all(users.map(async (u) => {
      const records = await Attendance.find({
        userId: u._id,
        date: { $regex: new RegExp(`^${datePrefix}`) }
      }).select("timestamp");

      let lateCount = 0;
      let halfDayCount = 0;
      let onTimeCount = 0;
      records.forEach(r => {
        const d = new Date(r.timestamp);
        const hours = d.getHours();
        const mins = d.getMinutes();
        if (hours >= 14) {
          halfDayCount++;
        } else if (hours > 11 || (hours === 11 && mins > 5)) {
          lateCount++;
        } else {
          onTimeCount++;
        }
      });

      const totalDays = records.length;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        daysPresent: totalDays,
        onTimeCount: onTimeCount,
        lateCount: lateCount,
        halfDayCount: halfDayCount
      };
    }));

    res.json({
      data: memberData,
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalUsers / parseInt(limit))
    });
  } catch (error) {
    console.error("GetAdminUsers Error:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

/**
 * @desc Get specific user's detailed history (Admin only)
 * @route GET /api/atd/admin/user/:userId/history
 */
exports.getAdminUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = { userId };
    if (month !== undefined && year !== undefined) {
      const monthStr = (parseInt(month) + 1).toString().padStart(2, "0");
      filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
    }

    const total = await Attendance.countDocuments(filter);
    const rawData = await Attendance.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const data = rawData.map(r => {
      const d = new Date(r.timestamp);
      const hours = d.getHours();
      const mins = d.getMinutes();
      const isHalfDay = hours >= 14;
      const isLate = !isHalfDay && (hours > 11 || (hours === 11 && mins > 5));
      return { ...r.toObject(), isLate, isHalfDay };
    });

    res.json({
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("GetAdminUserHistory Error:", error);
    res.status(500).json({ error: "Failed to fetch user history" });
  }
};

/**
 * @desc Login using PIN and issue JWT
 * @route POST /api/atd/login-pin
 */
exports.loginPin = async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) return res.status(400).json({ error: "Email and PIN are required" });

    const user = await AtdUser.findOne({ email: email.toLowerCase() });
    if (!user || !user.pin) return res.status(404).json({ error: "PIN not set or user not found" });

    const isMatch = (user.pin === pin);
    if (!isMatch) return res.status(400).json({ error: "Invalid PIN" });

    // Weekly OTP Check (Prompt 13)
    const diffDays = (new Date() - (user.lastOtpLogin || 0)) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.json({ requireOtp: true, message: "Security check: Please login using OTP once a week." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error("LoginPin Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * @desc Admin manually adds/updates a user in AtdUser
 * @route POST /api/atd/admin/add-user
 */
exports.addAdminUser = async (req, res) => {
  try {
    const { email, name, role, pin, source } = req.body;
    if (!email || !name) return res.status(400).json({ error: "Email and Name are required" });

    let user = await AtdUser.findOne({ email: email.toLowerCase() });
    if (user) {
      // Update existing
      user.name = name;
      user.role = role || user.role;
      if (pin) user.pin = pin;
      user.source = source || "manual_admin";
      await user.save();
      return res.json({ success: true, message: "User updated successfully", user });
    }

    // Create new
    user = await AtdUser.create({
      email: email.toLowerCase(),
      name,
      role: role || "Employee",
      pin: pin || null,
      source: source || "manual_admin"
    });

    res.json({ success: true, message: "User added successfully", user });
  } catch (error) {
    console.error("AddAdminUser Error:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
};
