const mongoose = require("mongoose");
const path = require("path");

// Workspace root
const workspaceRoot = "c:\\Users\\tarun\\OneDrive\\Desktop\\Krutanic-main-1";

// Load .env
require("dotenv").config({ path: path.join(workspaceRoot, "BACKEND", ".env") });

// Import model using absolute path
const AdvLead = require(path.join(workspaceRoot, "BACKEND", "models", "AdvLead.js"));

async function findDuplicates() {
    try {
        const uri = process.env.DB_NAME;
        if (!uri) {
            console.error("DB_NAME (MONGODB_URI) not found in BACKEND/.env");
            return;
        }

        await mongoose.connect(uri);
        console.log("Connected to MongoDB");

        const leads = await AdvLead.find();
        console.log(`Checking ${leads.length} leads...`);

        const emailMap = {};
        const phoneMap = {};
        const duplicates = [];

        leads.forEach(lead => {
            const normalizedPhone = lead.phone_number ? lead.phone_number.toString().replace(/\D/g, '') : null;
            const normalizedEmail = lead.email ? lead.email.toString().toLowerCase().trim() : null;

            if (normalizedEmail) {
                if (emailMap[normalizedEmail]) {
                    duplicates.push({ 
                        type: "email", 
                        value: normalizedEmail, 
                        firstId: emailMap[normalizedEmail], 
                        secondId: lead._id,
                        firstPhone: leads.find(l => l._id.toString() === emailMap[normalizedEmail].toString())?.phone_number,
                        secondPhone: lead.phone_number
                    });
                } else {
                    emailMap[normalizedEmail] = lead._id;
                }
            }

            if (normalizedPhone) {
                if (phoneMap[normalizedPhone]) {
                    duplicates.push({ 
                        type: "phone", 
                        value: normalizedPhone, 
                        firstId: phoneMap[normalizedPhone], 
                        secondId: lead._id,
                        firstEmail: leads.find(l => l._id.toString() === phoneMap[normalizedPhone].toString())?.email,
                        secondEmail: lead.email
                    });
                } else {
                    phoneMap[normalizedPhone] = lead._id;
                }
            }
        });

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} duplicate pairs:`);
            console.table(duplicates);
        } else {
            console.log("No duplicates found with the new normalization rules.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

findDuplicates();
