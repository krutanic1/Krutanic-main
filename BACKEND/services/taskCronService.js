const cron = require("node-cron");
const AdvTask = require("../models/AdvTask");
const AdvUser = require("../models/AdvUser");

const initializeTaskCron = () => {
    // Run every 5 minutes to check for upcoming and overdue tasks
    cron.schedule("*/5 * * * *", async () => {
        try {
            const now = new Date();
            const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);

            // Fetch pending tasks
            const pendingTasks = await AdvTask.find({ status: { $in: ["Pending", "In Progress"] } });

            for (const task of pendingTasks) {
                const dueDateTime = new Date(task.due_date);
                if (task.due_time) {
                    const [hrs, mins] = task.due_time.split(":");
                    dueDateTime.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);
                }

                // Reminder: 30 mins before
                if (dueDateTime > now && dueDateTime <= thirtyMinsLater && !task.reminder_30m_sent) {
                    await AdvTask.updateOne({ _id: task._id }, { $set: { reminder_30m_sent: true } }, { strict: false });
                }

                // Reminder: At due time (within the last 5 mins)
                const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
                if (dueDateTime <= now && dueDateTime > fiveMinsAgo && !task.reminder_due_sent) {
                    await AdvTask.updateOne({ _id: task._id }, { $set: { reminder_due_sent: true } }, { strict: false });
                }

                // Reminder: Overdue by 2 hours
                const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
                const twoHoursFiveMinsAgo = new Date(twoHoursAgo.getTime() - 5 * 60 * 1000);
                if (dueDateTime <= twoHoursAgo && dueDateTime > twoHoursFiveMinsAgo && !task.reminder_overdue_sent) {
                    await AdvTask.updateOne({ _id: task._id }, { $set: { reminder_overdue_sent: true } }, { strict: false });
                }
            }
        } catch (error) {
            console.error("Error in Task Cron (Every 5 mins):", error);
        }
    });

    // End-of-Day Summary at 23:50
    cron.schedule("50 23 * * *", async () => {
        try {
            console.log("Generating End of Day Task Report...");
            
            console.log("EOD Task Report Cron completed successfully.");
        } catch (error) {
            console.error("Error in EOD Task Cron:", error);
        }
    });
};

module.exports = { initializeTaskCron };
