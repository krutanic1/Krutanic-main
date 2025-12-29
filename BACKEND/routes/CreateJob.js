const express = require("express");
const CreateJob = require("../models/CreateJob");
const JobApplication = require("../models/JobApplication"); // Job Application model
// const User = require("../models/User"); 
const router = express.Router();

// 1. CREATE a job
router.post("/jobs", async (req, res) => {
    try {
        const { title,company,description,expiryDate } = req.body;
        const newJob = new CreateJob({ title, company, description, expiryDate });
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ error: "Failed to create job", details: error.message });
    }
});

// 2. READ all jobs
router.get("/jobs", async (req, res) => {
    try {
        const jobs = await CreateJob.find().sort({ createdAt: -1 }); 
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch jobs", details: error.message });
    }
});

// 3. UPDATE a job by ID
router.put("/jobs/:id", async (req, res) => {
    try {
        const { title,company,description,expiryDate } = req.body;
        const updatedJob = await CreateJob.findByIdAndUpdate(
            req.params.id,
            { title,company, description, expiryDate },
            { new: true, runValidators: true }
        );
        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ error: "Failed to update job", details: error.message });
    }
});


// 4. DELETE a job by ID
router.delete("/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await CreateJob.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete job", details: error.message });
    }
});

// Route to fetch all jobs with their applications and user details
router.get("/jobs-with-applications", async (req, res) => {
    try {
      // Fetch all jobs
      const jobs = await CreateJob.find().sort({ createdAt: -1 }).lean();
  
      // For each job, fetch its applications and user details
      const jobsWithDetails = await Promise.all(
        jobs.map(async (job) => {
          // Fetch job applications for the current job
          const applications = await JobApplication.find({ jobId: job._id })
            .populate("userId", "fullname email phone status jobResume") // Populate user details
            .lean();
  
          return {
            ...job,
            applications, // Include applications with user details
          };
        })
      );
  
      // Respond with jobs and their applications
      res.status(200).json(jobsWithDetails);
    } catch (error) {
      console.error("Error fetching jobs with applications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//   fetch job with userId
  router.get("/jobs-with-users", async (req, res) => {
    try {
        // Fetch all jobs
        const jobs = await CreateJob.find().sort({ createdAt: -1 }).lean();

        // For each job, fetch its applications
        const jobsWithDetails = await Promise.all(
            jobs.map(async (job) => {
                // Fetch job applications for the current job
                const applications = await JobApplication.find({ jobId: job._id })
                    .select("userId") // Only select the userId field
                    .lean();

                // Map applications to only include userId
                const userIds = applications.map(application => application.userId);

                return {
                    ...job,
                    applications: userIds, // Include only userIds
                };
            })
        );

        // Respond with jobs and their applications
        res.status(200).json(jobsWithDetails);
    } catch (error) {
        console.error("Error fetching jobs with applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;