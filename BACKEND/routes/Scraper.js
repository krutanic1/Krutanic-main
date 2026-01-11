const express = require("express");
const axios = require("axios");
const router = express.Router();

// Define the Python service URL
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:8001";
const PYTHON_API_KEY = process.env.PYTHON_SERVICE_API_KEY || process.env.PYTHON_API_KEY || "dev-key-123";

// Route to proxy job search requests to the Python microservice
router.post("/api/jobs/search", async (req, res) => {
    try {
        console.log("🔍 Received job search request:", req.body);

        // Forward the request to the Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/scrape-jobs`, req.body, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": PYTHON_API_KEY
            }
        });

        console.log(`✅ Python service responded with ${response.data.total} jobs`);

        // Transform keys from snake_case to camelCase for frontend
        const jobs = (response.data.jobs || []).map(job => ({
            jobTitle: job.job_title,
            company: job.company,
            platform: job.platform,
            jobUrl: job.job_url,
            postedDate: job.posted_date,
            employmentType: job.employment_type,
            location: job.location,
            remoteStatus: job.remote_status,
            descriptionSnippet: job.description_snippet,
            salary: job.salary
        }));

        // Return the data from the Python service
        res.json({
            jobs: jobs,
            total: response.data.total,
            platforms_scraped: response.data.platforms_scraped
        });
    } catch (error) {
        console.error("❌ Error forwarding to Python service:", error.message);

        // Handle errors from the Python service
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        // Handle network or other errors
        res.status(500).json({
            error: "Failed to connect to job search service",
            details: error.message
        });
    }
});

module.exports = router;
