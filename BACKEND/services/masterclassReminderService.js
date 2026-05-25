const cron = require("node-cron");
const MasterClass = require("../models/MasterClass");
const { sendMasterclassDailyReminder, sendMasterclassTodayReminder } = require("../utils/emailService");

// Helper to delay between emails (e.g., to prevent rate limiting)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeMasterclassReminderScheduler = () => {
    // Run every day at 8:00 AM IST
    cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily Masterclass Reminder Cron Job...");
    try {
        // Fetch all upcoming masterclasses
        const upcomingClasses = await MasterClass.find({ status: "upcoming" });
        if (!upcomingClasses || upcomingClasses.length === 0) {
            console.log("No upcoming masterclasses found for reminders.");
            return;
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        let totalRemindersSent = 0;

        for (const masterclass of upcomingClasses) {
            // Check if the masterclass is scheduled for today
            const classDate = new Date(masterclass.start);
            const isToday = classDate >= todayStart && classDate <= todayEnd;

            const applicants = masterclass.applications || [];
            
            if (applicants.length === 0) continue;

            console.log(`Processing ${applicants.length} reminders for Masterclass: ${masterclass.title}`);

            for (const applicant of applicants) {
                // Determine which email to send
                if (isToday) {
                    await sendMasterclassTodayReminder(
                        applicant.email,
                        applicant.name,
                        masterclass.title,
                        masterclass.start,
                        masterclass.link // The live meeting link
                    );
                } else {
                    await sendMasterclassDailyReminder(
                        applicant.email,
                        applicant.name,
                        masterclass.title,
                        masterclass.start,
                        masterclass.link // Or whatsapp link depending on usage
                    );
                }

                totalRemindersSent++;
                // 200ms delay to gracefully send emails (approx 5 per second max)
                await sleep(200); 
            }
        }

        console.log(`✅ Daily Masterclass Reminders complete. Sent ${totalRemindersSent} emails.`);
    } catch (error) {
        console.error("❌ Error running Masterclass Reminder Cron Job:", error);
    }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    console.log("✅ Masterclass Reminder Scheduler initialized (Daily, 8AM IST)");
};

module.exports = {
    initializeMasterclassReminderScheduler
};
