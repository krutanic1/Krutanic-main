const express = require("express");
const router = express.Router();
const College = require("../models/College");
const MicroUser = require("../models/MicroUser");
const MicroCourse = require("../models/MicroCourse");

// 1. College Login
router.post("/college/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const college = await College.findOne({ email });
        if (!college || college.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ college });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Fetch assigned courses for a college
router.get("/college/:id/courses", async (req, res) => {
    try {
        const college = await College.findById(req.params.id).populate("allowedCourses");
        if (!college) return res.status(404).json({ message: "College not found" });
        res.status(200).json(college.allowedCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. College adds a student
router.post("/college/:collegeId/add-student", async (req, res) => {
    try {
        const { fullName, email, password, enrolledCourses } = req.body;
        const college = await College.findById(req.params.collegeId);
        if (!college) return res.status(404).json({ message: "College not found" });

        // Check student limit
        if (college.studentsCount >= college.studentLimit) {
            return res.status(400).json({ message: "Student enrollment limit reached for this college." });
        }

        // Create student
        const student = new MicroUser({
            fullName,
            email,
            password,
            enrolledCourses,
            collegeId: college._id
        });
        await student.save();

        // Increment count
        college.studentsCount += 1;
        await college.save();

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. List all students for a college
router.get("/college/:collegeId/students", async (req, res) => {
    try {
        const students = await MicroUser.find({ collegeId: req.params.collegeId });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Send credentials to student
router.post("/college/students/:id/send-credentials", async (req, res) => {
    try {
        const student = await MicroUser.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Trigger email service placeholder
        res.status(200).json({ message: "Credentials sent to " + student.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
