const express = require('express');
const JobApplication = require("../models/JobApplication");
const router = express.Router();
const User = require("../models/User");
const busboy = require("busboy");
const cloudinary = require("../middleware/cloudinary");

// POST route: Create a new job application
router.post("/jobapplications", async (req, res) => {
  try {
    const { userId, jobId, title, company } = req.body;

    if (!userId || !jobId || !title || !company) {
      return res.status(400).json({ error: "userId and jobId are required" });
    }
    const newJobApplication = new JobApplication({ userId, jobId, title, company });
    await newJobApplication.save();
    res.status(201).json({ message: "Job Applied successfully", application: newJobApplication });
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/jobapplications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Fetch applications matching the userId
    const applications = await JobApplication.find({ userId });
      // .populate("jobId", "title company")
      // .lean();
    if (!applications.length) {
      return res.status(404).json({ message: "No applications found for this user." });
    }
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put('/job-applications/:id', async (req, res) => {
  try {
      const { status } = req.body;
      const application = await JobApplication.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
      );
      if (!application) {
          return res.status(404).json({ message: 'Application not found' });
      }
      res.json(application);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

router.post("/job-resume-upload", (req, res) => {
  const bb = busboy({ headers: req.headers });
  let userId;
  bb.on("field", (name, val) => {
    if (name === "userId") userId = val;
  });

  bb.on("file", (fieldname, file, info) => {
    if (info.mimeType !== "application/pdf") {
      return res.status(400).json({ error: "Only PDFs are allowed" });
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "job resume", // Store in "job resume" folder
        public_id: `resume_${userId}_${Date.now()}`,
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Upload failed", details: error.message });
        }
        try {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { jobResume: result.secure_url }, // Save to jobResume field
            { new: true }
          );
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          } 
          res.json({ message: "Resume uploaded", jobResume: result.secure_url });
        } catch (dbError) {
          res.status(500).json({ error: "Database error", details: dbError.message });
        } 
      }
    );
    file.pipe(uploadStream);
  }); 
  bb.on("finish", () => {
    if (!userId) res.status(400).json({ error: "No userId provided" });
  });
  req.pipe(bb);
});

module.exports = router; 