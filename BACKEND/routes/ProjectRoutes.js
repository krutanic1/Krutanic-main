const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// GET all projects (Admin)
router.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find().populate("courseId", "title");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
});

// GET projects for a specific course (User)
router.get("/api/projects/course/:courseId", async (req, res) => {
    try {
        const projects = await Project.find({ courseId: req.params.courseId }).lean();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects for course", error: error.message });
    }
});

// POST Create or Update a project (Admin)
router.post("/api/projects", async (req, res) => {
    const { _id, courseId, title, description, level, roadmap } = req.body;
    try {
        if (_id) {
            // Update existing project
            const updatedProject = await Project.findByIdAndUpdate(
                _id,
                { courseId, title, description, level, roadmap },
                { new: true, runValidators: true }
            );
            if (!updatedProject) return res.status(404).json({ message: "Project not found" });
            return res.json(updatedProject);
        } else {
            // Create new project
            const newProject = new Project({ courseId, title, description, level, roadmap });
            await newProject.save();
            return res.status(201).json(newProject);
        }
    } catch (error) {
        res.status(400).json({ message: "Error saving project", error: error.message });
    }
});

// DELETE a project (Admin)
router.delete("/api/projects/:id", async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error: error.message });
    }
});

module.exports = router;
