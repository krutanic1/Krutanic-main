const express = require("express");
const router = express.Router();
const feedback = require("../models/feedback");

router.post("/post", (req, res) => {
    const { userId, userEmail, feedback: feedbackText } = req.body;
    const newFeedback = new feedback({ userId, userEmail, feedback: [feedbackText] });
    newFeedback.save().then(data => res.json({ message: "Feedback saved successfully", data })).catch(err => res.status(500).json({ message: "Something went wrong", error: err.message }));
})

router.get("/get", (req, res) => {
    
    feedback.find().then(data => res.json(data)).catch(err => res.status(500).json({ message: "Something went wrong", error: err.message }));
    
    
})



module.exports = router;
