const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Question = require("../models/Question");
const AssignmentAttempt = require("../models/AssignmentAttempt");
const { AssignmentStats } = require("../models/DashboardMetrics");

// Increase JSON limit specifically for the upload route
const uploadParser = express.json({ limit: "10mb" });

// ==========================================================
// 1. POST /exercise/upload - Upload New Questions
// ==========================================================
router.post("/exercise/upload", uploadParser, async (req, res) => {
  try {
    const { course, replaceExisting, questions } = req.body;

    if (!course || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Missing required fields: course, or questions array." });
    }

    const validDifficulties = ["Beginner", "Intermediate", "Advanced"];
    const newQuestions = [];

    // Validation Pass
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!validDifficulties.includes(q.difficulty)) {
        return res.status(400).json({ error: `Row ${i + 1}: Invalid difficulty "${q.difficulty}". Must be Beginner, Intermediate, or Advanced.` });
      }
      if (!q.question || typeof q.question !== "string") {
        return res.status(400).json({ error: `Row ${i + 1}: Missing or invalid question text.` });
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ error: `Row ${i + 1}: Must have exactly 4 options.` });
      }
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ error: `Row ${i + 1}: correctAnswer must exactly match one of the 4 options.` });
      }

      newQuestions.push({
        course,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
        topic: q.topic || "",
        isActive: true
      });
    }

    // Logic Pass
    let currentVersion = 1;

    if (replaceExisting) {
      // Soft-delete: Mark all active questions in this course as inactive
      await Question.updateMany({ course, isActive: true }, { $set: { isActive: false } });
    } else {
      // Append: Find max version for this course and increment by 1
      const highestVersionQ = await Question.findOne({ course }).sort({ version: -1 }).select("version");
      if (highestVersionQ) {
        currentVersion = highestVersionQ.version + 1;
      }
    }

    // Apply version
    newQuestions.forEach(q => q.version = currentVersion);

    // Batch Insert
    const inserted = await Question.insertMany(newQuestions);

    res.status(201).json({
      message: `Successfully uploaded ${inserted.length} questions for ${course}`,
      insertedCount: inserted.length,
      version: currentVersion,
      replaceExisting
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal server error during upload." });
  }
});

// ==========================================================
// 2. GET /exercise/stats - Get stats for an active course
// ==========================================================
router.get("/exercise/stats", async (req, res) => {
  try {
    const { course } = req.query;
    if (!course) return res.status(400).json({ error: "Course query param required" });

    const stats = await Question.aggregate([
      { $match: { course, isActive: true } },
      { $group: { _id: "$difficulty", count: { $sum: 1 } } }
    ]);

    const result = { Beginner: 0, Intermediate: 0, Advanced: 0, Total: 0 };
    stats.forEach(s => {
      if (result[s._id] !== undefined) {
        result[s._id] = s.count;
        result.Total += s.count;
      }
    });

    res.json(result);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================================
// 3. GET /exercise/courses - Get list of available courses
// ==========================================================
router.get("/exercise/courses", async (req, res) => {
  try {
    // Only return courses that have ACTIVE questions
    const courses = await Question.distinct("course", { isActive: true });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================================
// 4. GET /exercise/questions - Get questions securely
// ==========================================================
router.get("/exercise/questions", async (req, res) => {
  try {
    const { course, difficulty } = req.query;

    if (!course || !difficulty) {
      return res.status(400).json({ error: "Course and difficulty are required" });
    }

    const limits = { Beginner: 20, Intermediate: 15, Advanced: 10 };
    const limit = limits[difficulty];
    if (!limit) {
      return res.status(400).json({ error: "Invalid difficulty" });
    }

    const questions = await Question.aggregate([
      { $match: { course, difficulty, isActive: true } },
      { $sample: { size: limit } }, // Random pull
      { $project: { correctAnswer: 0 } } // STRICT SECURITY: Exclude correct answers
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No active questions found for this selection." });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================================
// 5. POST /exercise/evaluate - Secure Grading & Stats
// ==========================================================
router.post("/exercise/evaluate", async (req, res) => {
  try {
    const { questions, answers, difficulty, userId: userIdStr } = req.body;

    if (!questions || !answers || questions.length !== answers.length || !difficulty) {
      return res.status(400).json({ error: "Invalid submission payload." });
    }

    if (!["Beginner", "Intermediate", "Advanced"].includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty level provided." });
    }

    let correctCount = 0;
    const total = questions.length;

    // Secure Evaluation by re-fetching questions by _id
    // NOTE: We do NOT query for isActive: true here. 
    // This ensures if a test is updated mid-session (soft-deleted), the student can still submit.
    const questionIds = questions.map(q => q._id).filter(id => !!id);
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });

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

    const passThreshold = total * 0.7; // 70% to pass
    const isImproved = correctCount > passThreshold;

    const resultData = {
      correct: correctCount,
      incorrect: total - correctCount,
      total,
      isImproved,
      message: isImproved ? "Great job! You passed." : "Keep practicing!",
    };

    // Update Assignment Matrix (DashboardStats) if userId exists
    if (userIdStr && mongoose.Types.ObjectId.isValid(userIdStr)) {
      try {
        const userId = new mongoose.Types.ObjectId(userIdStr);
        const percentage = Math.round((correctCount / total) * 100);

        // 1. Save specific attempt
        await new AssignmentAttempt({
          userId,
          level: difficulty,
          score: correctCount,
          maxScore: total,
          percentage,
        }).save();

        // 2. Initial Upsert
        await AssignmentStats.findOneAndUpdate(
          { userId },
          { $setOnInsert: { userId } },
          { upsert: true, new: true }
        );

        // 3. Compare Best Score
        const current = await AssignmentStats.findOne({ userId });
        const currentBest = current?.levels?.[difficulty]?.bestScore || 0;
        const newBest = percentage > currentBest ? percentage : currentBest;
        const newStatus = newBest >= 80 ? 'Completed' : (newBest > 0 ? 'In Progress' : 'Not Started');

        // 4. Atomic Update
        const updatedStats = await AssignmentStats.findOneAndUpdate(
          { userId },
          {
            $inc: { [`levels.${difficulty}.attemptsCount`]: 1 },
            $set: {
              [`levels.${difficulty}.latestScore`]: percentage,
              [`levels.${difficulty}.bestScore`]: newBest,
              [`levels.${difficulty}.status`]: newStatus,
            },
          },
          { new: true }
        );

        resultData.matrixUpdated = true;
        resultData.levelStats = updatedStats?.levels?.[difficulty];
        console.log(`✅ Exercise recorded for user ${userIdStr} | Level: ${difficulty} | Score: ${percentage}%`);

      } catch (matrixErr) {
        console.error("Matrix Update Error:", matrixErr.message);
        // Non-fatal error for the user's test flow
      }
    }

    res.json(resultData);

  } catch (error) {
    console.error("Evaluate Error:", error);
    res.status(500).json({ error: "Internal server error during evaluation." });
  }
});

// Since we removed JSON seeding, we just export an empty hook for backwards compatibility in server.js
router.seedQuestions = async () => {
  try {
    const fs = require("fs");
    const path = require("path");

    let allSourceQuestions = [];

    // 1. Load Advanced Questions (new_questions.json - UTF-16LE)
    const advPath = path.join(__dirname, "../new_questions.json");
    if (fs.existsSync(advPath)) {
      const rawAdv = fs.readFileSync(advPath, "utf16le");
      const cleanAdv = rawAdv.replace(/^\uFEFF/, "");
      const advQuestions = JSON.parse(cleanAdv);
      allSourceQuestions.push(...advQuestions.map(q => ({
        ...q,
        course: q.category || q.course,
        difficulty: q.difficulty || "Beginner"
      })));
    }

    // 2. Load Regular Questions (config/exercise.json - UTF-8)
    const regPath = path.join(__dirname, "../config/exercise.json");
    if (fs.existsSync(regPath)) {
      const regQuestions = JSON.parse(fs.readFileSync(regPath, "utf8"));
      allSourceQuestions.push(...regQuestions.map(q => ({
        ...q,
        course: q.category || q.course,
        difficulty: q.difficulty || "Beginner"
      })));
    }

    // Filter out any questions that are still missing a valid course name
    allSourceQuestions = allSourceQuestions.filter(q => typeof q.course === 'string' && q.course.trim().length > 0);

    if (allSourceQuestions.length === 0) {
      console.warn("No valid questions found in any source file for seeding.");
      return;
    }

    // 3. Identify which courses are missing ACTIVE questions in DB
    const existingActiveCourses = await Question.distinct("course", { isActive: true });
    const categoriesInSources = [...new Set(allSourceQuestions.map(q => q.course))];
    const missingCategories = categoriesInSources.filter(cat => cat && !existingActiveCourses.includes(cat));

    if (missingCategories.length === 0) {
      console.log("Database already has active questions for all known courses.");
      return;
    }

    console.log(`Found ${missingCategories.length} courses missing active questions: ${missingCategories.join(", ")}. Seeding now...`);

    // 4. Clean up any inactive ones for these categories to avoid versioning conflicts if re-seeding
    await Question.deleteMany({ course: { $in: missingCategories }, isActive: false });

    // 5. Prepare and Insert
    const prepared = allSourceQuestions
      .filter(q => missingCategories.includes(q.course))
      .map(q => ({
        course: q.course.trim(),
        difficulty: q.difficulty || "Beginner",
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
        topic: q.topic || "",
        isActive: true,
        version: 1
      }));

    if (prepared.length > 0) {
      console.log(`Inserting ${prepared.length} questions...`);
      // Chunking if too large
      const batchSize = 500;
      for (let i = 0; i < prepared.length; i += batchSize) {
        await Question.insertMany(prepared.slice(i, i + batchSize));
      }
      console.log(`✅ Successfully seeded questions.`);
    }

  } catch (err) {
    console.error("Seeding Error:", err.message);
  }
};

module.exports = router;
