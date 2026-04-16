require("dotenv").config();
const cron = require("node-cron");
const NewEnroll = require("../models/NewStudentEnroll");
const { sendPaymentReminderEmail } = require("../controllers/emailController");

// Note: Using NewEnroll model for payment reminders (students with pending payments)

// Schedule configuration: Days and times for sending payment reminders (UTC - for Vercel Cron)
// Note: Vercel Cron uses UTC timezone. IST = UTC + 5:30
const REMINDER_SCHEDULE = [
  { day: 1, time: "2:30 AM UTC (8:00 AM IST)", cron: "30 2 * * 1" },    // Monday
  { day: 2, time: "5:30 AM UTC (11:00 AM IST)", cron: "30 5 * * 2" },  // Tuesday
  { day: 3, time: "7:30 AM UTC (1:00 PM IST)", cron: "30 7 * * 3" },   // Wednesday
  { day: 4, time: "10:30 AM UTC (4:00 PM IST)", cron: "30 10 * * 4" }, // Thursday
  { day: 5, time: "12:30 PM UTC (6:00 PM IST)", cron: "30 12 * * 5" }, // Friday
  { day: 6, time: "5:30 AM UTC (11:00 AM IST)", cron: "30 5 * * 6" },  // Saturday
  { day: 0, time: "7:30 AM UTC (1:00 PM IST)", cron: "30 7 * * 0" },   // Sunday
];

/**
 * Generate payment reminder email HTML
 */
const generateReminderEmail = (student) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Reminder</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #f15b29 0%, #ff8c5a 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .info-box {
            background: #f8f9fa;
            border-left: 4px solid #f15b29;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #555;
        }
        .value {
            color: #333;
            font-weight: 500;
        }
        .amount-highlight {
            background: #fff3cd;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
        }
        .amount-highlight h2 {
            color: #d63384;
            margin: 0;
            font-size: 32px;
        }
        .amount-highlight p {
            margin: 5px 0 0 0;
            color: #666;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.3s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .contact-info {
            margin: 15px 0;
            padding: 15px;
            background: #e7f3ff;
            border-radius: 5px;
        }
        .urgent-note {
            color: #d63384;
            font-weight: 600;
            margin: 15px 0;
            padding: 10px;
            background: #fff0f6;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://lh3.googleusercontent.com/d/1rmHu8ecr-JC3kzrM3Q5QALubDAXwVmx6" alt="Krutanic" style="max-width: 250px; margin-bottom: 15px; height: auto; display: block; margin-left: auto; margin-right: auto;" />
            <h1>Payment Reminder</h1>
        </div>
        
        <div class="content">
            <p>Dear <strong>${student.fullname}</strong>,</p>
            
            <p>We hope you are doing well and enjoying your learning journey with us at <strong>Krutanic</strong>.</p>
            
            <p>This is a friendly reminder regarding the pending payment for your enrolled program:</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="label">Program:</span>
                    <span class="value">${student.program || "N/A"}</span>
                </div>
                <div class="info-row">
                    <span class="label">Domain:</span>
                    <span class="value">${student.domain || "N/A"}</span>
                </div>
                <div class="info-row">
                    <span class="label">Total Program Fee:</span>
                    <span class="value">₹${student.programPrice?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="info-row">
                    <span class="label">Amount Paid:</span>
                    <span class="value">₹${student.paidAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div class="info-row">
                    <span class="label">Start Month:</span>
                    <span class="value">${student.internshipstartsmonth || 'N/A'}</span>
                </div>
            </div>
            
            <div class="amount-highlight">
                <p>Remaining Amount Due</p>
                <h2>₹${
                  ((student.programPrice || 0) - (student.paidAmount || 0)).toLocaleString('en-IN')
                }</h2>
            </div>
            
            <div class="urgent-note">
                ⚠️ Please clear your pending dues at the earliest to avoid any disruption in your learning experience.
            </div>
            
            <p style="text-align: center;">
                <a href="https://smartpay.easebuzz.in/219610/Krutanic" target="_blank" class="cta-button" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); margin-right: 10px;">
                     Click to Pay Now
                </a>
                <a href="https://wa.me/917829102936?text=Hi%2C%20I%20need%20help%20with%20payment%20for%20${encodeURIComponent(student.fullname)}" target="_blank" class="cta-button" style="background: linear-gradient(135deg, #f15b29 0%, #ff8c5a 100%);">
                    Contact Support
                </a>
            </p>
            
            <div class="contact-info">
                <strong>Payment Instructions:</strong><br>
                1️⃣ Click the "Click to Pay Now" button above to make payment<br>
                2️⃣ After successful payment, share transaction details via WhatsApp/SMS to <strong>+91 7829102936</strong><br>
                3️⃣ Include your name and transaction ID for quick verification<br><br>
                <strong>Payment Support:</strong><br>
                Email: support@krutanic.com<br>
                Phone/WhatsApp: +91 7829102936<br>
                Website: www.krutanic.com
            </div>
            
            <p style="margin-top: 25px;">If you have already made the payment, please share the transaction details with us at <strong>+91 7829102936</strong>, and kindly ignore this reminder.</p>
            
            <p style="margin-top: 20px;">Thank you for your cooperation and trust in Krutanic</p>
            
            <p style="margin-top: 15px;">
                <strong>Best Regards,</strong><br>
                Team Krutanic<br>
                <em>A Ladder for Brighter Future</em>
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated reminder. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Krutanic. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Delay function to add gap between emails
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Send payment reminder emails to students with pending amounts
 */
const sendPaymentReminders = async () => {
  try {
    // Only send emails in production environment
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${new Date().toLocaleString()}] Payment reminders skipped - Not in production environment (NODE_ENV: ${process.env.NODE_ENV || 'not set'})`);
      return { success: false, message: 'Reminders only sent in production environment' };
    }

    console.log(`[${new Date().toLocaleString()}] Starting payment reminder process...`);

    // Calculate date 4 months ago (120 days)
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setDate(fourMonthsAgo.getDate() - 120);

    // Get all pending payment reminders from NewEnroll collection
    // Students who enrolled within the last 4 months and haven't fully paid
    const pendingReminders = await NewEnroll.find({
      status: { $ne: "fullPaid" }, // Exclude students who have fully paid
      createdAt: { $gte: fourMonthsAgo }, // Enrolled within the last 4 months
    });

    console.log(`Found ${pendingReminders.length} students with pending payments (enrolled in last 4 months)`);

    let sentCount = 0;
    let failedCount = 0;

    for (const reminder of pendingReminders) {
      // Skip if no pending amount
      const pendingAmount = (reminder.programPrice || 0) - (reminder.paidAmount || 0);
      if (pendingAmount <= 0) {
        continue;
      }
      try {
        const emailHTML = generateReminderEmail(reminder);

        await sendPaymentReminderEmail({
          email: reminder.email,
          subject: `Payment Reminder - Pending Amount ₹${pendingAmount.toLocaleString('en-IN')} - Krutanic`,
          message: emailHTML,
          bcc: "info@krutanic.org,tejo.raditya@krutanic.org,shrikant@krutanic.org",
        });

        // Update reminder record
        reminder.lastReminderSent = new Date();
        reminder.reminderCount += 1;
        reminder.status = "reminded";
        reminder.remarks.push({
          message: `Reminder email sent - Count: ${reminder.reminderCount}`,
          sentAt: new Date(),
          sentBy: "System",
        });

        await reminder.save();
        sentCount++;

        console.log(`✓ Reminder sent to ${reminder.email} (${reminder.fullname})`);

        // Add 1-second delay between emails to avoid rate limiting
        if (sentCount < pendingReminders.length) {
          console.log(`⏳ Waiting 1 second before next email...`);
          await sleep(1000);
        }
      } catch (emailError) {
        failedCount++;
        console.error(`❌ Failed to send reminder to ${reminder.email}`);

        // Still wait 1 second even on error to maintain rate limiting
        if ((sentCount + failedCount) < pendingReminders.length) {
          await sleep(1000);
        }
      }
    }

    console.log(`Payment reminder process completed: ${sentCount} sent, ${failedCount} failed`);
    return { success: true, sent: sentCount, failed: failedCount };
  } catch (error) {
    console.error("Error in sendPaymentReminders:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize scheduled payment reminder jobs
 */
const initializePaymentReminderScheduler = () => {
  // Only initialize scheduler in production environment
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  console.log("🚀 Initializing Payment Reminder Scheduler...");
  console.log("⏰ Timezone: Asia/Kolkata (IST - Indian Standard Time)");

  // Schedule reminder emails based on the defined schedule
  REMINDER_SCHEDULE.forEach((schedule) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    cron.schedule(schedule.cron, async () => {
      console.log(`📧 Triggering scheduled payment reminders - ${dayNames[schedule.day]} at ${schedule.time}`);
      await sendPaymentReminders();
    }, {
      timezone: "Asia/Kolkata"
    });

    console.log(`✓ Scheduled payment reminders for ${dayNames[schedule.day]} at ${schedule.time}`);
  });

  console.log("✅ Payment Reminder Scheduler initialized successfully!");
};

module.exports = {
  sendPaymentReminders,
  initializePaymentReminderScheduler,
  generateReminderEmail,
};
