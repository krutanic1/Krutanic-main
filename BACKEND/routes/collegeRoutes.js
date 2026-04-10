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
        const { fullName, email, phone, password, enrolledCourses } = req.body;
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
            phone,
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

// 4. List all students for a college (with pagination)
router.get("/college/:collegeId/students", async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 30;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await MicroUser.countDocuments({ collegeId: req.params.collegeId });
        const totalPages = Math.ceil(totalItems / limitNum);

        const students = await MicroUser.find({ collegeId: req.params.collegeId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            students,
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

const nodemailer = require("nodemailer");

// 5. Send credentials to student
router.post("/college/students/:id/send-credentials", async (req, res) => {
    try {
        const student = await MicroUser.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const emailMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div style="background-color: #FE4323; color: #fff; text-align: center; padding: 30px;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to Dikshannt</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Your scholarly research hub</p>
                </div>
                <div style="padding: 40px; color: #333;">
                    <p style="font-size: 16px;">Dear <strong>${student.fullName}</strong>,</p>
                    <p style="line-height: 1.6; color: #555;">Your institution has enrolled you in the Dikshannt portal. You now have access to your premium academic curriculum and research laboratory.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #eee;">
                        <h2 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Access Credentials</h2>
                        <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="https://micro-wine.vercel.app/login" style="color: #FE4323; text-decoration: none;">micro-wine.vercel.app/login</a></p>
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${student.email}</p>
                        <p style="margin: 5px 0;"><strong>Access Password:</strong> ${student.password}</p>
                    </div>

                    <p style="line-height: 1.6; color: #555;">Please log in to complete your profile and begin your research journey.</p>
                    <p style="margin-top: 40px; font-size: 14px; color: #333;">Best regards,<br>The Dikshannt Academic Team</p>
                </div>
                <div style="background-color: #f4f4f4; text-align: center; padding: 15px; font-size: 11px; color: #999;">
                    &copy; 2026 Dikshannt Research Hub. All Rights Reserved.
                </div>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL,
                pass: process.env.DIKSHANNT_PASSWORD || process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
            pool: true,
        });

        const mailOptions = {
            from: process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL,
            to: student.email,
            bcc: process.env.DIKSHANNT_ADMIN_MAIL,
            subject: "Your Login Credentials for Dikshannt",
            html: emailMessage,
            priority: "high",
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Credentials sent successfully to " + student.email });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: "Failed to send credentials: " + error.message });
    }
});

// 6. Admin: List all micro users (students) from all colleges (with pagination)
router.get("/admin/microusers", async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 30;
        const skip = (pageNum - 1) * limitNum;

        let query = {};
        if (search) {
            const searchRegex = { $regex: search, $options: "i" };
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex }
            ];
        }

        const totalItems = await MicroUser.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        const users = await MicroUser.find(query)
            .populate("enrolledCourses", "title")
            .populate("collegeId", "collegeName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            users,
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

module.exports = router;
