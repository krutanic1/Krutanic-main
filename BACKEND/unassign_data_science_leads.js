const mongoose = require("mongoose");
const AdvLead = require("./models/AdvLead");
require("dotenv").config();

async function run() {
    try {
        await mongoose.connect(process.env.DB_NAME || "mongodb://localhost:27017/krutanic");
        console.log("Connected to MongoDB");

        // 1. Identify the domains that match Data Science / Data Analytics
        const dataDomains = [
            "Data Analytics", 
            "Data Analytics & Business Intelligence", 
            "Data Science", 
            "Data Science leads", 
            "Data Science new"
        ];

        // 2. Find the target leads (ones that are Fresh Lead and data science)
        // Since we just changed them to "Fresh Lead", we'll grab all "Fresh Lead" with these domains
        // to ensure they are properly unassigned.
        const query = {
            opted_domain: { $in: dataDomains },
            stage: "Fresh Lead"
        };

        const targetLeads = await AdvLead.find(query).select('_id');
        const leadIds = targetLeads.map(lead => lead._id);

        console.log(`Found ${leadIds.length} Data Science / Analytics Fresh leads to unassign.`);

        if (leadIds.length > 0) {
            // 3. Unset the owner fields
            const updateResult = await AdvLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    $unset: {
                        team_id: 1,
                        current_owner_id: 1,
                        current_owner_role: 1,
                        team_name: 1,
                        owner_id: 1,
                        owner_name: 1,
                        manager_id: 1,
                        leader_id: 1,
                        specialist_id: 1,
                        assigned_at: 1,
                        isLocked: 1,
                        lockedBy: 1,
                        lockTime: 1
                    }
                }
            );
            console.log(`Successfully unassigned ${updateResult.modifiedCount} leads.`);
        }

        console.log("Script execution completed.");
        process.exit(0);
    } catch (err) {
        console.error("Error running script:", err);
        process.exit(1);
    }
}

run();
