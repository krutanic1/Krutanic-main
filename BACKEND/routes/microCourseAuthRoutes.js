const express = require("express");
const router = express.Router();
const MicroUser = require("../models/MicroUser");
const MicroProject = require("../models/MicroProject");
const MicroProjectDiary = require("../models/MicroProjectDiary");
const jwt = require("jsonwebtoken");

// Student Login
router.post("/microcourses/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await MicroUser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: "student" },
            process.env.JWT_SECRET || "KRUTANIC_SECRET",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get My Info (Protected)
router.get("/microcourses/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "KRUTANIC_SECRET");
        const user = await MicroUser.findById(decoded.userId).select("-password");
        
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Track Session Progress
router.post("/microcourses/track-session", async (req, res) => {
    try {
        const { courseId, sessionIndex } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "KRUTANIC_SECRET");
        const user = await MicroUser.findById(decoded.userId);
        
        if (!user.courseProgress) user.courseProgress = new Map();
        
        // Ensure atomic update or just save
        const courseIdStr = courseId.toString();
        const progress = user.courseProgress.get(courseIdStr) || [];
        if (!progress.includes(sessionIndex)) {
            progress.push(sessionIndex);
            user.courseProgress.set(courseIdStr, progress);
            await user.save();
        }
        
        res.status(200).json({ message: "Progress tracked", progress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Project & Diary for Course
router.get("/microcourses/my-project/:courseId", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "KRUTANIC_SECRET");
        const studentId = decoded.userId;
        const courseId = req.params.courseId;

        const project = await MicroProject.findOne({ courseId });
        if (!project) return res.status(404).json({ message: "No project found for this course" });

        let diary = await MicroProjectDiary.findOne({ studentId, projectId: project._id });
        
        res.status(200).json({ project, diary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit/Update Diary
router.post("/microcourses/submit-diary", async (req, res) => {
    try {
        const { projectId, courseId, entries } = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "KRUTANIC_SECRET");
        const studentId = decoded.userId;

        const project = await MicroProject.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Check if all designated days have a report
        const isCompleted = project.days.every(d => 
            entries.find(e => e.dayNumber === d.dayNumber && e.report?.trim().length > 0)
        );

        const diary = await MicroProjectDiary.findOneAndUpdate(
            { studentId, projectId },
            { studentId, projectId, courseId, entries, isCompleted },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Diary updated", diary, isCompleted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
