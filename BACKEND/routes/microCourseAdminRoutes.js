const express = require("express");
const router = express.Router();
const MicroCourseEnroll = require("../models/MicroCourseEnroll");
const MicroCourse = require("../models/MicroCourse");
const Referral = require("../models/Referral");
const { sendWelcomeEmail, sendCredentialsEmail } = require("../utils/emailService");
const MicroUser = require("../models/MicroUser");
const MicroProject = require("../models/MicroProject");
const crypto = require("crypto");

// 1. Enrollment Management
router.get("/admin/microcourses/enrolls", async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const enrollments = await MicroCourseEnroll.find(query).sort({ enrollmentDate: -1 });
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/microcourses/enroll/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "accepted" or "rejected"

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const enrollment = await MicroCourseEnroll.findById(id);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        enrollment.status = status;
        await enrollment.save();

        if (status === "accepted") {
            // Update Referral Count if applicable
            if (enrollment.referralCode) {
                await Referral.findOneAndUpdate(
                    { code: enrollment.referralCode.toUpperCase() },
                    { $inc: { usedCount: 1 } }
                );
            }

            // Send Welcome Email
            await sendWelcomeEmail(enrollment.email, enrollment.fullName, enrollment.courseName);
        }

        res.status(200).json({ message: `Enrollment ${status} successfully.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Course & Session Management
router.get("/admin/microcourses/courses", async (req, res) => {
    try {
        const courses = await MicroCourse.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/admin/microcourses/courses", async (req, res) => {
    try {
        const course = new MicroCourse(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/microcourses/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await MicroCourse.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/microcourses/courses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await MicroCourse.findByIdAndDelete(id);
        res.status(200).json({ message: "Course deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a session to a course
router.post("/admin/microcourses/courses/:id/session", async (req, res) => {
    try {
        const { id } = req.params;
        const { sessionName, driveFileId } = req.body;

        const course = await MicroCourse.findById(id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        course.sessions.push({ sessionName, driveFileId });
        await course.save();

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Referral Management
router.get("/admin/microcourses/referrals", async (req, res) => {
    try {
        const referrals = await Referral.find();
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/admin/microcourses/referrals", async (req, res) => {
    try {
        const { code, discountPercentage, usageLimit } = req.body;
        const referral = new Referral({
            code: code.toUpperCase(),
            discountPercentage,
            usageLimit
        });
        await referral.save();
        res.status(201).json(referral);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/microcourses/referrals/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Referral.findByIdAndDelete(id);
        res.status(200).json({ message: "Referral code deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Project Management
router.post("/admin/microcourses/projects", async (req, res) => {
    try {
        const project = new MicroProject(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/admin/microcourses/course/:courseId/projects", async (req, res) => {
    try {
        const projects = await MicroProject.find({ courseId: req.params.courseId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 5. Send Credentials to Student
router.post("/admin/microcourses/send-credentials/:id", async (req, res) => {
    try {
        const enroll = await MicroCourseEnroll.findById(req.params.id);
        if (!enroll) return res.status(404).json({ error: "Enrollment not found" });

        // Generate a random password (8 chars)
        const rawPassword = crypto.randomBytes(4).toString("hex");

        // Create or Update MicroUser
        let user = await MicroUser.findOne({ email: enroll.email });
        if (!user) {
            user = new MicroUser({
                fullName: enroll.fullName,
                email: enroll.email,
                password: rawPassword,
                enrolledCourses: [enroll.courseId]
            });
            await user.save();
        } else {
            // Update password if they exist but we are sending new ones
            user.password = rawPassword;
            if (!user.enrolledCourses.includes(enroll.courseId)) {
                user.enrolledCourses.push(enroll.courseId);
            }
            await user.save();
        }

        // Send Email
        await sendCredentialsEmail(enroll.email, enroll.fullName, rawPassword);

        // Update enrollment flag
        enroll.credentialsSent = true;
        await enroll.save();

        res.status(200).json({ message: "Credentials sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
