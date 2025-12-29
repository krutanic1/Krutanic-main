const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const NewEnroll = require("../models/NewStudentEnroll");
require("dotenv").config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const sessions = {};
// Start session
router.post("/start-session", (req, res) => {
  const sessionId = Date.now().toString();
  sessions[sessionId] = { questions: [], answers: [], feedback: [] };
  res.json({ sessionId });
});
// Get domain 
router.get("/get-domain", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required." });
  try {
    const user = await NewEnroll.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ domain: user.domain });
  } catch (error) {
    console.error("Error fetching domain:", error.message || error);
    res.status(500).json({ error: "Failed to fetch domain." });
  }
})
// Generate question using Generative AI (ensures no repeats)
router.get("/questions", async (req, res) => {
  const { sessionId, category } = req.query;
  if (!sessionId || !category)
    return res.status(400).json({ error: "Session ID and category required." });
  try {
    const previousQuestions = sessions[sessionId]?.questions || [];
    const prompt = `Generate a very simple, beginner-level interview question on a basic topic in the ${category} domain. Ensure it is different from these previous questions: ${previousQuestions.join(", ") || "none"}.`;
    const result = await model.generateContent(prompt);
    const question = result.response.text().trim();
    sessions[sessionId].questions.push(question);
  //   console.log("Generated question:", question); // Debug log
    res.json({ question });
  } catch (error) {
    console.error("Error generating question:", error.message || error);
    res.status(500).json({ error: "Failed to generate question." });
  }
});
// Evaluate answers using Generative AI
router.post("/evaluate", async (req, res) => {
  const { sessionId, answer } = req.body;
  if (!sessionId || !answer)
    return res.status(400).json({ error: "Session ID and answer required." });
  const lastQuestion = sessions[sessionId].questions.slice(-1)[0];
  if (!lastQuestion)
    return res.status(400).json({ error: "No question to evaluate." });
  try {
    const evalPrompt = `Question: ${lastQuestion}\nUser Response: ${answer}\nEvaluate the response on a scale of 1-10 with short feedback:`;
    const evalResult = await model.generateContent(evalPrompt);
    const evaluation = evalResult.response.text();
    const score = parseInt(evaluation.match(/(\d+)/)?.[0] || 0);
    let nextAction;
    if (score >= 7) {
      nextAction = "Next question will be generated.";
    } else {
      const clarifyPrompt = `Generate a simple clarification question for: "${lastQuestion}" based on "${answer}".`;
      const clarifyResult = await model.generateContent(clarifyPrompt);
      nextAction = clarifyResult.response.text();
    }
    sessions[sessionId].answers.push(answer);
    sessions[sessionId].feedback.push({ evaluation });
    res.json({
      responseText: answer,
      evaluation,
      nextAction,
    });
  } catch (error) {
    console.error("Error evaluating answer:", error.message || error);
    res.status(500).json({ error: "Failed to evaluate response." });
  }
});
// Fetch session details
router.get("/session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  if (!sessions[sessionId])
    return res.status(404).json({ error: "Session not found." });
  res.json(sessions[sessionId]);
});
module.exports = router;