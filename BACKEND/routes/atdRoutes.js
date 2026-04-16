const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const attendanceController = require("../controllers/attendanceController");
const atdAuth = require("../middleware/atdAuth");
const { sendMonthlyAttendanceReports } = require("../services/attendanceReportService");

// Auth routes
router.post("/check-user", authController.checkUser);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login-pin", authController.loginPin);
router.post("/set-pin", atdAuth, authController.setPin);

// Attendance routes
router.post("/mark", atdAuth, attendanceController.markAttendance);
router.get("/history", atdAuth, attendanceController.getHistory);

// Admin Attendance routes
router.get("/admin/users", atdAuth, authController.getAdminUsers);
router.post("/admin/add-user", atdAuth, authController.addAdminUser);
router.get("/admin/user/:userId/history", atdAuth, authController.getAdminUserHistory);
router.post("/admin/send-reminders", atdAuth, authController.sendAttendanceReminders);
router.post("/admin/send-absent-mails", atdAuth, authController.sendAbsentMails);
router.get("/admin/daily-summary", atdAuth, authController.getAttendanceSummary);
router.patch("/admin/attendance/:recordId", atdAuth, authController.updateAttendanceStatus);
router.delete("/admin/attendance/:recordId", atdAuth, authController.deleteAttendance);
router.patch("/admin/user/:userId", atdAuth, authController.updateAdminUser);
router.delete("/admin/user/:userId", atdAuth, authController.deleteAdminUser);

// Global Config/Override routes
router.get("/admin/attendance-override", atdAuth, attendanceController.getAttendanceOverride);
router.post("/admin/attendance-override", atdAuth, attendanceController.toggleAttendanceOverride);

// Send specific report (Admin only)
router.post("/admin/send-report/:userId", atdAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.body;
    await sendMonthlyAttendanceReports(userId, month, year);
    res.json({ success: true, message: "Report sent successfully" });
  } catch (err) {
    console.error("Error in send-report route:", err);
    res.status(500).json({ error: err.message });
  }
});

// Send reports to all employees (Admin only)
router.post("/admin/send-all-reports", atdAuth, async (req, res) => {
  try {
    const { month, year } = req.body;
    // Calling with null userId triggers all
    sendMonthlyAttendanceReports(null, month, year); 
    res.json({ success: true, message: "Bulk report dispatch started" });
  } catch (err) {
    console.error("Error in send-all-reports route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
