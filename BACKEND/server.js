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
const createoperation = require("./routes/CreateOperation");
const createbda = require("./routes/CreateBDA");
const Mentorship = require("./routes/Mentorship");
const Advance = require("./routes/Advance");
const NewStudentEnroll = require("./routes/NewStudentEnroll");
const CreateMarketing = require("./routes/CreateMarketing");
const sendMailWithAttchement = require("./routes/SendMailWithAttechment");
const Mockai = require("./routes/mock");
const Excercise = require("./routes/excercise");
// const PlacementCoordinator = require("./routes/PlacementCoordinator");
const ResumeATS = require("./routes/resumeats");

const User = require("./routes/User");
const admin = require("./routes/AdminLogin")
const bodyParser = require("body-parser");

const CreateJob = require("./routes/CreateJob");
const JobApplication = require("./routes/JobApplication")
const MasterClass = require("./routes/MasterClass")
const AddEvent = require("./routes/AddEvent")
const Certificate = require("./routes/Certificate")
const ReferAndEarn = require("./routes/ReferAndEarn");
const Scraper = require("./routes/Scraper");
const cookieParser = require("cookie-parser");
const os = require("os");

const app = express();

// ✅ FIX #4: Apply Request Timeout Middleware (60 seconds - before MongoDB's 10s timeout)
app.use(requestTimeout(60000));

// ✅ MIDDLEWARES
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : [];

// Handle preflight requests first
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  res.sendStatus(204);
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin, 'Allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

//create course
app.use("/", createcourse);
//create operation
app.use("/", createoperation);
app.use("/", CreateMarketing);
//create bda
app.use("/", createbda);
// mentorship
app.use("/", Mentorship);
//advance
app.use("/", Advance);
//create new student enroll
app.use("/", NewStudentEnroll);
//user
app.use("/", User);
// admin
app.use("/", admin);

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

//send mail with attchement
app.use("/", sendMailWithAttchement);

app.use("/", ResumeATS);

// app.use("/", PlacementCoordinator);

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