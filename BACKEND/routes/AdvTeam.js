const express = require("express");
const router = express.Router();
const AdvTeam = require("../models/AdvTeam");

// GET all teams
router.get("/get-all-teams", async (req, res) => {
    try {
        const teams = await AdvTeam.find()
            .populate("manager_id", "name")
            .populate("leaders", "name")
            .populate("specialists", "name");
        res.status(200).json(teams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Create a new team
router.post("/create-team", async (req, res) => {
    try {
        const newTeam = new AdvTeam(req.body);
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Add leader or specialist to team
router.put("/add-member/:id", async (req, res) => {
    const { userId, role } = req.body;
    try {
        const update = role === 'leader'
            ? { $addToSet: { leaders: userId } }
            : { $addToSet: { specialists: userId } };

        const team = await AdvTeam.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate("manager_id", "name")
            .populate("leaders", "name")
            .populate("specialists", "name");

        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
