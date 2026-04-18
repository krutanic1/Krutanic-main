const Attendance = require("../models/Attendance");
const redis = require("../config/redis");
const GlobalConfig = require("../models/GlobalConfig");

// Contribution note: non-functional comment added for repository activity.

/**
 * @desc Haversine formula to calculate distance in meters
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

/**
 * @desc Mark attendance with geolocation check
 * @route POST /api/atd/mark
 * @access Private
 */
exports.markAttendance = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];

    if (!lat || !lng) {
      return res.status(400).json({ error: "Location is required" });
    }

    const key = `attendance:${userId}:${today}`;

    // Check if already marked today in Redis
    const exists = await redis.get(key);
    if (exists) return res.status(400).json({ error: "Already marked today" });

    // Office location (configurable in .env)
    const officeLat = parseFloat(process.env.OFFICE_LAT) || 12.9716;
    const officeLng = parseFloat(process.env.OFFICE_LNG) || 77.5946;
    const attendanceRadiusMeters = parseFloat(process.env.ATTENDANCE_RADIUS_METERS) || 10;

    const distance = getDistance(lat, lng, officeLat, officeLng);

    if (distance > attendanceRadiusMeters) {
      return res.status(400).json({ 
        error: "Outside area", 
        message: `You are ${Math.round(distance)}m away. You must be within ${attendanceRadiusMeters}m of the office.`
      });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const deviceInfo = req.headers['user-agent'];

    const config = await GlobalConfig.findOne({ key: "attendance_override" });
    let finalTimestamp = new Date();

    if (config && config.value === true) {
      // Force attendance to 11:00 AM IST (UTC 05:30)
      finalTimestamp = new Date();
      finalTimestamp.setUTCHours(5, 30, 0, 0);
    }

    await Attendance.create({
      userId,
      date: today,
      timestamp: finalTimestamp,
      lat,
      lng,
      ip,
      deviceInfo
    });

    // Cache in Redis for 24 hours
    await redis.set(key, "1", { ex: 86400 });

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    console.error("MarkAttendance Error:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
};

/**
 * @desc Get attendance history for the logged-in user with pagination and filters
 * @route GET /api/atd/history
 * @access Private
 */
exports.getHistory = async (req, res) => {
  try {
    const { month, year, page = 1, limit = 5 } = req.query;
    const filter = { userId: req.user._id };

    // Month filtering (Regex on YYYY-MM-DD string)
    if (month !== undefined && year !== undefined) {
      const monthStr = (parseInt(month) + 1).toString().padStart(2, "0");
      filter.date = { $regex: new RegExp(`^${year}-${monthStr}-`) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const globalTotal = await Attendance.countDocuments({ userId: req.user._id });
    // Calculate counts in JS
    let lateCount = 0;
    let halfDayCount = 0;
    let onTimeCount = 0;
    let allMatchingData = [];
    try {
      allMatchingData = await Attendance.find(filter);
    } catch (err) {
      console.error("Database find error:", err);
    }

    allMatchingData.forEach(h => {
      // Convert to IST (UTC + 5:30)
      const d = new Date(h.timestamp);
      const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getUTCHours();
      const mins = istTime.getUTCMinutes();
      
      // Thresholds:
      // On Time: <= 11:05 AM
      // Late: > 11:05 AM AND <= 2:00 PM (14:00)
      // Half Day: > 2:00 PM (14:00)
      
      const totalMinutes = hours * 60 + mins;
      
      if (totalMinutes > 14 * 60) {
        halfDayCount++;
      } else if (totalMinutes > 11 * 60 + 5) {
        lateCount++;
      } else {
        onTimeCount++;
      }
    });

    const total = allMatchingData.length;

    const rawData = await Attendance.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit)); 

    const data = rawData.map(h => {
      // Convert to IST (UTC + 5:30)
      const d = new Date(h.timestamp);
      const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getUTCHours();
      const mins = istTime.getUTCMinutes();
      const totalMinutes = hours * 60 + mins;

      let isHalfDay = totalMinutes > 14 * 60;
      if (h.isHalfDayOverride) isHalfDay = true;

      const isLate = !isHalfDay && totalMinutes > 11 * 60 + 5;
      
      return { ...h.toObject(), isLate, isHalfDay };
    });

    res.json({
      data,
      total,
      globalTotal,
      onTimeCount,
      lateCount,
      halfDayCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("GetHistory Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

/**
 * @desc Get global attendance override status
 * @route GET /api/atd/admin/attendance-override
 * @access Private/Admin
 */
exports.getAttendanceOverride = async (req, res) => {
  try {
    const config = await GlobalConfig.findOne({ key: "attendance_override" });
    res.json({ success: true, value: config ? config.value : false });
  } catch (error) {
    console.error("GetAttendanceOverride Error:", error);
    res.status(500).json({ error: "Failed to fetch override status" });
  }
};

/**
 * @desc Set global attendance override status
 * @route POST /api/atd/admin/attendance-override
 * @access Private/Admin 
 */
exports.toggleAttendanceOverride = async (req, res) => {
  try {
    const { value } = req.body;
    await GlobalConfig.findOneAndUpdate(
      { key: "attendance_override" },
      { value: !!value },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: `Attendance override turned ${value ? 'ON' : 'OFF'}` });
  } catch (error) {
    console.error("ToggleAttendanceOverride Error:", error);
    res.status(500).json({ error: "Failed to update override status" });
  }
};
