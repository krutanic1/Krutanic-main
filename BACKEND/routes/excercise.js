const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Question = require("../models/Question");
const Result = require("../models/result");

const exerciseFilePath = path.join(__dirname, "../config/exercise.json");

// Helper: Shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Seed Questions Logic
const seedQuestions = async () => {
  try {
    const count = await Question.countDocuments();
    console.log(`Current Question count: ${count}`);
    if (count > 0) {
      console.log("Questions already seeded.");
      return;
    }

    console.log("Seeding questions from exercise.json...");
    console.log("Exercise file path:", exerciseFilePath);

    if (!fs.existsSync(exerciseFilePath)) {
      console.error("exercise.json not found!");
      return;
    }

    const rawData = fs.readFileSync(exerciseFilePath, "utf-8");
    const allQuestions = JSON.parse(rawData);
    console.log(`Found ${allQuestions.length} questions in JSON.`);

    // Group by category
    const questionsByCategory = {};
    allQuestions.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push(q);
    });

    const newQuestions = [];

    // Distribute Difficulty
    Object.keys(questionsByCategory).forEach(category => {
      const qs = shuffleArray(questionsByCategory[category]);

      // Assign difficulties based on desired distribution or just split evenly if not enough
      // Target: 20 Beginner, 15 Intermediate, 10 Advanced

      qs.forEach((q, index) => {
        let difficulty = "Beginner";
        if (index >= 20 && index < 35) difficulty = "Intermediate";
        if (index >= 35) difficulty = "Advanced";
        // If we have more than 45, loop or just assign Advanced? Let's assign Advanced to everything else
        if (index >= 45) difficulty = "Advanced";

        newQuestions.push({
          course: category,
          difficulty: difficulty,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      });
    });

    await Question.insertMany(newQuestions);
    console.log(`Seeded ${newQuestions.length} questions.`);

  } catch (error) {
    console.error("Error seeding questions:", error);
  }
};

// Run seeding on startup (or when this file is required, simplistic approach but works for this context)
// seedQuestions(); // MOVED: Called from server.js after DB connect


// GET /api/courses - Get list of available courses
router.get("/exercise/courses", async (req, res) => {
  try {
    console.log("Fetching courses...");
    const courses = await Question.distinct("course");
    console.log("Courses found:", courses);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ... (rest of the file)

// Export router AND the seed function
router.seedQuestions = seedQuestions;
module.exports = router;
