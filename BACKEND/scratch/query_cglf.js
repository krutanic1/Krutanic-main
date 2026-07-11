const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/db");
const NewEnroll = require("../models/NewStudentEnroll");

async function run() {
    try {
        await connectDB();
        
        // Exact criteria matching the dashboard's /getmonthlyrevenue
        const exactMatches = await NewEnroll.find({
            lead: "CGFL", // Case sensitive, exact match
            createdAt: {
                $gte: new Date("2026-06-01T00:00:00.000Z"),
                $lt: new Date("2026-07-01T00:00:00.000Z")
            }
        }).select("fullname phone whatsAppNumber email lead monthOpted createdAt");

        let csvContent = "Name,Phone,Email,Lead,MonthOpted,CreatedAt\n";
        exactMatches.forEach(e => {
            const phone = e.phone || e.whatsAppNumber || "";
            csvContent += `"${e.fullname || ''}","${phone}","${e.email || ''}","${e.lead || ''}","${e.monthOpted || ''}","${e.createdAt ? e.createdAt.toISOString() : ''}"\n`;
        });

        const outputPath = "C:\\Users\\tarun\\OneDrive\\Desktop\\dashboard_exact_130_cgfl.csv";
        fs.writeFileSync(outputPath, csvContent);
        console.log(`Saved ${exactMatches.length} EXACT MATCH records directly to ${outputPath}`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

run();
