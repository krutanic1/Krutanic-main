const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/UserAuth");
const CreateOperation = require("../models/CreateOperation");

const NewEnrollStudent = require("../models/NewStudentEnroll");
const AdvEnroll = require("../models/AdvEnroll");
const { sendEmail } = require("../controllers/emailController");
const { sendOfferLetter, sendNewOfferLetter } = require("../controllers/offerLetter")
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");
// const { ObjectId } = mongoose.Types;

//post to create a new operation account
router.post("/createoperation", verifyAnyAuth, async (req, res) => {
  const { fullname, email, password, languages } = req.body;
  try {
    const newoperation = new CreateOperation({
      fullname: fullname,
      email: email,
      password: password,
      languages: languages,
    });
    await newoperation
      .save()
      .then(() => {
        // ✅ Invalidate operations cache when new operation is created


        res.status(201).json(newoperation);
      })
      .catch((saveError) => {
        console.error("Error saving data:", saveError);
        res.status(400).json({ message: saveError.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all operation accounts (WITH CACHING)
router.get("/getoperation", verifyAnyAuth, async (req, res) => {
  const { operationId } = req.query;
  try {
    let operation;
    if (operationId) {
      // Don't cache individual lookups
      operation = await CreateOperation.findById(operationId);
      if (!operation) {
        return res
          .status(404)
          .json({ message: "Operation not found for the given userId" });
      }
    } else {
      // Direct DB query (No Cache)
      operation = await CreateOperation.find().sort({ _id: -1 }).lean();
    }
    res.status(200).json(operation);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching data",
        error: error.message,
      });
  }
});

// put request to edit the opertions details
router.put("/updateoperation/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, languages } = req.body;
    const updatedOperation = await CreateOperation.findByIdAndUpdate(
      id,
      { fullname, email, password, languages },
      { new: true }
    );
    if (!updatedOperation) {
      return res.status(404).json({ error: "Operation not found" });
    }
    res.status(200).json(updatedOperation);
  } catch (error) {
    res.status(400).json({ error: "Error updating operation" });
  }
});

// Toggle Online/Offline status
router.put("/toggleonlinestatus/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const operation = await CreateOperation.findById(id);
    if (!operation) {
      return res.status(404).json({ error: "Operation not found" });
    }
    operation.isOnline = !operation.isOnline;
    await operation.save();

    // Invalidate cache so updated list is fetched


    res.status(200).json({ message: "Status updated", isOnline: operation.isOnline });
  } catch (error) {
    res.status(500).json({ error: "Error updating status", details: error.message });
  }
});

//delete request to delete the operation account
router.delete("/deleteoperation/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOperation = await CreateOperation.findByIdAndDelete(id);
    if (!deletedOperation) {
      return res.status(404).json({ error: "Operation not found" });
    }
    res.status(200).json({ message: "Operation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting operation" });
  }
});

router.post("/operationsendotp", async (req, res) => {
  const { email } = req.body;
  try {
    const operation = await CreateOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "Operation user not found" });
    }

    const otp = crypto.randomInt(100000, 1000000);

    // Email message
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Krutanic</h1>
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px; color: #333;">Welcome back! ${operation.fullname},</p>
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

    // Save OTP in database and send email simultaneously
    operation.otp = otp;
    await Promise.all([
      operation.save(),
      sendEmail({
        email,
        subject: "Operation Login Credentials",
        message: emailMessage,
      }),
    ]);

    res.status(200).json({ message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
});

// Verify OTP and Login
router.post("/operationverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const operation = await CreateOperation.findOne({ email });
    if (!operation) {
      return res.status(404).json({ message: "Operation user not found" });
    }
    if (operation.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    operation.otp = null;
    await operation.save();
    const token = jwt.sign(
      { _id: operation._id, email: operation.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      _id: operation._id,
      operationName: operation.fullname,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
});

router.get("/OperationDashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to the dashboard!" });
});

//send course details and login details to user
//send course details and login details to user
router.post("/send-email", async (req, res) => {
  const {
    fullname,
    email,
    program,
    phone,
    counselor,
    domain,
    clearPaymentMonth,
    monthOpted,
    isAdvBookedPayment,
  } = req.body;
  const defaultPassword = "Krutanic@123";  let counselorEmail = "";
  if (counselor) {
    try {
      const counselorUser = await CreateOperation.findOne({ 
        fullname: { $regex: new RegExp("^" + counselor.trim() + "$", "i") } 
      });
      if (counselorUser) {
        counselorEmail = counselorUser.email;
      }
    } catch (err) {
      console.error("Error fetching counselor email:", err);
    }
  }

  const subject = `Welcome to Our ${program} Program`;
  const emailMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
        <h1 style="color: #ffffff; margin: 0;">Welcome to Krutanic</h1>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 16px; text-transform: capitalize; color: #333;">Dear ${fullname},</p>
        <p style="font-size: 14px; color: #555;">Thank you for joining us! Here are your details:</p>
        <ul style="font-size: 14px; color: #555; line-height: 1.5;">
          <li style="text-transform: capitalize;"><strong>Mode of Program:</strong> ${program}</li>
          <li style="text-transform: capitalize;"><strong>You have opted a:</strong> ${monthOpted} month</li>
          <li style="text-transform: capitalize;"><strong>You Have Opted for a Domain: </strong> ${domain}</li>
          <li style="text-transform: capitalize;"><strong>Clear Due Payment Date:</strong> ${clearPaymentMonth}</li>
          <li style="text-transform: capitalize;"><strong>Any Doubts? Talk to Your Counselor:</strong> <span style="text-transform: capitalize;">${counselor}</span>${counselorEmail ? ` (<a href="mailto:${counselorEmail}" style="color: #F15B29; text-decoration: none; text-transform: none;">${counselorEmail}</a>)` : ""}</li>
        </ul>
        <p style="font-size: 14px; color: #555;">Here are your login details:</p>
        <p style="font-size: 14px; color: #333;">Use your email (<strong>${email}</strong>) and the default password provided below to log in:</p>
        <p style="text-align: center; font-size: 18px; font-weight: bold; color: #4a90e2;">${defaultPassword}</p>
        <p style="font-size: 14px; color: #555;">
          <a href="https://www.krutanic.com/login" target="_blank" style="color: #F15B29; text-decoration: none; font-weight: bold;">Click here to log in</a>. 
          After logging in, please set a new password according to your preferences or official requirements.
        </p>
        <p>Note: Once you clear due amount then you'll get the access to your enrolled course.</p>
        <p style="font-size: 14px; color: #555;">If you need any further assistance, feel free to reach out at <a href="mailto:support@krutanic.com" style="color: #F15B29; text-decoration: none;">support@krutanic.com</a>.</p>
        <p style="font-size: 14px; color: #333;">Best regards,</p>
        <p style="font-size: 14px; color: #333; font-weight: bold;">Team Krutanic</p>
      </div>
      <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd; background-color: #f9f9f9;">
        <p>&copy; 2026 Krutanic. All Rights Reserved.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email,
      subject: subject,
      message: emailMessage,
    });
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email.", error: error.message });
  }
});

//store a value after send a login details
router.put("/mailsendedchange/:id", async (req, res) => {
  const { id } = req.params;
  const { mailSended, onboardingSended, userCreated } = req.body;
  // console.log("true",userCreated);
  const objectId = new mongoose.Types.ObjectId(id);
  try {
    let student = await NewEnrollStudent.findById({ _id: objectId });
    if (!student) {
      student = await AdvEnroll.findById({ _id: objectId });
    }
    // console.log("found", student);
    if (!student) {
      return res.status(404).send({ message: "Student not found." });
    }
    if (mailSended !== undefined) {
      student.mailSended = mailSended;
    }
    if (onboardingSended !== undefined) {
      student.onboardingSended = onboardingSended;
    }
    if (userCreated !== undefined) {
      student.userCreated = userCreated;
    }
    await student.save();
    res
      .status(200)
      .send({ message: "Student record updated successfully!", student });
  } catch (error) {
    console.error("Error updating student record:", error);
    res.status(500).send({ message: "Failed to update student record." });
  }
});

/*
// if in case operation login with email and password
router.post("/checkoperation", async (req, res) => {
  const { email, password } = req.body;
  try {
    const operation = await CreateOperation.findOne({ email });
    if (!operation) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password !== operation.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: operation._id, email: operation.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ token, _id: operation._id, operationName: operation.fullname });
  } catch (err) {
    console.error("Error during login", err);
    res.status(500).json({ message: "Server error" });
  }
});
*/

// ----------------------------------------------------
router.post("/sendedOnboardingMail", async (req, res) => {
  const { email, domain: reqDomain, program: reqProgram } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  let student;
  let isAdvanceProgram = false;

  const isMentorshipReq = 
    (reqProgram && typeof reqProgram === "string" && /mentorship|mentor|internship|intern|register/i.test(reqProgram)) || 
    (reqDomain && typeof reqDomain === "string" && /mentorship|mentor|internship|intern/i.test(reqDomain));

  try {
    if (isMentorshipReq) {
      student = await NewEnrollStudent.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });
      isAdvanceProgram = false;
      if (!student) {
        student = await AdvEnroll.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });
        if (student) {
          isAdvanceProgram = true;
        }
      }
    } else {
      student = await AdvEnroll.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });
      isAdvanceProgram = true;
      if (!student) {
        student = await NewEnrollStudent.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });
        if (student) {
          isAdvanceProgram = false;
        }
      }
    }
  } catch (err) {
    console.error("Error fetching student details for onboarding:", err);
  }

  if (!student) {
    return res.status(404).json({ message: "Student record not found." });
  }

  // Retrieve all details directly from the verified database record
  const fullname = student.fullname;
  const domain = student.domain;
  const monthOpted = student.monthOpted;
  const programPrice = student.programPrice;
  const paidAmount = student.paidAmount;

  const price = Number(programPrice) || 0;
  const paid = Number(paidAmount) || 0;
  const pendingAmount = price - paid;
  const formattedPendingAmount = pendingAmount.toLocaleString('en-IN');

  let emailMessage;

  if (!isAdvanceProgram) {
    emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif;">Welcome to Krutanic</h1>
        </div>
        <div style="padding: 20px; line-height: 1.6;">
          <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Dear ${fullname},</p>
          <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Warm greetings from Krutanic! We're excited to have you on board for our ${domain}, commencing on the 5th of ${monthOpted}. Your journey with us promises to be an enriching experience.</p>
          <p style="font-size: 14px; color: #555; margin-bottom: 15px;">To ensure a seamless start, we kindly request you to login an LMS (Learning Management System) account by visiting <a href="https://www.krutanic.com" style="color: #F15B29; text-decoration: none; font-weight: bold;">krutanic.com</a> and selecting the "Login" option. Doing this promptly will help prevent any delays when the program begins. Training sessions will be available on the start date.</p>
          <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Should you have any questions or need assistance, please don't hesitate to contact us via email at <a href="mailto:support@krutanic.com" style="color: #0066cc; text-decoration: none;">support@krutanic.com</a>. We're here to support you every step of the way.</p>
          <p style="font-size: 14px; color: #555; margin-bottom: 15px;">If you wish to clear your pending amount of <strong>₹${formattedPendingAmount}</strong> in advance to expedite your participation in projects, please use the link below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="https://smartpay.easebuzz.in/219610/Krutanic" target="_blank" style="background-color: #F15B29; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Pay Now</a>
          </p>
          <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Once again, welcome to Krutanic's ${domain}. We look forward to embarking on this learning journey with you!</p>
          <p style="font-size: 14px; color: #333; margin: 15px 0 0 0;">Warm regards,</p>
          <p style="font-size: 14px; color: #333; font-weight: bold; margin: 4px 0 0 0;">Team Krutanic</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd; background-color: #f9f9f9;">
          <p style="margin: 0;">&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;
  } else {
    emailMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
        <!-- Brand Header -->
        <div style="background: linear-gradient(135deg, #F15B29 0%, #ff7a45 100%); color: #ffffff; text-align: center; padding: 35px 20px;">
          <img src="https://lh3.googleusercontent.com/d/1rmHu8ecr-JC3kzrM3Q5QALubDAXwVmx6" alt="Krutanic Logo" style="max-height: 55px; margin-bottom: 15px; display: inline-block; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #ffffff;">Welcome to Krutanic</h1>
          <p style="margin: 10px 0 0 0; font-size: 15px; opacity: 0.9; color: #ffffff;">Empowering Professionals with Industry-Relevant Skills</p>
        </div>

        <!-- Main Body Content -->
        <div style="padding: 40px 30px; color: #333333;">
          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 25px;">
            Dear <strong>${fullname}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f; margin-bottom: 20px;">
            <strong>Congratulations and welcome to Krutanic.</strong>
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #4f4f4f; margin-bottom: 25px;">
            We are delighted to have you join our <strong>${domain}</strong>, commencing on <strong>5th of ${monthOpted}</strong>. As a professional committed to continuous growth, you have taken an important step toward building future-ready skills and accelerating your career.
          </p>

          <p style="font-size: 15px; line-height: 1.6; color: #666666; font-style: italic; background-color: #fafafa; border-left: 4px solid #F15B29; padding: 15px; border-radius: 4px; margin-bottom: 35px;">
            "At Krutanic, we go beyond training. Our mission is to help learners gain practical expertise, build industry-ready portfolios, and create meaningful career opportunities through mentorship, projects, and dedicated career support."
          </p>

          <!-- Learning Journey Includes -->
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 18px; color: #F15B29; border-bottom: 2px solid #F15B29; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0;">Your Learning Journey Includes</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 15px; color: #4f4f4f; line-height: 1.8;">
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Live Instructor-Led Training</strong> - Immersive interactive classroom sessions.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Industry Projects & Case Studies</strong> - Real-world practical problems to solve.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Capstone Implementation Experience</strong> - A master portfolio project to showcase.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>1:1 Career Guidance & Mentorship</strong> - Direct guidance from experienced industry leaders.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Resume & LinkedIn Profile Optimization</strong> - Tailored professional branding.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Mock Interviews & Interview Preparation</strong> - Build confidence with simulating exercises.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Placement Assistance & Partner Support</strong> - Connecting you to high-growth opportunities.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Multiple Interview Opportunities*</strong> - Guaranteed access to hiring drives.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✓</td>
                <td style="padding: 6px 0; vertical-align: top;"><strong>Industry-Recognized Certification</strong> - Authenticate your newly acquired expertise.</td>
              </tr>
            </table>
          </div>

          <!-- Career Support Includes -->
          <div style="margin-bottom: 35px;">
            <h2 style="font-size: 18px; color: #F15B29; border-bottom: 2px solid #F15B29; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0;">Career Support Includes</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #4f4f4f; line-height: 1.8;">
              <!-- Item 1 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">🚀</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Dedicated Placement Assistance</strong></td>
              </tr>
              <!-- Item 2 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">🤝</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Hiring Partner Network Access</strong></td>
              </tr>
              <!-- Item 3 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">📝</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Resume & LinkedIn Optimization</strong></td>
              </tr>
              <!-- Item 4 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">🗣️</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Mock Interviews & Preparation</strong></td>
              </tr>
              <!-- Item 5 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">👤</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Personalized Career Coaching</strong></td>
              </tr>
              <!-- Item 6 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">🎯</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Multiple Interview Opportunities</strong></td>
              </tr>
              <!-- Item 7 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">👥</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Industry Mentorship</strong></td>
              </tr>
              <!-- Item 8 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">📅</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Exclusive Hiring Drives & Events</strong></td>
              </tr>
              <!-- Item 9 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">💼</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>End-to-End Job Search Support</strong></td>
              </tr>
              <!-- Item 10 -->
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 28px; font-size: 16px; line-height: 1;">✨</td>
                <td style="padding: 6px 0; vertical-align: top; padding-left: 6px;"><strong>Professional Branding Guidance</strong></td>
              </tr>
            </table>
            <p style="font-size: 13px; color: #666666; margin-top: 15px; margin-bottom: 0; line-height: 1.5; font-style: italic;">
              Our goal is to help every eligible learner secure multiple interview opportunities through our structured career support framework and hiring network.
            </p>
          </div>

          <!-- Activation Section -->
          <div style="margin-bottom: 35px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f7f7f7; padding: 15px 20px; border-bottom: 1px solid #e0e0e0;">
              <h3 style="margin: 0; font-size: 16px; color: #333333; text-transform: uppercase;">🔐 Activate Your Learning Portal</h3>
            </div>
            <div style="padding: 20px; font-size: 15px; line-height: 1.6; color: #4f4f4f; background-color: #ffffff;">
              <p style="margin-top: 0; margin-bottom: 15px;">To ensure a seamless onboarding experience, please activate your LMS account at the earliest.</p>
              <div style="background-color: #f5f5f5; border-radius: 6px; padding: 15px; font-family: Courier, monospace; font-size: 14px; border: 1px dashed #cccccc; margin-bottom: 15px;">
                <strong style="color: #F15B29;">Login Process:</strong><br>
                • Visit <a href="https://www.krutanic.com" target="_blank" style="color: #F15B29; text-decoration: none; font-weight: bold;">www.krutanic.com</a><br>
                • Click on <strong>Login</strong><br>
                • Access your LMS using your registered credentials
              </div>
              <p style="margin: 0; font-size: 14px; color: #666666;">Your learning dashboard will provide access to all training sessions, recordings, projects, assignments, assessments, and career resources.</p>
            </div>
          </div>

          <!-- Payment Section -->
          <div style="margin-bottom: 35px; border: 1px dashed #d32f2f; background-color: #fff9f9; padding: 25px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0; font-size: 18px; color: #d32f2f; text-transform: uppercase; letter-spacing: 0.5px;">💰 Pending Fee Payment (If Applicable)</h3>
            <p style="font-size: 15px; color: #333333; line-height: 1.6; margin-bottom: 15px;">
              Our records indicate an outstanding balance of <strong style="font-size: 18px; color: #d32f2f;">₹${formattedPendingAmount}</strong>.
            </p>
            <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 20px;">
              To ensure uninterrupted access to all program benefits, including projects, mentorship, certifications, and career services, we request you to complete the pending payment before the program commencement date.
            </p>
            <a href="https://smartpay.easebuzz.in/219610/Krutanic" target="_blank" style="background-color: #d32f2f; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(211, 47, 47, 0.25);">Pay Outstanding Fee</a>
          </div>

          <!-- Support Section -->
          <div style="text-align: center; border-top: 1px solid #eeeeee; padding-top: 30px;">
            <h3 style="font-size: 16px; color: #333333; margin-top: 0; margin-bottom: 10px;">Dedicated Learner Success Support</h3>
            <p style="font-size: 15px; color: #555555; margin: 0 0 25px 0;">
              Should you require any assistance, our team is always available to support you.<br>
              📧 <a href="mailto:support@krutanic.com" style="color: #F15B29; text-decoration: none; font-weight: bold;">support@krutanic.com</a>
            </p>
          </div>

          <!-- Closing -->
          <div style="font-size: 15px; line-height: 1.6; color: #4f4f4f; border-top: 1px solid #eeeeee; padding-top: 25px;">
            <p style="margin-bottom: 20px;">Thank you for choosing Krutanic as your learning partner.</p>
            <p style="margin-bottom: 20px;">We look forward to helping you build in-demand skills, gain real-world experience, and unlock exciting career opportunities.</p>
            <p style="margin-bottom: 25px;">Welcome to a community of ambitious professionals committed to continuous learning, career advancement, and long-term success.</p>
            
            <p style="margin: 0; font-size: 14px; color: #333333;">Warm Regards,</p>
            <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold; color: #F15B29;">Team Krutanic</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #777777; font-style: italic;">Empowering Professionals with Industry-Relevant Skills and Career Opportunities.</p>
          </div>
        </div>

        <!-- Disclaimer Footer -->
        <div style="background-color: #f7f7f7; border-top: 1px solid #e0e0e0; padding: 25px 30px; font-size: 12px; color: #777777; line-height: 1.6; text-align: justify;">
          <p style="margin: 0 0 10px 0;"><strong>*Disclaimer:</strong> Interview opportunities are subject to successful completion of program requirements, learner participation, eligibility criteria, profile quality, market conditions, and hiring partner requirements.</p>
          <p style="margin: 0; text-align: center;">&copy; 2026 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;
  }
  try {
    await sendEmail({
      email,
      subject: `Welcome to Krutanic's ${domain} Program!`,
      message: emailMessage,
    });
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Error sending email.", error: error.message });
  }
});

router.post("/sendofferletter", async (req, res) => {
  try {
    const { id, fullname, domain, email, date, duration, start, end, location } = req.body;

    const formattedName = fullname
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    let isMentorship = false;
    const isMentorshipStudent = await NewEnrollStudent.findById(id);
    if (isMentorshipStudent) {
      isMentorship = true;
    }

    await sendOfferLetter({ email, fullname: formattedName, date, start, end, domain, duration, location, isMentorship });

    let updatedStudent = await NewEnrollStudent.findByIdAndUpdate(id, { offerlettersended: true }, { new: true });

    if (!updatedStudent) {
      updatedStudent = await AdvEnroll.findByIdAndUpdate(id, { offerlettersended: true }, { new: true });
    }

    if (!updatedStudent) { return res.status(404).json({ error: "Student not found" }); }

    res.status(200).json({ message: "Offer letter sent and status updated.!" });

  } catch (error) {
    console.error("Error in /sendofferletter:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/sendnewofferletter", async (req, res) => {
  try {
    const { 
      id, fullname, domain, email, 
      originalProgramFee, finalPayableFee, enrollmentAmountReceived, remainingBalance, 
      emiDuration, monthlyEmi, firstInstallmentAmount, firstInstallmentDate, 
      secondInstallmentAmount, secondInstallmentDate 
    } = req.body;

    const formattedName = fullname
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    await sendNewOfferLetter({ 
      email, fullname: formattedName, domain, 
      originalProgramFee, finalPayableFee, enrollmentAmountReceived, remainingBalance, 
      emiDuration, monthlyEmi, firstInstallmentAmount, firstInstallmentDate, 
      secondInstallmentAmount, secondInstallmentDate 
    });

    let updatedStudent = await NewEnrollStudent.findByIdAndUpdate(id, { newOfferLetterSended: true }, { new: true });

    if (!updatedStudent) {
      updatedStudent = await AdvEnroll.findByIdAndUpdate(id, { newOfferLetterSended: true }, { new: true });
    }

    if (!updatedStudent) { return res.status(404).json({ error: "Student not found" }); }

    res.status(200).json({ message: "New offer letter sent and status updated!" });

  } catch (error) {
    console.error("Error in /sendnewofferletter:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//put request to asign a target to all bda accounts
router.post("/assigntargettooperation/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { target } = req.body;
    const updatedOperation = await CreateOperation.findByIdAndUpdate(
      id,
      { $push: { target } },
      { new: true }
    );
    if (!updatedOperation) {
      return res.status(404).json({ error: "operation not found" });
    }
    res.status(200).json(updatedOperation);
  } catch (error) {
    res.status(400).json({ error: "Error updating operation %" });
  }
});


module.exports = router;
