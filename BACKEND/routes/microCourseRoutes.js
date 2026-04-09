const express = require("express");
const router = express.Router();
const MicroCourseEnroll = require("../models/MicroCourseEnroll");
const MicroCourse = require("../models/MicroCourse");
const MicroUser = require("../models/MicroUser");
const Referral = require("../models/Referral");
const MicroCourseConfig = require("../models/MicroCourseConfig");
const FakeRegistration = require("../models/FakeRegistration");
const UpcomingCourse = require("../models/UpcomingCourse");

// 0. Get All Courses (Public for Landing Page - excludes sensitive IDs)
router.get("/microcourses/all", async (req, res) => {
    try {
        const courses = await MicroCourse.find().select("-sessions");
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
            code: referral.code,
            paymentLink: referral.paymentLink
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
        
        // Find user by email
        const user = await MicroUser.findOne({ email }).populate({
          path: 'enrolledCourses',
          model: 'MicroCourse'
        });

        // Current dashboard expects an array of enrollment objects which have a 'courseId' property
        // We'll map the user's enrolledCourses to this format
        const userEnrollments = user?.enrolledCourses?.map(course => ({
          _id: course._id, // Using course ID as enrollment ID for college students
          courseId: course,
          courseName: course.title,
          status: "accepted", // College students are pre-accepted
          amount: 0,
          isCollegeEnrolled: !!user.collegeId
        })) || [];

        // Also fetch from MicroCourseEnroll for backward compatibility/legacy direct enrollments
        const directEnrollments = await MicroCourseEnroll.find({ 
            email, 
            status: "accepted" 
        }).populate("courseId");

        // Merge them, prioritizing unique course IDs
        const allEnrollments = [...userEnrollments];
        const existingIds = new Set(allEnrollments.map(e => e.courseId._id.toString()));

        directEnrollments.forEach(de => {
          if (de.courseId && !existingIds.has(de.courseId._id.toString())) {
            allEnrollments.push(de);
          }
        });

        res.status(200).json(allEnrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 5. Get Live Registrations (Social Proof - restricted to 10AM-8PM IST)
router.get("/microcourses/live-regestraion", async (req, res) => {
    try {
        const indiaTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            hour12: false
        }).format(new Date());

        const hour = parseInt(indiaTime);
        if (hour < 10 || hour >= 20) {
            return res.status(200).json([]); // Return empty list outside business hours
        }

        const registrations = await FakeRegistration.find().limit(20);
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5B. Get Recent Enrollments (Bottom-right Social Proof - restricted to 10AM-8PM IST)
router.get("/microcourses/live-enrollments", async (req, res) => {
    try {
        const indiaTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            hour12: false
        }).format(new Date());

        const hour = parseInt(indiaTime);
        if (hour < 10 || hour >= 20) {
            return res.status(200).json([]); // Return empty list outside business hours
        }

        const enrollments = await MicroCourseEnroll.find({
            status: { $in: ["accepted", "pending"] }
        })
            .select("fullName courseName amount createdAt")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const notifications = enrollments.map((e) => ({
            studentName: e.fullName,
            courseName: e.courseName,
            amount: e.amount,
            createdAt: e.createdAt
        }));

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Get Global Config (Public)
router.get("/microcourses/config", async (req, res) => {
    try {
        let config = await MicroCourseConfig.findOne();
        if (!config) {
            config = new MicroCourseConfig();
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Get Upcoming Courses (Public)
router.get("/microcourses/upcoming", async (req, res) => {
    try {
        const upcoming = await UpcomingCourse.find().populate("courseId");
        res.status(200).json(upcoming);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
