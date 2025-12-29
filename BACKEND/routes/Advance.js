const express = require("express");
const router = express.Router();
const Advance = require("../models/Advance");


router.get("/advancequeries", async (req, res) => {
  try {
      queries = await Advance.find().sort({ _id: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching data", error: error.message });
  }
});

router.post("/advance/register", async (req, res) => {
  const { name, email, phone, currentRole, experience, goal, goalOther, domain, domainOther ,interestedDomain ,reason } = req.body;
  // console.log(req.body);
  try {
    const newRegistration = new Advance({
      name,
      email,
      phone,
      currentRole,
      experience,
      goal,
      goalOther: goal === "Other" ? goalOther : undefined,
      domain,
      domainOther: domain === "Other" ? domainOther : undefined,
      interestedDomain : interestedDomain,
      reason:reason
    });
    await newRegistration.save();
    res.status(201).json({ message: "Registration successfull!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//put request to update the mentorship data in admin
router.put("/advancequery/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { action } = req.body;
    const query = await Advance.findById(id);
    if (query) {
      if (action === "Shared") {
        query.action = "Shared";
      }
      if (action === "Not Interested") {
        query.action = "Not Interested";
      }
      if (action === "Already Paid") {
        query.action = "Already Paid";
      }
      if (action === "Unseen") {
        query.action = "Unseen";
      }
      await query.save();

      res.status(200).json({ message: "Query updated successfully" });
      } else {
      res.status(404).json({ message: "Query not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating data", error: error.message });
  }
});

module.exports = router;
