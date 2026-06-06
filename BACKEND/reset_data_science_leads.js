const mongoose = require("mongoose");
const AdvLead = require("./models/AdvLead");
const AdvCallActivity = require("./models/AdvCallActivity");
const AdvFollowup = require("./models/AdvFollowup");
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

        // 2. Find the target leads
        const query = {
            opted_domain: { $in: dataDomains },
            stage: { $in: ["Closed Lost", "Attempting Contact"] }
        };

        const targetLeads = await AdvLead.find(query).select('_id');
        const leadIds = targetLeads.map(lead => lead._id);

        console.log(`Found ${leadIds.length} leads matching the criteria.`);

        if (leadIds.length > 0) {
            // 3. Reset the leads to Fresh State
            const updateResult = await AdvLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    $set: {
                        status: "fresh",
                        stage: "Fresh Lead",
                        disposition: "New Lead",
                        attempt_count: 0
                    },
                    $unset: {
                        last_contacted_at: 1,
                        next_followup_at: 1,
                        last_note: 1,
                        demo_date: 1,
                        expected_payment_date: 1,
                        last_outcome: 1,
                        last_interaction_at: 1
                    }
                }
            );
            console.log(`Updated ${updateResult.modifiedCount} leads to Fresh State.`);

            // 4. Remove all call logs
            const deleteLogsResult = await AdvCallActivity.deleteMany({ leadId: { $in: leadIds } });
            console.log(`Deleted ${deleteLogsResult.deletedCount} call logs from AdvCallActivity.`);

            // 5. Remove any pending follow-ups associated with these leads
            const deleteFollowupsResult = await AdvFollowup.deleteMany({ leadId: { $in: leadIds } });
            console.log(`Deleted ${deleteFollowupsResult.deletedCount} follow-ups from AdvFollowup.`);
        }

        console.log("Script execution completed.");
        process.exit(0);
    } catch (err) {
        console.error("Error running script:", err);
        process.exit(1);
    }
}

run();
