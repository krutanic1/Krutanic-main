const express = require("express");
const AddEvent = require("../models/AddEvent");
const EventRegistration = require("../models/EventRegistration");
const EventApplication = require("../models/EventApplication");
const router = express.Router();
const crypto = require('crypto'); 
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendEmail } = require("../controllers/emailController");
const cloudinary = require("../middleware/cloudinary.js")

// add a new event
router.post("/addevent", async (req, res) => {
    try {
        const addevent = new AddEvent(req.body);
        await addevent.save();
        res.status(201).json(addevent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all Events
router.get("/allevents", async (req, res) => {
    try {
      const addEvent = await AddEvent.find().sort({ _id: -1 });
      res.status(200).json(addEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Update a events
router.put("/allevents/:id", async (req, res) => {
    try {
      const addEvent = await AddEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!addEvent) return res.status(404).json({ error: "Event not found" });
      res.status(200).json(addEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Delete a events
router.delete("/allevents/:id", async (req, res) => {
  try {
    const addEvent = await AddEvent.findByIdAndDelete(req.params.id);
    if (!addEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//update status
router.put("/updatestatus/:id", async (req, res) => {
  console.log(req.body , "status");
  console.log(req.params.id, "id")
  try {
    const addEvent = await AddEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!addEvent) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(addEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//push question to event
router.put("/addquestions/:id", async (req, res) => {
  try {
    const event = await AddEvent.findById(req.params.id);
    if (req.body.question) {
      const newQuestion = {
        question: req.body.question,
        option1: req.body.option1, 
        option2: req.body.option2, 
        option3:req.body.option3,
        option4: req.body.option4, 
        answer: req.body.answer ,
        coin:req.body.coin
      }; 
    event.questions.push(newQuestion);}
    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

//delete event question
router.delete("/allevents/:eventId/questions/:questionId", async (req, res) => {
  try {
    const { eventId, questionId } = req.params;
    const event = await AddEvent.findById(eventId);
    // if (!event) return res.status(404).json({ error: "Event not found" });
    const questionIndex = event.questions.findIndex(q => q._id.toString() === questionId);
    // if (questionIndex === -1) return res.status(404).json({ error: "Question not found" });
    event.questions.splice(questionIndex, 1);
    await event.save();
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//edit event question
router.put('/addquestions/:eventId/questions/:questionId', async (req, res) => {
  const { eventId, questionId } = req.params;
  const { question, option1, option2, option3, option4, answer } = req.body;
  try {
    const event = await AddEvent.findById(eventId);
    if (!event) {return res.status(404).json({ message: 'Event not found' });}
    const existingQuestion =  event.questions.find(q => q._id.toString() === questionId);
    if (!existingQuestion) {return res.status(404).json({ message: 'Question not found' });}
    existingQuestion.question = question;
    existingQuestion.option1 = option1;
    existingQuestion.option2 = option2;
    existingQuestion.option3 = option3;
    existingQuestion.option4 = option4;
    existingQuestion.answer = answer;
    existingQuestion.coin = coin;
    await event.save();
    res.status(200).json({ message: 'Question updated successfully', question: existingQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question', error });
  }
});

// --------------------------------------------------------------------------------------------------------------------

// Event Registration
router.post("/eventregistration", async (req, res) => {
    try {
       const existingUser = await EventRegistration.findOne({ email:req.body.email });
          if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
          }
        const eventregister = new EventRegistration(req.body);
        await eventregister.save();
        res.status(201).json(eventregister);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// Get all Event Registrations - take it 
router.get("/alleventregistrations", async (req, res) => {
  try {
    const alleventregistrations = await EventRegistration.aggregate([
      {
        $lookup: {
          from: "eventapplications", // EventApplication collection ka naam
          localField: "_id",
          foreignField: "userId",
          as: "applicationData",
        },
      },
      {
        $lookup: {
          from: "addevents", // AddEvent collection ka naam
          localField: "applicationData.eventId",
          foreignField: "_id",
          as: "eventData",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          email: { $first: "$email" },
          profilePhoto: { $first: "$profilePhoto" },
          collegeName: { $first: "$collegeName" },
          yearofstudy: { $first: "$yearofstudy" },
          collegeEmailId: { $first: "$collegeEmailId" },
          applicationData: { $first: "$applicationData" }, // Ensure all applications are stored as an array
          eventData: { $first: "$eventData" },
        },
      },
      {
        $addFields: {
          totalCoins: { $sum: "$applicationData.coin" } // applicationData ke andar coin ka sum
        },
      },
      {
        $sort: { _id: -1 }, // Latest records sabse upar aayenge
      },
    ]);

    res.status(200).json(alleventregistrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// send otp route
router.post("/eventsendotp",async (req, res) => {
  const { email } = req.body;
  try {
    const eventuser = await EventRegistration.findOne({ email });
    if (!eventuser) {
      return res.status(404).json({ message: "User not found enter a valid email" });
    }
     const otp = crypto.randomInt(100000, 1000000);
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins expiration
       const  EmailMessage = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
        <h1>Krutanic Talent Hunt</h1>
    </div>
    <div style="padding: 20px; text-align: center;">
        <p style="font-size: 16px; color: #333;">Hello, Join us for an exciting Talent Hunt event! Below are your participation details:</p>
        <p style="font-size: 14px; color: #555;">Your participation verification code (for event access) is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4a90e2; margin: 10px 0;">${otp}</p>
        <p style="font-size: 14px; color: #555;">This code is valid for <strong>10 minutes</strong>. Please keep it safe and don't share it with others.</p>
    </div>
    <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
        <p>If you didn’t register for the Talent Hunt event, please ignore this email or contact our support team.</p>
        <p>&copy; 2024 Krutanic Talent Hunt. All Rights Reserved.</p>
    </div>
</div>

    `;
    eventuser.otp = otp;
    eventuser.otpExpires = otpExpires;
    await Promise.all([
      eventuser.save(),
      sendEmail({email ,  subject: "Your OTP for Login", message: EmailMessage}),
    ]);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// verfiy otp route
router.post("/eventverifyotp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await EventRegistration.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      if (user.status === "inactive") {
        return res.status(403).json({ message: "Your account is inactive. Please contact support." });
      }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, _id: user._id, email: user.email , name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});


//apply on event
router.post("/eventapplications", async (req, res) => {
  try {
    const { userId, eventId , remarks} = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: "userId and eventId are required" });
    }

    const existingApplication = await EventApplication.findOne({ userId, eventId });

    if (existingApplication) {
      return res.status(400).json({ error: "User has already applied for this event" });
    }

    const newEventApplication = new EventApplication({ userId, eventId , remarks});
    await newEventApplication.save();
    res.status(201).json({ message: "Job Applied successfully", application: newEventApplication });
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all Event applits
router.get("/eventapplications", async (req, res) => {
  try {
    const appliedEvent = await EventApplication.find()
    .populate('userId','id')
    .populate('eventId', 'id');
  
  const response = appliedEvent.map(event => {
    const { createdAt, updatedAt, ...rest } = event.toObject();
    return rest;
  });

  res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all the event with applied user data 
router.get("/events-with-applications", async (req, res) => {
  try {
    const eventWithEnrolls = await AddEvent.aggregate([
      {
        $lookup: {
          from: "eventapplications", // Collection name should match your MongoDB collection
          localField: "_id", // Local field in AddEvent (the event's _id)
          foreignField: "eventId", // Foreign field in EventApplication (the eventId)
          as: "enrollments", // Alias for the array of applications
        },
      },
      {
        $addFields: {
          enrollments: {
            $cond: {
              if: { $isArray: "$enrollments" }, // Check if enrollments is an array
              then: "$enrollments", // If it's already an array, keep it
              else: [ "$enrollments" ], // Otherwise, wrap it in an array
            },
          },
        },
      },
      {
        $addFields: {
          enrollments: {
            $map: {
              input: "$enrollments", // Map over the enrollments array
              as: "enrollment",
              // in: "$$enrollment.userId", // Extract only the userId from each enrollment
              in: {
                userId: "$$enrollment.userId", // Extract userId
                coin: "$$enrollment.coin",     // Extract coin 
                remarks: "$$enrollment.remarks", // Extract remarks
              },
            },
          },
        },
      },
      {
        $addFields: {
          userIds: {
            $map: {
              input: "$enrollments",
              as: "enrollment",
              in: "$$enrollment.userId",  // Extract only userId
            },
          },
        },
      },
      {
        $lookup: {
          from: "eventregistrations", // Join with the eventregistrations collection to get user details
          localField: "userIds", // Local field (enrollments array of userIds)
          foreignField: "_id", // Foreign field (userId in eventregistrations)
          as: "userDetails", // Store matched user details in 'userDetails'
        },
      }, 
      {
        $project: {
          title: 1,
          start: 1,
          status: 1,
          type: 1,
          questions: 1,
          enrollments: 1, // Final result will have an array of userIds
          userDetails: {
            name: 1,
            phone: 1,
            email: 1,
            collegeName: 1,
            collegeEmailId: 1, // Only include relevant user fields
            _id:1,
          },
        },
      },
    ]);

    res.status(200).json(eventWithEnrolls);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


//store the score as coin 
router.post("/finalscore", async (req, res) => {
  try {
    const { userId, eventId, coin , remarks } = req.body;
    if (!userId || !eventId || coin === undefined) {
      return res.status(400).json({ error: "userId, eventId, and coin are required" });
    }
    const updatedApplication = await EventApplication.findOneAndUpdate(
      { userId, eventId },
      { $set: { coin}},
      { new: true, upsert: false }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Event application not found" });
    }

    res.status(200).json({ message: "Score updated successfully", application: updatedApplication });
  } catch (error) {
    console.error("Error creating event application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//from admin side
router.post("/redeemcoins", async (req, res) => {
  try {
    const { userId, coin, remarks} = req.body;
    const newEventApplication = new EventApplication({ userId, coin, remarks});
    await newEventApplication.save();
    res.status(201).json({ message: "Job Applied successfully", application: newEventApplication });
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//add profile image 
router.post("/upload-profile-photo/:id", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "profile_photos",
    });
    // Update user profile with image URL
    const user = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: result.url },
      { new: true }
    );
    res.json({ message: "Profile photo uploaded", user });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
});


module.exports = router;