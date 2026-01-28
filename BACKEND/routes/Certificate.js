const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const mongoose = require("mongoose");

// Create a new certificate entry
router.post("/applycertificate", async (req, res) => {
    const { name, email, domain } = req.body;
    // Format name to Title Case
    const formattedName = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    // console.log(name,email,domain);
    try {
        const existingCertificate = await Certificate.findOne({ email });
        if (existingCertificate) {
            return res.status(400).json({ error: "Certificate already exists for this email" });
        }
        // Auto-generate certificate details
        // const date = new Date();
        // const startdate = date.toISOString();
        // const finalOutput = `${domain} on ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;

        // Cloudinary URL generation matching frontend logic
        // const url = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(formattedName)}/fl_layer_apply,y_20/co_rgb:000000,l_text:times%20new%20roman_25_bold_normal_left:${encodeURIComponent(finalOutput)}/fl_layer_apply,y_225/training_certificate_demo_vknkst`;

        const newCertificate = new Certificate({
            name: formattedName,
            email,
            domain,
            // delivered: true,
            // startdate: startdate,
            // url: url
        });

        await newCertificate.save();
        res.status(201).json({ message: "Certificate added and issued successfully", certificate: newCertificate });

    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getcertificate", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email parameter is required" });
        }
        // ✅ FIX #3: Use .lean() for read-only operations (faster parsing)
        const certificate = await Certificate.findOne({ email: email }).lean();
        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found" });
        }
        res.json(certificate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Verify certificate by ID
router.get("/verify-certificate/:id", async (req, res) => {
    try {
        const { id } = req.params;

        let query = { delivered: true };

        if (mongoose.Types.ObjectId.isValid(id)) {
            query.$or = [{ _id: id }, { enrolment: id }];
        } else {
            query.enrolment = id;
        }

        const certificate = await Certificate.findOne(query, { name: 1, domain: 1, url: 1 });

        if (!certificate) {
            return res.status(404).json({ error: "Certificate not found." });
        }

        res.json(certificate);

    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});



// Proxy route to bypass CORS for downloads
router.get("/download-proxy", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }

        const axios = require('axios'); // Require here or top level
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        // Set headers to force download
        res.setHeader('Content-Disposition', 'attachment; filename="certificate.jpg"');
        res.setHeader('Content-Type', response.headers['content-type']);

        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Download Error:", error.message);
        res.status(500).json({ error: "Failed to download file" });
    }
});

module.exports = router;