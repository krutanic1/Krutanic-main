const express = require("express");
const router = express.Router();
const MicroCourseEnroll = require("../models/MicroCourseEnroll");
const MicroCourse = require("../models/MicroCourse");
const Referral = require("../models/Referral");
const College = require("../models/College");
const { sendWelcomeEmail, sendCredentialsEmail, sendCollegeCredentialsEmail } = require("../utils/emailService");
const MicroUser = require("../models/MicroUser");
const MicroProject = require("../models/MicroProject");
const MicroCourseConfig = require("../models/MicroCourseConfig");
const UpcomingCourse = require("../models/UpcomingCourse");
const crypto = require("crypto");


// 1. Enrollment Management
router.get("/admin/microcourses/enrolls", async (req, res) => {
    try {
        const { status, page, limit, search } = req.query;
        let query = {};
        if (status) query.status = status;

        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { transactionId: searchRegex }
            ];
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 30;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await MicroCourseEnroll.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        const enrollments = await MicroCourseEnroll.find(query)
            .sort({ enrollmentDate: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            enrollments,
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
            const welcomeSent = await sendWelcomeEmail(enrollment.email, enrollment.fullName, enrollment.courseName);
            if (!welcomeSent) {
                return res.status(500).json({ error: "Enrollment updated, but failed to send welcome email. Check SMTP configuration." });
            }
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

// 2.1 Session Management
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

router.patch("/admin/microcourses/courses/:courseId/session/:sessionId", async (req, res) => {
    try {
        const { courseId, sessionId } = req.params;
        const { sessionName, driveFileId } = req.body;

        const course = await MicroCourse.findOneAndUpdate(
            { _id: courseId, "sessions._id": sessionId },
            { 
                $set: { 
                    "sessions.$.sessionName": sessionName, 
                    "sessions.$.driveFileId": driveFileId 
                } 
            },
            { new: true }
        );

        if (!course) return res.status(404).json({ message: "Course or session not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/microcourses/courses/:courseId/session/:sessionId", async (req, res) => {
    try {
        const { courseId, sessionId } = req.params;
        const course = await MicroCourse.findByIdAndUpdate(
            courseId,
            { $pull: { sessions: { _id: sessionId } } },
            { new: true }
        );

        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
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
        const { code, discountPercentage, usageLimit, paymentLink } = req.body;
        const referral = new Referral({
            code: code.toUpperCase(),
            discountPercentage,
            usageLimit,
            paymentLink
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

        // Create/update without full-document validation to avoid legacy invalid fields
        await MicroUser.updateOne(
            { email: enroll.email },
            {
                $set: {
                    fullName: enroll.fullName,
                    password: rawPassword,
                },
                $setOnInsert: {
                    email: enroll.email,
                },
                $addToSet: {
                    enrolledCourses: enroll.courseId,
                },
            },
            { upsert: true }
        );

        // Send Email
        const sent = await sendCredentialsEmail(enroll.email, enroll.fullName, rawPassword);
        if (!sent) {
            return res.status(500).json({ error: "Failed to dispatch credentials email. Check SMTP configuration." });
        }

        // Update enrollment flag
        enroll.credentialsSent = true;
        await enroll.save();

        res.status(200).json({ message: "Credentials sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Global Configuration Management
router.get("/admin/microcourses/config", async (req, res) => {
    try {
        let config = await MicroCourseConfig.findOne();
        if (!config) {
            config = new MicroCourseConfig();
            await config.save();
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/admin/microcourses/config", async (req, res) => {
    try {
        let config = await MicroCourseConfig.findOne();
        if (!config) {
            config = new MicroCourseConfig(req.body);
        } else {
            Object.assign(config, req.body);
        }
        await config.save();
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. College Management (Admin side with pagination)
router.get("/admin/colleges", async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 30;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await College.countDocuments();
        const totalPages = Math.ceil(totalItems / limitNum);

        const colleges = await College.find()
            .populate("allowedCourses")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            colleges,
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

router.post("/admin/colleges", async (req, res) => {
    try {
        const { collegeName, authorizerName, email, password, studentLimit, allowedCourses } = req.body;
        const college = new College({
            collegeName,
            authorizerName,
            email,
            password,
            studentLimit,
            allowedCourses
        });
        await college.save();
        res.status(201).json(college);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/admin/colleges/:id/send-credentials", async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) return res.status(404).json({ message: "College not found" });

        const success = await sendCollegeCredentialsEmail(
            college.email, 
            college.authorizerName, 
            college.collegeName, 
            college.password
        );
        
        if (success) {
            res.status(200).json({ message: "Credentials sent to " + college.email });
        } else {
            res.status(500).json({ message: "Failed to dispatch email. Please check SMTP configuration." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/admin/microcourses/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProject = await MicroProject.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/microcourses/projects/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await MicroProject.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/admin/colleges/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCollege = await College.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedCollege);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/colleges/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await College.findByIdAndDelete(id);
        // Also delete associated students for data integrity
        await MicroUser.deleteMany({ collegeId: id });
        res.status(200).json({ message: "College and associated members deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Upcoming Courses Management
router.get("/admin/microcourses/upcoming", async (req, res) => {
    try {
        const upcoming = await UpcomingCourse.find().populate("courseId");
        res.status(200).json(upcoming);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/admin/microcourses/upcoming", async (req, res) => {
    try {
        const { courseName, isExisting, courseId, startDate, enrolledCount } = req.body;
        const upcoming = new UpcomingCourse({ 
            courseName, 
            isExisting, 
            courseId,
            startDate,
            enrolledCount
        });
        await upcoming.save();
        res.status(201).json(upcoming);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/admin/microcourses/upcoming/:id", async (req, res) => {
    try {
        const { startDate, enrolledCount, courseName } = req.body;
        const upcoming = await UpcomingCourse.findByIdAndUpdate(
            req.params.id,
            { startDate, enrolledCount, courseName },
            { new: true }
        );
        res.status(200).json(upcoming);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/admin/microcourses/upcoming/:id", async (req, res) => {
    try {
        await UpcomingCourse.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Upcoming course removed." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

