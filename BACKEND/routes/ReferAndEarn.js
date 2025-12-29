const express = require("express");
const router = express.Router();
const ReferAndEarn = require("../models/ReferAndEarn");

//post request to send a refer and earn request
router.post("/referandearn", async (req, res) => {
  const { name, phone, friendName, friendPhone, friendCollege, course } = req.body;
  try {
    const newReferAndEarn = new ReferAndEarn({
      name : name.trim(),
      phone : phone.trim(),
      friendName : friendName.trim(),
      friendPhone : friendPhone.trim(),
      friendCollege : friendCollege.trim(),
      course : course.trim(),
    });
    await newReferAndEarn.save();
    res
      .status(201)
      .json({ message: "Refer and Earn request created successfully" });
  } catch (error) {
    console.error("Error creating Refer and Earn request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get request to fetch all refer and earn requests
router.get("/referandearn", async (req, res) => {
  try {
    const referAndEarnRequests = await ReferAndEarn.find(); 
    res.status(200).json({
      success: true,
      data: referAndEarnRequests,
      });
  } catch (error) {
    console.error("Error fetching Refer and Earn requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
