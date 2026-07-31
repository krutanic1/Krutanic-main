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
    
    try {
        const existingCertificate = await Certificate.findOne({ email });
        if (existingCertificate) {
            return res.status(400).json({ error: "Certificate already exists for this email" });
        }

        // Auto-generate certificate details
        const NewEnroll = require("../models/NewStudentEnroll");
        const axios = require("axios");
        const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

        const enrollDoc = await NewEnroll.findOne({ email: email.toLowerCase().trim() });
        let startdateStr = new Date().toISOString();
        if (enrollDoc) {
            const monthValue = enrollDoc.internshipstartsmonth || enrollDoc.monthOpted;
            if (monthValue) {
                const monthMap = { jan:1, january:1, feb:2, february:2, mar:3, march:3, apr:4, april:4, may:5, jun:6, june:6, jul:7, july:7, aug:8, august:8, sep:9, sept:9, september:9, oct:10, october:10, nov:11, november:11, dec:12, december:12 };
                const normalizedMonth = String(monthValue).trim().toLowerCase();
                const monthToken = normalizedMonth.split(/[^a-z0-9]+/)[0];
                const monthNumber = monthMap[monthToken] || monthMap[monthToken.slice(0, 3)] || Number(monthToken);
                
                if (monthNumber >= 1 && monthNumber <= 12) {
                    const yearFromMonthValue = normalizedMonth.match(/\b(\d{4})\b/)?.[1];
                    const yearSource = yearFromMonthValue || enrollDoc.internshipstartsyear || enrollDoc.clearPaymentMonth || enrollDoc.createdAt;
                    const parsedYear = yearSource ? new Date(yearSource).getFullYear() : new Date().getFullYear();
                    const year = Number.isNaN(parsedYear) ? new Date().getFullYear() : parsedYear;
                    startdateStr = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
                }
            }
        }

        const startDateObj = new Date(startdateStr);
        const endDateObj = new Date(startDateObj);
        endDateObj.setMonth(endDateObj.getMonth() + 2);
        const enddateStr = endDateObj.toISOString();

        // Unique enrolment ID: KR- + 5 random digits
        const uniqueId = `KR-${Math.floor(10000 + Math.random() * 90000)}`;

        const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return "th";
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };
        const formatDate = (dateString) => {
            const dateObj = new Date(dateString);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('en-US', { month: 'long' });
            const year = dateObj.getFullYear();
            return `${month} ${day}${getOrdinalSuffix(day)}%2C ${year}`;
        };

        const certificatedate = formatDate(startdateStr) + " to " + formatDate(enddateStr);
        
        const newCertificate = new Certificate({
            name: formattedName,
            email,
            domain,
            enrolment: uniqueId,
            startdate: startdateStr,
            enddate: enddateStr,
            company: 'adobe',
            delivered: true
        });
        
        // Cloudinary URL for adobe
        const certificateurl = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(formattedName)}/fl_layer_apply,y_-50/co_rgb:000000,l_text:times%20new%20roman_30_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,y_-220/co_rgb:000000,l_text:times%20new%20roman_33_bold_normal_left:${encodeURIComponent(domain)}/fl_layer_apply,g_west,x_712,y_193/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(uniqueId)}/fl_layer_apply,g_south_west,x_465,y_28/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(newCertificate._id.toString())}/fl_layer_apply,g_south_west,x_900,y_28/adobe_ovkftr`;

        let finalUrl = certificateurl;

        try {
            const S3_BUCKET = process.env.VITE_S3_BUCKET;
            const REGION = process.env.VITE_REGION;
            const ACCESS_KEY = process.env.VITE_ACCESS_KEY;
            const SECRET_KEY = process.env.VITE_SECRET_KEY;
            
            if (S3_BUCKET && REGION && ACCESS_KEY && SECRET_KEY) {
                const response = await axios.get(certificateurl, { responseType: 'arraybuffer' });
                const s3 = new S3Client({
                    region: REGION,
                    credentials: {
                        accessKeyId: ACCESS_KEY,
                        secretAccessKey: SECRET_KEY,
                    },
                });
                
                const fileName = `${newCertificate._id.toString()}`;
                const params = {
                    Bucket: S3_BUCKET,
                    Key: fileName,
                    Body: response.data,
                    ContentType: "image/png",
                };
                
                await s3.send(new PutObjectCommand(params));
                finalUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
            }
        } catch (s3Error) {
            console.error("S3 Upload Error:", s3Error);
        }

        newCertificate.url = finalUrl;
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