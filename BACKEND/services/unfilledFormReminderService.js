const AddTransactionId = require('../models/AddTransactionId');
const MedEnroll = require('../models/MedEnroll');
const MedTeam = require('../models/CreateMedTeam');
const { sendEmail } = require('../controllers/emailController');

const checkUnfilledForms = async () => {
    try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // Find transactions created more than 1 hour ago
        // and either never reminded, or last reminded more than 1 hour ago
        const pendingTransactions = await AddTransactionId.find({
            createdAt: { $lte: oneHourAgo },
            $or: [
                { lastReminderSentAt: { $exists: false } },
                { lastReminderSentAt: { $lte: oneHourAgo } }
            ]
        });

        if (pendingTransactions.length === 0) {
            return { success: true, count: 0, message: "No pending reminders." };
        }

        let sentCount = 0;

        for (const transaction of pendingTransactions) {
            // Check if user has filled the form
            // transactionId acts as the email in AddTransactionId, and is stored as email or transactionId in MedEnroll
            const isEnrolled = await MedEnroll.findOne({ 
                $or: [
                    { email: transaction.transactionId },
                    { transactionId: transaction.transactionId }
                ]
            });

            if (!isEnrolled) {
                // Find counselor email
                const counselor = await MedTeam.findOne({ fullname: transaction.counselor });

                if (counselor && counselor.email) {
                    const subject = `Action Required: Candidate hasn't filled Dashboard Access Form`;
                    const message = `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
                          <h2 style="color: #ffffff; margin: 0;">Form Submission Reminder</h2>
                        </div>
                        <div style="padding: 20px;">
                          <p style="font-size: 16px; color: #333;">Dear ${counselor.fullname},</p>
                          <p style="font-size: 14px; color: #555;">
                            The candidate <strong>${transaction.fullname}</strong> (${transaction.transactionId}) for whom you added transaction details has <strong>not</strong> filled the MedDashboardAccessForm yet.
                          </p>
                          <p style="font-size: 14px; color: #555;">
                            Please follow up with the candidate and ensure they complete the form. This reminder will be sent every hour until the form is submitted.
                          </p>
                          <p style="font-size: 14px; color: #d9534f; font-weight: bold; background-color: #fdf2f2; padding: 10px; border-left: 4px solid #d9534f; margin-top: 15px;">
                            🚨 Please inform the candidate: If the onboarding form is not submitted on the exact same day, their payment will be strictly considered as a default payment and their access will not be granted.
                          </p>
                          <p style="font-size: 14px; color: #555;">
                            Transaction added at: ${new Date(transaction.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                          </p>
                          <p style="font-size: 14px; color: #333; margin-top: 20px;">Best regards,</p>
                          <p style="font-size: 14px; color: #333; font-weight: bold;">Team Krutanic</p>
                        </div>
                      </div>
                    `;

                    await sendEmail({
                        email: counselor.email,
                        subject,
                        message
                    });

                    // Update tracking fields using updateOne to prevent DocumentNotFoundError
                    await AddTransactionId.updateOne(
                        { _id: transaction._id },
                        { 
                            $set: { lastReminderSentAt: now },
                            $inc: { reminderCount: 1 } 
                        }
                    );
                    
                    sentCount++;
                }
            }
        }

        return { success: true, count: sentCount, message: `Reminders sent to ${sentCount} counselors.` };

    } catch (error) {
        console.error("❌ Error in unfilledFormReminderService:", error);
        return { success: false, error: error.message };
    }
};

const initializeUnfilledFormReminders = () => {
    console.log("✅ Running Unfilled Form Reminder Service (Once on startup)");
    checkUnfilledForms();
    
    // Also schedule it to run every 30 minutes via node-cron
    const cron = require("node-cron");
    cron.schedule("*/30 * * * *", async () => {
        console.log("🔄 Running Unfilled Form Reminder Job...");
        await checkUnfilledForms();
    });
};

module.exports = { checkUnfilledForms, initializeUnfilledFormReminders };
