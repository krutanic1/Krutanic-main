const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config(); // Load env vars early

// ✅ Import Global MongoDB Connection Helper (for Vercel serverless)
const connectDB = require("./config/db");

// ✅ FIX #4: Import Error Handling Middleware
const { requestTimeout, dbErrorHandler, globalErrorHandler } = require("./middleware/errorHandler");

const createcourse = require("./routes/CreateCourse");
const createadvcourse = require("./routes/CreateAdvCourse");
const createoperation = require("./routes/CreateOperation");
const createadvoperation = require("./routes/CreateAdvOperation");
const createbda = require("./routes/CreateBDA");
const createadvteam = require("./routes/CreateAdvTeam");
const createhr = require("./routes/CreateHR");
const Mentorship = require("./routes/Mentorship");
const Advance = require("./routes/Advance");
const NewStudentEnroll = require("./routes/NewStudentEnroll");
const AdvEnroll = require("./routes/AdvEnroll");
const CreateMarketing = require("./routes/CreateMarketing");
const sendMailWithAttchement = require("./routes/SendMailWithAttechment");
const CronRoutes = require("./routes/CronRoutes");
const adminImpersonation = require("./routes/adminImpersonation");
 // Vercel Cron Routes

const Mockai = require("./routes/mock");

const Excercise = require("./routes/excercise");
// const PlacementCoordinator = require("./routes/PlacementCoordinator");
const ResumeATS = require("./routes/resumeats");

const User = require("./routes/User");
const ProfileRoute = require("./routes/Profile");
const admin = require("./routes/AdminLogin")
const bodyParser = require("body-parser");

const CreateJob = require("./routes/CreateJob");
const JobApplication = require("./routes/JobApplication")
const MasterClass = require("./routes/MasterClass")
const AddEvent = require("./routes/AddEvent")
const Certificate = require("./routes/Certificate")
const ReferAndEarn = require("./routes/ReferAndEarn");
const Scraper = require("./routes/Scraper");
const microCourseRoutes = require("./routes/microCourseRoutes");
const microCourseAdminRoutes = require("./routes/microCourseAdminRoutes");
const microCourseAuthRoutes = require("./routes/microCourseAuthRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const microadmin = require("./routes/microadmin");
const cookieParser = require("cookie-parser");
const activityRoutes = require("./routes/activityRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const studentRequestRoutes = require("./routes/studentRequestRoutes");

const app = express();

// ✅ FIX #4: Apply Request Timeout Middleware (60 seconds - before MongoDB's 10s timeout)
app.use(requestTimeout(60000));

// ✅ MIDDLEWARES
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : [];

// Handle preflight requests first
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  const isAllowed = !origin || allowedOrigins.some(o => origin.startsWith(o));
  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  res.sendStatus(204);
});

app.use(cors({
  origin: (origin, callback) => {
    // Check if origin loosely matches any allowed origin (handles trailing slashes)
    const isAllowed = !origin || allowedOrigins.some(o => origin.startsWith(o));
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin, 'Allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON with raw body capture for webhook verification
const captureRawBody = (req, res, buf) => {
  if (req.originalUrl && req.originalUrl.includes('/meta-webhook')) {
    req.rawBody = buf;
  }
};

app.use(bodyParser.json({ verify: captureRawBody }));
app.use(express.json({ verify: captureRawBody }));
app.use(cookieParser());

// ✅ Attendance (Cumulative Timer) - Priority Registration
const AttendanceRoute = require("./routes/Attendance");
app.use("/attendance", AttendanceRoute);

//create course
app.use("/", createcourse);
//create advance course
app.use("/", createadvcourse);
//create operation
app.use("/", createoperation);
//create adv operation
app.use("/", createadvoperation);
app.use("/", CreateMarketing);
//create bda
app.use("/", createbda);
//create adv team
app.use("/", createadvteam);
//create hr
app.use("/", createhr);
// mentorship
app.use("/", Mentorship);
//advance
app.use("/", Advance);
//create new student enroll
app.use("/", NewStudentEnroll);
//create advance enroll
app.use("/", AdvEnroll);
//user
app.use("/", User);
// profile
app.use("/", ProfileRoute);
// admin
app.use("/", admin);
const AdvLeadRoutes = require("./routes/AdvLead");
const AdvUserRoutes = require("./routes/AdvUser");
const AdvTeamRoutes = require("./routes/AdvTeam");
const AdvReportRoutes = require("./routes/AdvReport");
const AdvNotificationRoutes = require("./routes/AdvNotification");
const AdvAdminRoutes = require("./routes/AdvAdmin");

app.use("/api/adv-leads", AdvLeadRoutes);
app.use("/api/adv-users", AdvUserRoutes);
app.use("/api/adv-teams", AdvTeamRoutes);
app.use("/api/adv-reports", AdvReportRoutes);
app.use("/api/adv-notifications", AdvNotificationRoutes);
app.use("/api/admin", AdvAdminRoutes);
app.use("/api/admin", adminImpersonation);
const atdRoutes = require("./routes/atdRoutes");
app.use("/api/atd", atdRoutes);
app.use("/api/activity", activityRoutes);

// CREATEJOBS
app.use("/", CreateJob);

//MasterClass
app.use("/", MasterClass);

// JobApplication
app.use("/", JobApplication);

app.use("/", Mockai);

app.use("/", Excercise);

app.use("/", Certificate);
app.use("/", ReferAndEarn);
app.use("/", Scraper);

//AddEvent
app.use("/", AddEvent);

// MicroCourses
app.use("/api", microCourseRoutes);
app.use("/api", microCourseAdminRoutes);
app.use("/api", microCourseAuthRoutes);
app.use("/api", collegeRoutes);
app.use("/api/microadmin", microadmin);
const microCertRoutes = require("./routes/MicroCert");
app.use("/api", microCertRoutes);

app.use("/api/partner", partnerRoutes);
app.use("/api/student-requests", studentRequestRoutes);

//send mail with attchement
app.use("/", sendMailWithAttchement);

app.use("/", ResumeATS);

// app.use("/", PlacementCoordinator);

const InterviewerRoutes = require("./routes/Interviewer");
const InterviewRoutes = require("./routes/Interview");
const DashboardMetrics = require("./routes/DashboardMetrics");
const AssignmentsRoute = require("./routes/Assignments");
const PracticalsRoute = require("./routes/Practicals");
const ProjectRoutes = require("./routes/ProjectRoutes");

app.use("/api/interviewer", InterviewerRoutes);
app.use("/api/interview", InterviewRoutes);
app.use("/api/dashboard", DashboardMetrics);
app.use("/api/assignments", AssignmentsRoute);
app.use("/api/practicals", PracticalsRoute);
app.use("/", ProjectRoutes);

// Vercel Cron Route
app.use("/", CronRoutes);

// ✅ FIX #4: Error handling middleware (must be after routes)
const axios = require('axios');
// Global Proxy Route for Downloads (Moved here for reliability)
app.get("/download-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL parameter is required" });

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    res.setHeader('Content-Disposition', 'attachment; filename="certificate.jpg"');
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy Download Error:", error.message);
    res.status(500).json({ error: "Failed to download file" });
  }
});

app.use(dbErrorHandler);
app.use(globalErrorHandler);

// ✅ Cache statistics endpoint (for monitoring cache performance)
app.get("/admin/cache-stats", (req, res) => {
  try {
    const { getCacheStats } = require('./utils/cache');
    const stats = getCacheStats();

    res.json({
      timestamp: new Date().toISOString(),
      static: {
        keys: stats.static.keys,
        hits: stats.static.hits,
        misses: stats.static.misses,
        hitRate: stats.static.hitRate
      },
      dynamic: {
        keys: stats.dynamic.keys,
        hits: stats.dynamic.hits,
        misses: stats.dynamic.misses,
        hitRate: stats.dynamic.hitRate
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Cache stats unavailable", message: error.message });
  }
});

// ✅ Health check endpoint
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.send("✅ Backend is live and connected to MongoDB");
  } catch (error) {
    res.status(500).send("❌ Backend error: " + error.message);
  }
});

// ✅ Connect to MongoDB on startup (for local development)
const PORT = process.env.PORT || 5000;

// Only start server locally (Vercel handles this automatically)
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    // Run seeders if needed
    try {
      if (Excercise.seedQuestions) Excercise.seedQuestions();
    } catch (seedErr) {
      console.error("❌ Seeding failed, but continuing startup:", seedErr.message);
    }

    // Initialize Schedulers (local development only)
    // Note: Production uses Vercel Cron (see vercel.json and CronRoutes.js)
    const { initializePaymentReminderScheduler } = require("./services/paymentReminderService");
    const { initializeAttendanceReportScheduler } = require("./services/attendanceReportService");
    const { initializeMasterclassReminderScheduler } = require("./services/masterclassReminderService");
    
    initializePaymentReminderScheduler();
    initializeAttendanceReportScheduler();
    initializeMasterclassReminderScheduler();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error("❌ Failed to start server:", err.message);
  });
} else {
  // For production/Vercel: Connect DB on cold start
  connectDB().catch((err) => {
    console.error("❌ MongoDB connection error on cold start:", err.message);
  });
}

// ✅ Vercel Serverless Handler - wraps app with DB connection
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};