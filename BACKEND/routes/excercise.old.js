const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const NewEnroll = require("../models/NewStudentEnroll");
const Result = require("../models/result");

const exerciseFilePath = path.join(__dirname, "../config/exercise.json");

// Fetch exercise questions (unchanged)
router.get("/exercise-questions", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "User email is required." });
    }

    const userEnrollment = await NewEnroll.findOne({ email });
    if (!userEnrollment) {
      return res.status(404).json({ error: "User enrollment not found." });
    }

    const enrolledCategory =
      userEnrollment.domain || userEnrollment.operationName;
    if (!enrolledCategory) {
      return res.status(404).json({ error: "No enrolled category found." });
    }

    fs.readFile(exerciseFilePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading exercise.json:", err);
        return res.status(500).json({ error: "Failed to load questions." });
      }

      try {
        const allQuestions = JSON.parse(data);
        const filteredQuestions = allQuestions.filter(
          (q) => q.category.toLowerCase() === enrolledCategory.toLowerCase()
        );

        if (filteredQuestions.length === 0) {
          return res
            .status(404)
            .json({ error: "No questions found for this category." });
        }

        const shuffledQuestions = filteredQuestions.sort(
          () => 0.5 - Math.random()
        );
        const selectedQuestions = shuffledQuestions.slice(0, 8);

        res.json(selectedQuestions);
      } catch (parseError) {
        console.error("Error parsing exercise.json:", parseError);
        return res.status(500).json({ error: "Failed to parse questions." });
      }
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Evaluate answers, compare with previous result, and update database if improved
router.post("/exercise-evaluate", async (req, res) => {
  const { questions, answers, email } = req.body;

  if (!Array.isArray(questions) || !Array.isArray(answers) || !email) {
    return res
      .status(400)
      .json({ error: "Invalid input format or missing email." });
  }

  try {
    // Evaluate current answers
    let correct = 0;
    const feedbackDetails = [];

    questions.forEach((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) {
        correct++;
      }
      feedbackDetails.push({
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: answers[index] || "No answer",
        isCorrect,
      });
    });

    const currentResult = {
      total: questions.length,
      correct,
      incorrect: questions.length - correct,
      details: feedbackDetails,
    };

    // Fetch previous result from the database
    const previousResult = await Result.findOne({ email });

    // Calculate percentages
    const currentScorePercentage =
      (currentResult.correct / currentResult.total) * 100;
    const previousScorePercentage = previousResult
      ? (previousResult.correctAnswers / previousResult.totalQuestions) * 100
      : 0;

    let response;
    if (!previousResult || currentScorePercentage > previousScorePercentage) {
      // If no previous result exists or current result is better, update the database
      await Result.findOneAndUpdate(
        { email }, // Find by email
        {
          totalQuestions: currentResult.total,
          correctAnswers: currentResult.correct,
          incorrectAnswers: currentResult.incorrect,
          testDate: new Date(),
        },
        { upsert: true, new: true } // Create if not found, return updated document
      );

      response = {
        ...currentResult,
        message: previousResult
          ? "Great job! Your score has improved."
          : "First attempt recorded!",
        isImproved: true,
      };
    } else {
      // Current result is worse or equal, return previous result
      response = {
        total: previousResult.totalQuestions,
        correct: previousResult.correctAnswers,
        incorrect: previousResult.incorrectAnswers,
        message: "Your previous result was better. Keep practicing!",
        isImproved: false,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("Error evaluating answers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Fetch past results
router.get("/user-results", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    const results = await Result.find({ email }); // Returns array with one item due to unique email
    res.json(results);
  } catch (error) {
    console.error("Error fetching past results:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
