require("dotenv").config();
const cron = require("node-cron");
const AtdUser = require("../models/AtdUser");
const Attendance = require("../models/Attendance");
const { sendEmail } = require("../controllers/emailController");

/**
 * Helper to get the current date/time adjusted to IST (UTC+5:30)
 * regardless of the server's local timezone.
 */
const getISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 5.5));
};

/**
 * Generate a professional HTML attendance report for the employee
 */
const generateAttendanceReportEmail = (user, monthName, year, stats) => {
  const { total, full, late, half, lateDates, halfDates } = stats;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Attendance Report</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #f1f5f9; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; color: #ffffff; padding: 40px 30px; text-align: center; }
        .header img { max-width: 180px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 5px 0 0; opacity: 0.8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px; }
        .intro { margin-bottom: 30px; color: #64748b; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 35px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
        .stat-value { display: block; font-size: 28px; font-weight: 800; margin-bottom: 4px; }
        .stat-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        
        .full-present { color: #10b981; }
        .late-login { color: #f59e0b; }
        .half-day { color: #ef4444; }
        .total-logins { color: #0f172a; }
        
        .section-title { font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
        .log-list { margin-bottom: 30px; }
        .log-item { display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .log-item:last-child { border-bottom: none; }
        .log-date { font-weight: 600; color: #334155; }
        .log-tag { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; }
        
        .tag-late { background: #fff7ed; color: #c2410c; }
        .tag-half { background: #fef2f2; color: #dc2626; }
        
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 5px 0; }
        
        @media screen and (max-width: 500px) {
            .stats-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://lh3.googleusercontent.com/d/1rmHu8ecr-JC3kzrM3Q5QALubDAXwVmx6" alt="Krutanic Logo" />
            <h1>${monthName} ${year} Attendance</h1>
            <p>Monthly Performance Report</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello, ${user.name}</div>
            <p class="intro">Here is your attendance summary for the month of <strong>${monthName} ${year}</strong>. Please review your check-in performance below.</p>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-value total-logins">${total}</span>
                    <span class="stat-label">Total Logins</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value full-present">${full}</span>
                    <span class="stat-label">Full Present</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value late-login">${late}</span>
                    <span class="stat-label">Late Logins</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value half-day">${half}</span>
                    <span class="stat-label">Half Days</span>
                </div>
            </div>

            ${lateDates.length > 0 ? `
            <div class="section-title">Late Login Details</div>
            <div class="log-list">
                ${lateDates.map(item => `
                <div class="log-item">
                    <span class="log-date">${item.date}</span>
                    <span class="log-tag tag-late">LATE (${item.time})</span>
                </div>
                `).join('')}
            </div>
            ` : ''}

            ${halfDates.length > 0 ? `
            <div class="section-title">Half Day Details</div>
            <div class="log-list">
                ${halfDates.map(item => `
                <div class="log-item">
                    <span class="log-date">${item.date}</span>
                    <span class="log-tag tag-half">HALF DAY (${item.time})</span>
                </div>
                `).join('')}
            </div>
            ` : ''}

            <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
                <strong>Note:</strong> Attendance is calculated based on the following rules:<br/>
                • Before 11:05 AM: Full Present<br/>
                • 11:05 AM - 02:00 PM: Late Login<br/>
                • After 02:00 PM: Half Day
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Krutanic</strong> • A Ladder for Brighter Future</p>
            <p>&copy; ${year} Krutanic. All rights reserved.</p>
            <p style="margin-top: 15px;">This is an automated system-generated report. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Main function to generate and send reports to employees
 * If userId is provided, it sends only to that user for the specified month/year.
 * Otherwise, it sends to all for the previous month.
 */
const sendMonthlyAttendanceReports = async (targetUserId = null, targetMonth = null, targetYear = null) => {
  try {
    const istNow = getISTDate();
    let lastMonth, lastYear, monthName;

    if (targetMonth !== null && targetYear !== null) {
      lastMonth = parseInt(targetMonth);
      lastYear = parseInt(targetYear);
      const d = new Date(lastYear, lastMonth, 1);
      monthName = d.toLocaleString('default', { month: 'long' });
    } else {
      // Logic for "Previous Month" based on IST
      const lastMonthDate = new Date(istNow.getFullYear(), istNow.getMonth() - 1, 1);
      lastMonth = lastMonthDate.getMonth();
      lastYear = lastMonthDate.getFullYear();
      monthName = lastMonthDate.toLocaleString('default', { month: 'long' });
    }

    const query = targetUserId ? { _id: targetUserId } : {};
    const users = await AtdUser.find(query);
    
    console.log(`[${new Date().toLocaleString()}] Triggering reports for ${users.length} employee(s) for ${monthName} ${lastYear}...`);

    let sent = 0;
    const nextMonthDate = new Date(lastYear, lastMonth + 1, 1);
    const totalUsers = users.length;
    
    for (let i = 0; i < totalUsers; i++) {
      const user = users[i];
      if (!user.email) continue;

      const records = await Attendance.find({
        userId: user._id,
        timestamp: {
          $gte: new Date(lastYear, lastMonth, 1),
          $lt: nextMonthDate
        }
      }).sort({ timestamp: 1 });

      if (records.length === 0 && !targetUserId) continue; // Skip bulk if no data

      try {
        const stats = {
          total: records.length,
          full: 0,
          late: 0,
          half: 0,
          lateDates: [],
          halfDates: []
        };

        records.forEach(r => {
          const d = new Date(r.timestamp);
          const hours = d.getHours();
          const mins = d.getMinutes();
          const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', weekday: 'short' });
          const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (hours >= 14) {
            stats.half++;
            stats.halfDates.push({ date: dateStr, time: timeStr });
          } else if (hours > 11 || (hours === 11 && mins > 5)) {
            stats.late++;
            stats.lateDates.push({ date: dateStr, time: timeStr });
          } else {
            stats.full++;
          }
        });

        const html = generateAttendanceReportEmail(user, monthName, lastYear, stats);
        await sendEmail({
          email: user.email,
          subject: `${monthName} ${lastYear} Attendance Report - Krutanic`,
          message: html
        });
        
        sent++;
        if (sent % 10 === 0 || sent === totalUsers) {
          console.log(`[Progress] ${sent}/${totalUsers} reports dispatched...`);
        }
        
        // Increase delay to 1000ms to be safer in production
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(`❌ Failed to send report to ${user.email}:`, err.message);
      }
    }

    console.log(`Monthly attendance reports completed. ${sent} reports sent.`);
  } catch (error) {
    console.error("Error in sendMonthlyAttendanceReports:", error);
  }
};

/**
 * Initialize the monthly scheduler
 */
const initializeAttendanceReportScheduler = () => {
    // Schedule on 1st day of every month at 9:00 PM IST
    // Cron: 0 21 1 * *
    cron.schedule("0 21 1 * *", async () => {
        console.log(`📧 Triggering monthly attendance reports...`);
        await sendMonthlyAttendanceReports();
    }, {
        timezone: "Asia/Kolkata"
    });

    console.log("✅ Monthly Attendance Report Scheduler initialized (runs 1st of every month at 9:00 PM IST)");
};

module.exports = {
  sendMonthlyAttendanceReports,
  initializeAttendanceReportScheduler
};
