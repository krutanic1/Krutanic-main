const express = require("express");
const router = express.Router();
const AptitudeQuestion = require("../models/AptitudeQuestion");

// Upload / Update Aptitude Questions (Admin)
router.post("/updateaptitudequestions", async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!Array.isArray(data)) {
            return res.status(400).json({ message: "Invalid format. Expected an array of categories and levels." });
        }

        // Process each category/level object
        for (const item of data) {
            const { category, level, questions } = item;
            
            if (!category || !level || !questions || !Array.isArray(questions)) {
                return res.status(400).json({ message: "Each item must have a category, level, and questions array." });
            }

            // Find existing document for this category and level
            const existingDoc = await AptitudeQuestion.findOne({ category, level });
            
            if (existingDoc) {
                // Update existing document
                existingDoc.questions = questions;
                await existingDoc.save();
            } else {
                // Create new document
                await AptitudeQuestion.create({
                    category,
                    level,
                    questions
                });
            }
        }

        res.status(200).json({ message: "Aptitude questions updated successfully!" });
    } catch (error) {
        console.error("Error updating aptitude questions:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Fetch distinct categories and levels (User)
router.get("/getaptitudecategories", async (req, res) => {
    try {
        const data = await AptitudeQuestion.find({}, { category: 1, level: 1, _id: 0 });
        
        // Group by category to show which levels are available for each category
        const categoriesMap = {};
        data.forEach(item => {
            if (!categoriesMap[item.category]) {
                categoriesMap[item.category] = new Set();
            }
            categoriesMap[item.category].add(item.level);
        });

        // Convert Map to Array format: [{ category: "Ratios", levels: ["Easy", "Medium"] }]
        const responseData = Object.keys(categoriesMap).map(category => ({
            category,
            levels: Array.from(categoriesMap[category])
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching aptitude categories:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Fetch questions for a specific category and level (User)
router.get("/getaptitudequestions", async (req, res) => {
    try {
        const { category, level } = req.query;
        if (!category || !level) {
            return res.status(400).json({ message: "Category and level are required parameters." });
        }

        const data = await AptitudeQuestion.findOne({ category, level });
        if (!data) {
            return res.status(404).json({ message: "No questions found for the given category and level." });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching aptitude questions:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Fetch all questions for Admin to view what's currently in the DB
router.get("/getallaptitudequestions", async (req, res) => {
    try {
        const data = await AptitudeQuestion.find();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching all aptitude questions:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a category and level
router.delete("/deleteaptitudequestion", async (req, res) => {
    try {
        const { id } = req.query;
        await AptitudeQuestion.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting aptitude question:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
