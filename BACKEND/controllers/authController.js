const AtdUser = require("../models/AtdUser");
const Attendance = require("../models/Attendance");
const Admin = require("../models/AdminMail");
const AdvOps = require("../models/CreateAdvOperation");
const Bda = require("../models/CreateBDA");
const Teams = require("../models/CreateAdvTeam");
const Marketing = require("../models/CreateMarketing");
const Ops = require("../models/CreateOperation");
const HR = require("../models/CreateHR");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const { sendEmail } = require("./emailController");

const JWT_SECRET = process.env.JWT_SECRET || "KRUTANIC24";

function sanitizeAtdUser(userDoc, keepPin = false) {
  if (!userDoc) return userDoc;
  const user = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };
  user.hasPin = !!user.pin;
  if (!keepPin) delete user.pin;
  return user;
}

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
        { model: Ops, role: "operations" },
        { model: HR, role: "hr" }
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

    res.json(sanitizeAtdUser(user));
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
    if (user.status === "inactive") return res.status(403).json({ error: "Account deactivated" });

    user.lastOtpLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token, user: sanitizeAtdUser(user) });
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
      }).select("timestamp date isHalfDayOverride");

      let lateCount = 0;
      let halfDayCount = 0;
      let onTimeCount = 0;
      const detailedRecords = [];

      records.forEach(r => {
        // Convert to IST (UTC + 5:30)
        const d = new Date(r.timestamp);
        const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
        const hours = istTime.getUTCHours();
        const mins = istTime.getUTCMinutes();
        const totalMinutes = hours * 60 + mins;

        let status = "Present";
        if (r.isHalfDayOverride) {
          halfDayCount++;
          status = "Half Day";
        } else if (totalMinutes > 14 * 60) {
          halfDayCount++;
          status = "Half Day";
        } else if (totalMinutes > 11 * 60 + 5) {
          lateCount++;
          status = "Late";
        } else {
          onTimeCount++;
          status = "Present";
        }

        if (isAll) {
          detailedRecords.push({
            date: r.date,
            status: status,
            time: hours.toString().padStart(2, '0') + ":" + mins.toString().padStart(2, '0')
          });
        }
      });

      const totalDays = records.length;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        pin: u.pin,
        status: u.status || "active",
        daysPresent: totalDays,
        onTimeCount: onTimeCount,
        lateCount: lateCount,
        halfDayCount: halfDayCount,
        detailedRecords: isAll ? detailedRecords : undefined
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
      // Convert to IST (UTC + 5:30)
      const d = new Date(r.timestamp);
      const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getUTCHours();
      const mins = istTime.getUTCMinutes();
      const totalMinutes = hours * 60 + mins;

      let isHalfDay = totalMinutes > 14 * 60;
      if (r.isHalfDayOverride) isHalfDay = true;
      
      const isLate = !isHalfDay && totalMinutes > 11 * 60 + 5;
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
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status === "inactive") return res.status(403).json({ error: "Account deactivated" });
    if (user.pin !== pin) return res.status(400).json({ error: "Invalid PIN" });

    user.lastOtpLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token, user: sanitizeAtdUser(user) });
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
      return res.json({ success: true, message: "User updated successfully", user: sanitizeAtdUser(user) });
    }

    // Create new
    user = await AtdUser.create({
      email: email.toLowerCase(),
      name,
      role: role || "Employee",
      pin: pin || null,
      source: source || "manual_admin"
    });

    res.json({ success: true, message: "User added successfully", user: sanitizeAtdUser(user) });
  } catch (error) {
    console.error("AddAdminUser Error:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
};

/**
 * @desc Send reminders to users who haven't marked attendance today
 * @route POST /api/atd/admin/send-reminders
 */
exports.sendAttendanceReminders = async (req, res) => {
  try {
    // Get current date in YYYY-MM-DD (IST)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const today = istTime.toISOString().split("T")[0];

    // Get all users
    const allUsers = await AtdUser.find({}).select("email name");
    
    // Get today's attendance records
    const attendanceToday = await Attendance.find({ date: today }).select("userId");
    const usersWithAttendance = new Set(attendanceToday.map(a => a.userId.toString()));

    // Filter missing users
    const missingUsers = allUsers.filter(u => !usersWithAttendance.has(u._id.toString()));

    if (missingUsers.length === 0) {
      return res.json({ success: true, message: "All employees have marked attendance today!" });
    }

    const emailPromises = missingUsers.map(user => {
      const emailData = {
        email: user.email.toLowerCase(),
        subject: "Reminder: Mark Your Attendance",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; text-align: center;">Attendance Reminder</h2>
            <p style="color: #64748b; text-align: center;">Hello ${user.name},</p>
            <p style="color: #64748b; text-align: center;">We noticed you haven't marked your attendance for today (${today}).</p>
            <p style="color: #64748b; text-align: center;">Please log in to the portal and mark your attendance promptly.</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://www.krutanic.com/attendance" style="background: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
            </div>
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">Note: If you are on an approved leave, please ignore this reminder.</p>
          </div>
        `
      };
      return sendEmail(emailData).catch(err => {
        console.error(`Failed to send reminder email to ${user.email}:`, err);
        return null;
      });
    });

    await Promise.all(emailPromises);

    res.json({ 
      success: true, 
      message: `Attendance reminders sent to ${missingUsers.length} employees`,
      count: missingUsers.length
    });
  } catch (error) {
    console.error("SendReminders Error:", error);
    res.status(500).json({ error: "Failed to send reminders" });
  }
};

/**
 * @desc Send absent notification emails to users who haven't marked attendance today
 * @route POST /api/atd/admin/send-absent-mails
 */
exports.sendAbsentMails = async (req, res) => {
  try {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const today = istTime.toISOString().split("T")[0];

    const allUsers = await AtdUser.find({}).select("email name");
    const attendanceToday = await Attendance.find({ date: today }).select("userId");
    const usersWithAttendance = new Set(attendanceToday.map(a => a.userId.toString()));

    const absentUsers = allUsers.filter(u => !usersWithAttendance.has(u._id.toString()));

    if (absentUsers.length === 0) {
      return res.json({ success: true, message: "No one is absent today!" });
    }

    const emailPromises = absentUsers.map(user => {
      const emailData = {
        email: user.email.toLowerCase(),
        subject: "Official Notice: Absent Today",
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 12px; background-color: #fef2f2;">
            <h2 style="color: #991b1b; text-align: center;">Absence Notification</h2>
            <p style="color: #450a0a; text-align: center; font-weight: bold;">Hello ${user.name},</p>
            <p style="color: #7f1d1d; text-align: center;">Our records indicate that you have <strong>not marked your attendance</strong> for today (${today}).</p>
            <p style="color: #7f1d1d; text-align: center;">As a result, your status for today has been noted as <strong>Absent</strong> in the attendance system.</p>
            <div style="text-align: center; margin: 25px 0;">
              <p style="font-size: 14px; color: #991b1b;">If this is an error, please contact HR or mark your attendance immediately if the window is still open.</p>
              <a href="https://www.krutanic.com/attendance" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 10px;">View Attendance Portal</a>
            </div>
            <p style="font-size: 11px; color: #991b1b; text-align: center; opacity: 0.8;">Note: This is an automated notification. If you are on an approved leave, please ignore this.</p>
          </div>
        `
      };
      return sendEmail(emailData).catch(err => null);
    });

    await Promise.all(emailPromises);

    res.json({ 
      success: true, 
      message: `Absent notification emails sent to ${absentUsers.length} employees`,
      count: absentUsers.length
    });
  } catch (error) {
    console.error("SendAbsentMails Error:", error);
    res.status(500).json({ error: "Failed to send absent emails" });
  }
};

/**
 * @desc Get daily attendance summary by department/role (Admin/HR only)
 * @route GET /api/atd/admin/daily-summary
 */
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { date } = req.query; // Expecting YYYY-MM-DD
    if (!date) return res.status(400).json({ error: "Date is required" });

    // Join Attendance with AtdUser to get roles
    const summary = await Attendance.aggregate([
      { $match: { date } },
      {
        $lookup: {
          from: "atdusers",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.role",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          department: { $ifNull: ["$_id", "Other"] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, summary });
  } catch (error) {
    console.error("GetAttendanceSummary Error:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

/**
 * @desc Manually update attendance status or time
 * @route PATCH /api/atd/admin/attendance/:recordId
 */
exports.updateAttendanceStatus = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { isHalfDayOverride, newTime } = req.body;

    const record = await Attendance.findById(recordId);
    if (!record) return res.status(404).json({ error: "Attendance record not found" });

    // Handle Time Adjustment
    if (newTime) {
      // Expecting newTime in "HH:mm" format (IST)
      const [hours, mins] = newTime.split(":").map(Number);
      const d = new Date(record.timestamp);
      
      // We want to set hours/mins in IST. 
      // timestamp is stored in UTC. IST is UTC + 5:30.
      // So UTC_Time = IST_Time - 5:30.
      
      const newTimestamp = new Date(d);
      newTimestamp.setUTCHours(hours - 5, mins - 30, 0, 0);
      record.timestamp = newTimestamp;
    }

    if (isHalfDayOverride !== undefined) {
      const isMarkedHalf = !record.isHalfDayOverride && isHalfDayOverride === true;
      record.isHalfDayOverride = isHalfDayOverride;
      
      // Notify employee if marked as Half Day
      if (isMarkedHalf) {
        try {
          const user = await AtdUser.findById(record.userId);
          if (user && user.email) {
            const emailData = {
              email: user.email.toLowerCase(),
              subject: "Attendance Update: Marked as Half Day",
              message: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <h2 style="color: #0f172a; text-align: center;">Attendance Notification</h2>
                  <p style="color: #64748b; text-align: center;">Hello ${user.name},</p>
                  <p style="color: #64748b; text-align: center;">This is to inform you that HR has updated your attendance for <strong>${record.date}</strong>.</p>
                  <p style="color: #64748b; text-align: center;">Your status has been updated to <strong>Half Day</strong>.</p>
                  <div style="text-align: center; margin: 25px 0;">
                    <a href="https://www.krutanic.com/attendance" style="background: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Details</a>
                  </div>
                  <p style="font-size: 11px; color: #94a3b8; text-align: center;">If you have any questions regarding this update, please contact the HR department.</p>
                </div>
              `
            };
            await sendEmail(emailData);
          }
        } catch (err) {
          console.error("Failed to send notification email:", err);
        }
      }
    }

    await record.save();
    res.json({ success: true, message: "Attendance updated successfully", record });
  } catch (error) {
    console.error("UpdateAttendanceStatus Error:", error);
    res.status(500).json({ error: "Failed to update record" });
  }
};

/**
 * @desc Delete an attendance record
 * @route DELETE /api/atd/admin/attendance/:recordId
 */
exports.deleteAttendance = async (req, res) => {
  try {
    const { recordId } = req.params;
    const result = await Attendance.findByIdAndDelete(recordId);
    if (!result) return res.status(404).json({ error: "Record not found" });
    res.json({ success: true, message: "Attendance record deleted" });
  } catch (error) {
    console.error("DeleteAttendance Error:", error);
    res.status(500).json({ error: "Failed to delete" });
  }
};
/**
 * @desc Update employee account details (Admin only)
 * @route PATCH /api/atd/admin/user/:userId
 */
exports.updateAdminUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, pin, status } = req.body;

    const user = await AtdUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email && email.toLowerCase() !== user.email) {
      const existing = await AtdUser.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ error: "Email already in use" });
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (pin) user.pin = pin;
    if (status) user.status = status;

    await user.save();
    res.json({ success: true, message: "User updated successfully", user: sanitizeAtdUser(user, true) });
  } catch (error) {
    console.error("UpdateAdminUser Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * @desc Delete employee account and all their attendance history (Admin only)
 * @route DELETE /api/atd/admin/user/:userId
 */
exports.deleteAdminUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await AtdUser.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete user
    await AtdUser.findByIdAndDelete(userId);
    
    // Delete all attendance records
    await Attendance.deleteMany({ userId });

    res.json({ success: true, message: "User and all attendance records deleted permanently" });
  } catch (error) {
    console.error("DeleteAdminUser Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
