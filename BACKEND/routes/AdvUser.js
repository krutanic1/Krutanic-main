const express = require("express");
const router = express.Router();
const AdvUser = require("../models/AdvUser");

// GET all users
router.get("/get-all-users", async (req, res) => {
    try {
        const users = await AdvUser.find().populate("manager_id", "name");
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Create a new user
router.post("/create-user", async (req, res) => {
    try {
        const newUser = new AdvUser(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
