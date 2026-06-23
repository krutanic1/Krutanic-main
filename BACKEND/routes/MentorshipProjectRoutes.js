const express = require("express");
const router = express.Router();
const MentorshipProject = require("../models/MentorshipProject");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");

// GET /api/mentorship-projects/:courseName - Fetch project details for a specific course
router.get("/mentorship-projects/:courseName", async (req, res) => {
    try {
        const { courseName } = req.params;
        const project = await MentorshipProject.findOne({ courseName });
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ message: "No projects found for this course", projects: Array(12).fill('') });
        }
    } catch (error) {
        console.error("Error fetching mentorship project:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

// POST /api/mentorship-projects - Create or update projects for a course
router.post("/mentorship-projects", verifyAdminCookie, async (req, res) => {
    try {
        const { courseName, projects } = req.body;
        
        if (!courseName) {
            return res.status(400).json({ error: "Course name is required." });
        }

        if (!projects || !Array.isArray(projects) || projects.length !== 12) {
            return res.status(400).json({ error: "Projects must be an array of 12 strings." });
        }

        // Find and update if exists, otherwise create new
        const project = await MentorshipProject.findOneAndUpdate(
            { courseName },
            { projects },
            { new: true, upsert: true } // upsert: true will create if it doesn't exist
        );

        res.status(200).json({ message: "Projects saved successfully!", project });
    } catch (error) {
        console.error("Error saving mentorship project:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

module.exports = router;
