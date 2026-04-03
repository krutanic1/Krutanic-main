const express = require("express");
const router = express.Router();
const MicroCourseEnroll = require("../models/MicroCourseEnroll");
const MicroCourse = require("../models/MicroCourse");
const Referral = require("../models/Referral");
const FakeRegistration = require("../models/FakeRegistration");

// 0. Get All Courses (Public for Landing Page)
router.get("/microcourses/all", async (req, res) => {
    try {
        const courses = await MicroCourse.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 1. Validate Referral Code
router.post("/microcourses/check-referral", async (req, res) => {
    try {
        const { code } = req.body;
        const referral = await Referral.findOne({ code: code.toUpperCase() });

        if (!referral) {
            return res.status(404).json({ message: "Invalid referral code" });
        }

        if (referral.usedCount >= referral.usageLimit) {
            return res.status(400).json({ message: "Referral code limit reached" });
        }

        res.status(200).json({
            message: "Referral code applied!",
            discountPercentage: referral.discountPercentage,
            code: referral.code
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Initial Enrollment (Step 1 of the form)
router.post("/microcourses/enroll", async (req, res) => {
    try {
        const { fullName, email, mobile, courseId, referralCode } = req.body;

        const course = await MicroCourse.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        let finalPrice = course.price || 5000;
        if (referralCode) {
            const referral = await Referral.findOne({ code: referralCode.toUpperCase() });
            if (referral && referral.usedCount < referral.usageLimit) {
                finalPrice = (course.price || 5000) * (1 - referral.discountPercentage / 100);
            }
        }

        const enrollment = new MicroCourseEnroll({
            fullName,
            email,
            mobile,
            courseId,
            courseName: course.title,
            amount: finalPrice,
            referralCode,
            status: "pending"
        });

        await enrollment.save();
        res.status(201).json({ 
            message: "Enrollment initiated. Please complete the payment.",
            enrollmentId: enrollment._id,
            amount: finalPrice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Submit Transaction ID (Step 2 of the form)
router.post("/microcourses/submit-transaction", async (req, res) => {
    try {
        const { enrollmentId, transactionId } = req.body;

        const enrollment = await MicroCourseEnroll.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        enrollment.transactionId = transactionId;
        await enrollment.save();

        res.status(200).json({ message: "Transaction ID submitted successfully. Admin will verify shortly." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get My Enrolled Courses (Student Dashboard)
router.get("/microcourses/my-courses", async (req, res) => {
    try {
        const { email } = req.query; // Simple email-based lookup for now
        const enrollments = await MicroCourseEnroll.find({ 
            email, 
            status: "accepted" 
        }).populate("courseId");

        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 5. Get Fake Registrations (Social Proof)
router.get("/microcourses/fake-registrations", async (req, res) => {
    try {
        const registrations = await FakeRegistration.find().limit(20);
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
