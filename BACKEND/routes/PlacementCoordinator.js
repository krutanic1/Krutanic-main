// const express = require("express");
// const router = express.Router();
// const { sendEmail } = require("../controllers/emailController"); // Assuming same email controller
// const PlacementCoordinator = require("../models/PlacementCoordinator"); // Model for PlacementCoordinator
// const JobApplication = require("../models/JobApplication"); // Model for JobApplication
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const crypto = require("crypto");

// // POST request to create a new Placement Coordinator account
// router.post("/createcoordinator", async (req, res) => {
//   const { email, fullname, password } = req.body;
//   try {
//     const newCoordinator = new PlacementCoordinator({
//       email: email,
//       fullname: fullname,
//       password: password,
//     });
//     await newCoordinator.save()
//       .then(() => {
//         res.status(201).json(newCoordinator);
//       })
//       .catch((saveError) => {
//         console.error("Error saving data:", saveError);
//         res.status(400).json({ message: saveError.message });
//       });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // GET request to retrieve all Placement Coordinator accounts
// router.get("/getcoordinators", async (req, res) => {
//   try {
//       const coordinators = await PlacementCoordinator.find().select("-password").sort({ _id: -1 });   
//     res.status(200).json(coordinators);
//   } catch (error) {
//     res.status(500).json({ message: "An error occurred while fetching data", error: error.message });
//   }
// });

// // PUT request to edit Placement Coordinator details
// router.put("/updatecoordinator/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { fullname, email, password } = req.body;
//     const updatedCoordinator = await PlacementCoordinator.findByIdAndUpdate(
//       id,
//       { fullname, email, password },
//       { new: true }
//     );
//     if (!updatedCoordinator) {
//       return res.status(404).json({ error: "Coordinator not found" });
//     }
//     res.status(200).json(updatedCoordinator);
//   } catch (error) {
//     res.status(400).json({ error: "Error updating coordinator" });
//   }
// });

// // DELETE request to delete the Placement Coordinator account
// router.delete("/deletecoordinator/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedCoordinator = await PlacementCoordinator.findByIdAndDelete(id);
//     if (!deletedCoordinator) {
//       return res.status(404).json({ error: "Coordinator not found" });
//     }
//     res.status(200).json({ message: "Coordinator deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting coordinator" });
//   }
// });

// // POST request to send OTP to Placement Coordinator Email
// router.post("/coordinatorsendotp", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const coordinator = await PlacementCoordinator.findOne({ email });
//     if (!coordinator) {
//       return res.status(404).json({ message: "Coordinator user not found" });
//     }
//     const otp = crypto.randomInt(100000, 1000000);

//     const emailMessage = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
//         <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
//           <h1>Krutanic Solutions</h1>
//         </div>
//         <div style="padding: 20px; text-align: center;">
//           <p style="font-size: 16px; color: #333;">Welcome back! Placement Coordinator,</p>
//           <p style="font-size: 14px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
//           <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
//           <p style="font-size: 14px; color: #555;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
//         </div>
//         <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
//           <p>If you didn’t request this OTP, please ignore this email or contact our IT team.</p>
//           <p>&copy; 2024 Krutanic Solution. All Rights Reserved.</p>
//         </div>
//       </div>
//     `;
    
//     coordinator.otp = otp;

//     await Promise.all([
//       coordinator.save(),
//       sendEmail({ email, subject: "Your OTP for Login", message: emailMessage }),
//     ]);
//     res.status(200).json({ message: "OTP sent to your email!" });
//   } catch (error) {
//     console.error("Failed to send OTP:", error);
//     res.status(500).json({ message: "Failed to send OTP", error: error.message });
//   }
// });

// // POST request to verify OTP and login
// router.post("/coordinatorverifyotp", async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     const coordinator = await PlacementCoordinator.findOne({ email });
//     if (!coordinator) {
//       return res.status(404).json({ message: "Coordinator user not found" });
//     }
//     if (coordinator.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }
//     coordinator.otp = null;
//     await coordinator.save();
//     const token = jwt.sign(
//       { _id: coordinator._id, email: coordinator.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     res.status(200).json({
//       token,
//       _id: coordinator._id,
//       email: coordinator.email,
//       message: "Login successful!",
//     });
//   } catch (error) {
//     console.error("Failed to verify OTP:", error);
//     res.status(500).json({ message: "OTP verification failed", error: error.message });
//   }
// });

// // In your routes file
// router.put('/job-applications/:id', async (req, res) => {
//     try {
//         const { status } = req.body;
//         const application = await JobApplication.findByIdAndUpdate(
//             req.params.id,
//             { status },
//             { new: true }
//         );
//         if (!application) {
//             return res.status(404).json({ message: 'Application not found' });
//         }
//         res.json(application);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
//   });


// module.exports = router;
