const express = require("express");
const router = express.Router();
const { sendEmail } = require("../controllers/emailController");
const jwt = require("jsonwebtoken");
const CreateBDA = require("../models/CreateBDA");
const TeamName = require("../models/TeamName");
const TransactionId = require("../models/AddTransactionId");
const crypto = require('crypto');

//post to create a new bda account
router.post("/createbda", async (req, res) => {
  const { fullname, email, team, teams, designation, password } = req.body;
  try {
    const newbda = new CreateBDA({
      fullname: fullname,
      email: email,
      team: team,
      teams: teams || [], // Store teams array for managers
      designation: designation,
      password: password
    });
    await newbda.save();
    res.status(201).json(newbda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all bda accounts
router.get("/getbda", async (req, res) => {
  const {bdaId} = req.query;
  try {
    let bda;
    if(bdaId){
       bda = await CreateBDA.findById(bdaId);
       if (!bda) {
        return res.status(404).json({ message: "Bda not found for the given bdaId" });
      }
    }else{
       bda = await CreateBDA.find().sort({ _id: -1 });
    }
   
    res.status(200).json(bda);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// put request to edit the bda details
router.put("/updatebda/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password , team, teams, designation } = req.body;
    const updatedbda = await CreateBDA.findByIdAndUpdate(
      id,
      { fullname, email, password , team, teams: teams || [], designation },
      { new: true }
    );
    if (!updatedbda) {
      return res.status(404).json({ error: "bda not found" });
    }
    res.status(200).json(updatedbda);
  } catch (error) {
    res.status(400).json({ error: "Error updating bda" });
  }
});

//put request to update the bda status inactive 
router.put("/updatestatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedstatus = await CreateBDA.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedstatus) {
      return res.status(404).json({ error: "bda not found" });
    }
    res.status(200).json(updatedstatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating bda" });
  }
});

//put request to asign a target to all bda accounts
router.post("/assigntarget/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;
    const updatedBDA = await CreateBDA.findByIdAndUpdate(
      id,
      { $push: { target } },
      { new: true }
    );
    if (!updatedBDA) {
      return res.status(404).json({ error: "BDA not found" });
    }
    res.status(200).json(updatedBDA);
  } catch (error) {
    res.status(400).json({ error: "Error updating bda" });
  }
});

//delete request to delete the bda account
router.delete("/deletebda/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedbda = await CreateBDA.findByIdAndDelete(id);
    if (!deletedbda) {
      return res.status(404).json({ error: "bda not found" });
    }
    res.status(200).json({ message: "bda deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting bda" });
  }
});

//delete request to delete the target 
router.put("/deletetarget/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;
    const updatedBDA = await CreateBDA.findByIdAndUpdate(
      id,
      { $pull: { target: target } },
      { new: true }
      );
    if (!updatedBDA) {
      return res.status(404).json({ error: "BDA not found" });
      }
      res.status(200).json(updatedBDA);
    } catch (error) {
      res.status(400).json({ error: "Error deleting target" });
      }
  });


//Send OTP to BDA Email
router.post("/bdasendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const bda = await CreateBDA.findOne({ email });
    if (!bda) {
      return res.status(404).json({ message: "BDA not found" });
    }
     
     if (bda.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }

    const otp = crypto.randomInt(100000, 1000000);

      // Send OTP via Email
         const emailMessage = `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
              <h1>Krutanic</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
              <p style="font-size: 16px; color: #333;">Welcome back! Agent,</p>
              <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
              <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
              <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          </div>
          <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
              <p>If you didn’t request this OTP, please ignore this email or contact our IT team.</p>
              <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
          </div>
      </div>
      `;
     

    bda.otp = otp; 
    await Promise.all([
        bda.save(),
        sendEmail({ email , subject : "Bda Login Credentials" ,  message: emailMessage }),
    ]);
    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login
router.post("/bdaverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const bda = await CreateBDA.findOne({ email });
    if (!bda) {
      return res.status(404).json({ message: "BDA not found" });
    }
    if (bda.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

     if (bda.status === "Inactive") {
      return res.status(403).json({ message: "Access denied. Your account is inactive." });
    }

    // Clear OTP after successful login
    bda.otp = null;
    await bda.save();

    const token = jwt.sign(
      { id: bda._id, email: bda.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      bdaId: bda._id,
      bdaName: bda.fullname,
      message: "Login successful!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

router.post("/checkbdaauth", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the bda by email
    const bda = await CreateBDA.findOne({ email });
    if (!bda) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== bda.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: bda._id, email: bda.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, bdaId: bda._id, bdaName: bda.fullname });
  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ message: "Server error" });
  }
});

//post request to add transaction id
router.post("/addtransactionid", async (req, res) => {
  const {transactionId , fullname , counselor , option} = req.body;
  try {
    const AddTransactionId = new TransactionId({
      transactionId,
      fullname,
      counselor,
      lead: option,
    });
    await AddTransactionId.save();
    res.status(201).json(AddTransactionId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// GET request to retrieve all transaction ids
router.get("/gettransactionid", async (req, res) => {
  try {
    const transactionId = await TransactionId.find().sort({ _id: -1 });
    res.status(200).json(transactionId);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}
);

// GET request to retrieve all transaction ids with name 
router.get("/gettransactionwithname", async (req, res) => {
  try {
   const transactions = await TransactionId.find();
   const transactionList = transactions.map(item => item.transactionId);
   const counselorList = transactions.map(item => item.counselor);
   const lead = transactions.map(item => item.lead);
   
   res.status(200).json({
     transaction: transactionList,
     counselor: counselorList,
     lead: lead
   });
 }
 catch (error) {
   res.status(400).json({ message: error.message });
  }
}
);

//add team name from create bda page 
router.post("/addteamname", async (req, res) => {
  const { teamname } = req.body;
  try {
    const newTeam = new TeamName({
      teamname,
    });
    await newTeam.save();
    res.status(200).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all team names
router.get("/getteamname", async (req, res) => {
  try {
    const teamname = await TeamName.find();
    res.status(200).json(teamname);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// post request to assign target to team
router.post("/targetassigntoteam", async (req, res) => {
  try {
    const { teamId, targetValue, payments, currentMonth } = req.body;

    // if (!teamId || !targetValue || !payments || !currentMonth) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }

    const newTarget = {
      currentMonth,
      targetValue,
      payments,
    };

    const updatedTeam = await TeamName.findByIdAndUpdate(
      teamId,
      { $push: { target: newTarget } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error updating team target:", error);
    res.status(500).json({ error: "Server error while assigning target" });
  }
});

//delete team last index target 
router.delete("/delete-target", async (req, res) => {
  try {
    const { teamId, targetId } = req.body;

    if (!teamId || !targetId) {
      return res.status(400).json({ error: "Missing teamId or targetId" });
    }

    const updatedTeam = await TeamName.findByIdAndUpdate(
      teamId,
      { $pull: { target: { _id: targetId } } }, // precise pull
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error deleting target:", error);
    res.status(500).json({ error: "Internal server error while deleting target" });
  }
});

//put request to update the bda access
router.put("/updateaccess/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {Access } = req.body;
    // console.log(id , Access);
    const updatedstatus = await CreateBDA.findByIdAndUpdate(
      id,
      { $set: { Access } },
      { new: true }
    );
    if (!updatedstatus) {
      return res.status(404).json({ error: "bda account not found" });
    }
    res.status(200).json(updatedstatus);
  } catch (error) {
    res.status(400).json({ error: "Error updating bda account" });
  }
});

module.exports = router;