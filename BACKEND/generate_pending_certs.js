require("dotenv").config({ path: __dirname + '/.env' });
const mongoose = require("mongoose");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Certificate = require("./models/Certificate");
const NewEnroll = require("./models/NewStudentEnroll");

const MONGODB_URI = process.env.DB_NAME; 

const generatePendingCerts = async () => {
    try {
        console.log("Connecting to MongoDB...", MONGODB_URI);
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB.");

        const pendingCerts = await Certificate.find({ delivered: false });
        console.log(`Found ${pendingCerts.length} pending certificates.`);

        if (pendingCerts.length === 0) {
            console.log("No pending certificates to process.");
            process.exit(0);
        }

        const S3_BUCKET = process.env.VITE_S3_BUCKET;
        const REGION = process.env.VITE_REGION;
        const ACCESS_KEY = process.env.VITE_ACCESS_KEY;
        const SECRET_KEY = process.env.VITE_SECRET_KEY;

        if (!S3_BUCKET || !REGION || !ACCESS_KEY || !SECRET_KEY) {
            console.error("Missing S3 credentials in environment variables.");
            process.exit(1);
        }

        const s3 = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: ACCESS_KEY,
                secretAccessKey: SECRET_KEY,
            },
        });

        for (const cert of pendingCerts) {
            try {
                console.log(`Processing certificate for: ${cert.email}`);
                
                const formattedName = cert.name
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');

                // 1. Get dates from NewEnroll
                const enrollDoc = await NewEnroll.findOne({ email: cert.email.toLowerCase().trim() });
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

                // 2. Generate unique enrolment ID
                const uniqueId = cert.enrolment || `KR-${Math.floor(10000 + Math.random() * 90000)}`;

                // 3. Format Date for image
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

                // 4. Generate Cloudinary URL (Adobe)
                const certificateurl = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(formattedName)}/fl_layer_apply,y_-50/co_rgb:000000,l_text:times%20new%20roman_30_bold_normal_left:${encodeURIComponent(certificatedate)}/fl_layer_apply,y_-220/co_rgb:000000,l_text:times%20new%20roman_33_bold_normal_left:${encodeURIComponent(cert.domain)}/fl_layer_apply,g_west,x_712,y_193/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(uniqueId)}/fl_layer_apply,g_south_west,x_465,y_28/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(cert._id.toString())}/fl_layer_apply,g_south_west,x_900,y_28/adobe_ovkftr`;

                // 5. Upload to S3
                const response = await axios.get(certificateurl, { responseType: 'arraybuffer' });
                const fileName = `${cert._id.toString()}`;
                const params = {
                    Bucket: S3_BUCKET,
                    Key: fileName,
                    Body: response.data,
                    ContentType: "image/png",
                };
                
                await s3.send(new PutObjectCommand(params));
                const finalUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;

                // 6. Update DB
                cert.name = formattedName;
                cert.startdate = startdateStr;
                cert.enddate = enddateStr;
                cert.enrolment = uniqueId;
                cert.company = 'adobe';
                cert.url = finalUrl;
                cert.delivered = true;
                
                await cert.save();
                console.log(`✅ Successfully processed: ${cert.email}`);
            } catch (err) {
                console.error(`❌ Failed to process ${cert.email}:`, err.message);
            }
        }
        
        console.log("Finished processing pending certificates.");
        process.exit(0);

    } catch (error) {
        console.error("Script failed:", error);
        process.exit(1);
    }
};

generatePendingCerts();
