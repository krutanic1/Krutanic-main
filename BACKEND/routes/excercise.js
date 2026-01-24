const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Question = require("../models/Question");
const Result = require("../models/result"); // Make sure this matches the filename case

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
const seedQuestions = async (force = false) => {
  try {
    const count = await Question.countDocuments();
    console.log(`Current Question count: ${count}`);
    if (count > 0 && !force) {
      console.log("Questions already seeded.");
      return;
    }

    if (force) {
      console.log("Forcing re-seed: Clearing existing questions...");
      await Question.deleteMany({});
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
    // Target: 20 Beginner, 15 Intermediate, 10 Advanced => Total 45 per category
    const TARGET_BEG = 20;
    const TARGET_INT = 15;
    const TARGET_ADV = 10;
    const TOTAL_NEEDED = TARGET_BEG + TARGET_INT + TARGET_ADV;

    Object.keys(questionsByCategory).forEach(category => {
      let qs = shuffleArray(questionsByCategory[category]);

      // If we don't have enough questions, duplicate them to meet the requirement
      if (qs.length < TOTAL_NEEDED) {
        console.log(`Category ${category} has only ${qs.length} questions. Duplicating to reach ${TOTAL_NEEDED}...`);
        while (qs.length < TOTAL_NEEDED) {
          qs = [...qs, ...qs]; // Double the array
        }
        // Trim to exact size or just keep them all? 
        // Let's just take the first TOTAL_NEEDED after shuffling again
        qs = shuffleArray(qs);
      }

      // Now assign difficulties
      qs.forEach((q, index) => {
        let difficulty = "Beginner";
        // Assign first batch to Beginner
        if (index < TARGET_BEG) {
          difficulty = "Beginner";
        }
        // Next batch to Intermediate
        else if (index < (TARGET_BEG + TARGET_INT)) {
          difficulty = "Intermediate";
        }
        // Rest to Advanced
        else {
          difficulty = "Advanced";
        }

        // Stop adding if we exceed our needed amount (to avoid massive database bloat if we doubled too much)
        // Actually, let's just cap it at TOTAL_NEEDED to be precise
        if (index < TOTAL_NEEDED) {
          newQuestions.push({
            course: category,
            difficulty: difficulty,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          });
        }
      });
    });

    await Question.insertMany(newQuestions);
    console.log(`Seeded ${newQuestions.length} questions.`);
    return newQuestions.length;

  } catch (error) {
    console.error("Error seeding questions:", error);
  }
};

// GET /exercise/force-seed route removed to prevent concurrency issues

// GET /exercise/courses - Get list of available courses
router.get("/exercise/courses", async (req, res) => {
  try {
    const courses = await Question.distinct("course");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /exercise/questions - Get questions based on course and difficulty
router.get("/exercise/questions", async (req, res) => {
  try {
    const { course, difficulty, email } = req.query;

    if (!course || !difficulty) {
      return res.status(400).json({ error: "Course and difficulty are required" });
    }

    // Determine limit based on difficulty
    let limit = 10; // Default
    if (difficulty === "Beginner") limit = 20;
    else if (difficulty === "Intermediate") limit = 15;
    else if (difficulty === "Advanced") limit = 10;

    // Fetch random questions match criteria
    const questions = await Question.aggregate([
      { $match: { course: course, difficulty: difficulty } },
      { $sample: { size: limit } }, // Random selection
      { $project: { correctAnswer: 0 } } // Exclude answer key
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this selection." });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /exercise/evaluate - Evaluate user answers
router.post("/exercise/evaluate", async (req, res) => {
  try {
    const { questions, answers, email } = req.body;

    if (!questions || !answers || questions.length !== answers.length) {
      return res.status(400).json({ error: "Invalid submission data." });
    }

    let correctCount = 0;
    const total = questions.length;

    // We re-fetch answers to ensure security, or trust the question ID if provided.
    // Since frontend sends full question objects which might NOT include ID if we projected it out (Wait, we projected out 'correctAnswer' ONLY).
    // We should rely on _id to look up the correct answers.

    const questionIds = questions.map(q => q._id);
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });

    // Map for quick lookup
    const correctContext = {};
    dbQuestions.forEach(q => {
      correctContext[q._id.toString()] = q.correctAnswer;
    });

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const correct = correctContext[q._id.toString()];

      if (userAnswer === correct) {
        correctCount++;
      }
    });

    const resultData = {
      correct: correctCount,
      incorrect: total - correctCount,
      total: total,
      isImproved: correctCount > (total * 0.7), // Logic for 'improvement' flag
      message: correctCount > (total * 0.7) ? "Great job! You passed." : "Keep practicing!",
    };

    // Simplified: Results are no longer stored in the database as per user request.
    // if (email) { ... } -> Removed

    res.json(resultData);

  } catch (error) {
    console.error("Error evaluating test:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export router AND the seed function
router.seedQuestions = seedQuestions;
module.exports = router;
