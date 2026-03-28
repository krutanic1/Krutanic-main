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
                <strong>Note:</strong> Attendance is calculated based on the following rules (IST):<br/>
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
 * Generate a warning email for late logins
 */
const generateLateWarningEmail = (user, lateCount) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #334155; padding: 20px; }
        .container { max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
        .warning-box { background: #fff7ed; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .highlight { color: #c2410c; font-weight: 800; }
        .footer { font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="color: #0f172a;">Attendance Warning</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>This is an automated notification regarding your attendance for today.</p>
        
        <div class="warning-box">
            Our records show that you logged in after 11:05 AM today.
        </div>

        <p>Currently, you have accumulated <span class="highlight">${lateCount} late logins</span> in this month.</p>
        
        <p style="background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 4px; font-weight: 700;">
            IMPORTANT: 3 late logins in a month will lead to a 1-day Loss of Pay (LOP).
        </p>

        <p>Please ensure you check in before 11:05 AM to avoid any salary deductions.</p>
        
        <div class="footer">
            <p><strong>Krutanic Attendance System</strong></p>
            <p>This is a system-generated message. Please do not reply.</p>
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
          // Convert to IST (UTC + 5:30)
          const d = new Date(r.timestamp);
          const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
          const hours = istTime.getUTCHours();
          const mins = istTime.getUTCMinutes();
          const totalMinutes = hours * 60 + mins;
          
          const dateStr = istTime.getUTCDate() + ' ' + istTime.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
          const timeStr = istTime.getUTCHours().toString().padStart(2, '0') + ':' + istTime.getUTCMinutes().toString().padStart(2, '0');

          if (totalMinutes > 14 * 60) {
            stats.half++;
            stats.halfDates.push({ date: dateStr, time: timeStr });
          } else if (totalMinutes > 11 * 60 + 5) {
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
 * Daily check for late logins (Run at 12:00 AM IST)
 * Checks people who logged in late YESTERDAY and sends warning if count >= 2
 */
const checkDailyLateLogins = async () => {
  try {
    const istNow = getISTDate();
    // Yesterday's date in IST
    const yesterday = new Date(istNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const datePrefix = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
    
    // Find all logins from yesterday
    const yesterdayRecords = await Attendance.find({
      date: datePrefix
    });

    console.log(`[Daily Check] Scanning ${yesterdayRecords.length} records for ${datePrefix}...`);

    for (const record of yesterdayRecords) {
      const d = new Date(record.timestamp);
      const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getUTCHours();
      const mins = istTime.getUTCMinutes();
      const totalMinutes = hours * 60 + mins;

      // If logged in after 11:05 AM
      if (totalMinutes > 11 * 60 + 5) {
        const user = await AtdUser.findById(record.userId);
        if (!user || !user.email) continue;

        // Calculate TOTAL late logins for THIS month
        const currentMonthPrefix = `${istNow.getFullYear()}-${(istNow.getMonth() + 1).toString().padStart(2, '0')}-`;
        const monthRecords = await Attendance.find({
          userId: user._id,
          date: { $regex: new RegExp(`^${currentMonthPrefix}`) }
        });

        let lateCount = 0;
        monthRecords.forEach(r => {
          const rd = new Date(r.timestamp);
          const rist = new Date(rd.getTime() + (5.5 * 60 * 60 * 1000));
          if ((rist.getUTCHours() * 60 + rist.getUTCMinutes()) > (11 * 60 + 5)) {
            lateCount++;
          }
        });

        // Send mail if 2 or more late logins
        if (lateCount >= 2) {
          console.log(`[Alert] Sending late warning to ${user.email} (Count: ${lateCount})`);
          await sendEmail({
            email: user.email,
            subject: `Action Required: Attendance Warning (Late Logins: ${lateCount})`,
            message: generateLateWarningEmail(user, lateCount)
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in checkDailyLateLogins:", error);
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

    // Schedule daily late login check at 12:00 AM IST
    // Cron: 0 0 * * *
    cron.schedule("0 0 * * *", async () => {
        console.log(`📧 Checking for daily late login alerts...`);
        await checkDailyLateLogins();
    }, {
        timezone: "Asia/Kolkata"
    });

    console.log("✅ Attendance Schedulers initialized: Monthly (1st, 9PM) & Daily Late Login Alert (Daily, 12AM)");
};

module.exports = {
  sendMonthlyAttendanceReports,
  initializeAttendanceReportScheduler
};
