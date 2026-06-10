const express = require("express");
const router = express.Router();
const InterviewQuestion = require("../models/InterviewQuestion");

// Get all interview questions
router.get("/getinterviewquestions", async (req, res) => {
    try {
        const questions = await InterviewQuestion.find({});
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching interview questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Bulk update interview questions
router.post("/bulkinterviewquestions", async (req, res) => {
    try {
        const data = req.body; // Expects an array of objects

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: "Invalid data format. Expected an array." });
        }

        // Basic validation
        for (const item of data) {
            if (!item.heading || !Array.isArray(item.questions)) {
                return res.status(400).json({ message: "Each item must have a 'heading' and a 'questions' array." });
            }
        }

        // Delete all existing questions
        await InterviewQuestion.deleteMany({});

        // Insert new questions
        const newQuestions = await InterviewQuestion.insertMany(data);

        res.status(201).json({ message: "Interview questions updated successfully", data: newQuestions });
    } catch (error) {
        console.error("Error updating interview questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update interview questions for a SPECIFIC course
router.post("/updatecoursequestions", async (req, res) => {
    try {
        const { courseTitle, data } = req.body;

        if (!courseTitle) {
            return res.status(400).json({ message: "Course title is required." });
        }

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: "Invalid data format. Expected an array of questions." });
        }

        // Basic validation
        for (const item of data) {
            if (!item.heading || !Array.isArray(item.questions)) {
                return res.status(400).json({ message: "Each item must have a 'heading' and a 'questions' array." });
            }
        }

        // Add courseTitle to each item
        const dataWithCourse = data.map(item => ({
            ...item,
            courseTitle: courseTitle
        }));

        // Delete existing questions ONLY for this course
        await InterviewQuestion.deleteMany({ courseTitle: courseTitle });

        // Insert new questions for this course
        const newQuestions = await InterviewQuestion.insertMany(dataWithCourse);

        res.status(201).json({ message: `Interview questions for ${courseTitle} updated successfully`, data: newQuestions });
    } catch (error) {
        console.error("Error updating specific course interview questions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
