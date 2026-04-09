const express = require("express");
const router = express.Router();
const MicroCert = require("../models/MicroCert");
const MicroUser = require("../models/MicroUser");
const MicroCourseEnroll = require("../models/MicroCourseEnroll");
const MicroCourse = require("../models/MicroCourse");
const jwt = require("jsonwebtoken");

// Middleware to verify student token
const verifyStudent = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "KRUTANIC_SECRET");
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// 1. Check Eligibility (14-day rule OR approved status)
router.get("/microcourses/cert-eligibility/:courseId", verifyStudent, async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.userId;

        const user = await MicroUser.findById(studentId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find enrollment date
        let enrollDate = user.createdAt; // Default for college students
        const directEnroll = await MicroCourseEnroll.findOne({ email: user.email, courseId, status: "accepted" });
        if (directEnroll) enrollDate = directEnroll.enrollmentDate || directEnroll.createdAt;

        // Check if 14 days passed
        const now = new Date();
        const diffDays = Math.floor((now - new Date(enrollDate)) / (1000 * 60 * 60 * 24));
        const is14DaysPassed = diffDays >= 14;

        // Check if an existing certificate or request exists
        const existingCert = await MicroCert.findOne({ studentId, courseId });

        res.status(200).json({
            isEligible: is14DaysPassed || existingCert?.status === "delivered",
            status: existingCert?.status || (is14DaysPassed ? "ready" : "locked"),
            diffDays,
            enrollDate,
            certificate: existingCert
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Apply for Early Certificate (Manually)
router.post("/microcourses/apply-early", verifyStudent, async (req, res) => {
    try {
        const { courseId, courseTitle } = req.body;
        const studentId = req.userId;

        const user = await MicroUser.findById(studentId);
        const existing = await MicroCert.findOne({ studentId, courseId });
        if (existing) return res.status(400).json({ message: "Application already exists" });

        // Find enrollment date for record
        let enrollDate = user.createdAt;
        const directEnroll = await MicroCourseEnroll.findOne({ email: user.email, courseId, status: "accepted" });
        if (directEnroll) enrollDate = directEnroll.enrollmentDate || directEnroll.createdAt;

        const newCert = new MicroCert({
            studentId,
            fullName: user.fullName,
            email: user.email,
            courseId,
            courseTitle,
            enrollDate,
            status: "pending",
            issueMethod: "manual"
        });

        await newCert.save();
        res.status(201).json({ message: "Application submitted for Admin review", certificate: newCert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Admin: Get Pending Certs (with pagination)
router.get("/admin/certs/pending", async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 30;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await MicroCert.countDocuments({ status: "pending" });
        const totalPages = Math.ceil(totalItems / limitNum);

        const requests = await MicroCert.find({ status: "pending" })
            .sort({ applyDate: 1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            requests,
            pagination: {
                totalItems,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Admin: Approve Certificate
router.put("/admin/certs/approve/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cert = await MicroCert.findByIdAndUpdate(id, { status: "delivered" }, { new: true });
        if (!cert) return res.status(404).json({ message: "Request not found" });
        res.status(200).json({ message: "Certificate issued successfully", cert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Admin: Reject Certificate
router.put("/admin/certs/reject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cert = await MicroCert.findByIdAndUpdate(id, { status: "rejected" }, { new: true });
        res.status(200).json({ message: "Request rejected", cert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
