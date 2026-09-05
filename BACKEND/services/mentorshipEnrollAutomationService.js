const cron = require('node-cron');
const mongoose = require('mongoose');
const NewStudentEnroll = require('../models/NewStudentEnroll');
const User = require('../models/User');
const { sendOfferLetter } = require('../controllers/offerLetter');
const { sendEmail } = require('../controllers/emailController');

const runMentorshipEnrollAutomation = async (studentId = null) => {
    try {
      let query = {};

      if (studentId) {
        query = { _id: studentId };
      } else {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        query = {
          createdAt: { $gte: startOfMonth },
          status: { $in: ["booked", "fullPaid"] },
          $or: [
            { offerlettersended: { $ne: true } },
            { userCreated: { $ne: true } },
            { mailSended: { $ne: true } },
            { onboardingSended: { $ne: true } }
          ]
        };
      }
//jdbkhsldkflds
      const eligibleRecords = await NewStudentEnroll.find(query);

      console.log(`Found ${eligibleRecords.length} Mentorship (NewStudentEnroll) records needing automation.`);

      for (const record of eligibleRecords) {
        // 1. Send Offer Letter
        if (!record.offerlettersended) {
          try {
            const date = new Date().toLocaleDateString("en-GB");
            let duration = "Six";
            let durationLabel = "24 Weeks (6 Months)";
            
            let monthOffset = 6;
            
            if (record.program && typeof record.program === 'string') {
                if (record.program.includes("2 Months")) {
                    duration = "Two";
                    durationLabel = "8 Weeks (2 Months)";
                    monthOffset = 2;
                } else if (record.program.includes("3 Months")) {
                    duration = "Three";
                    durationLabel = "12 Weeks (3 Months)";
                    monthOffset = 3;
                }
            }

            const start = record.internshipstartsmonth || "TBD";
            let end = record.internshipendsmonth || "TBD";

            // Automatically calculate the end month based on start month and duration
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (start !== "TBD") {
                const startIndex = monthNames.findIndex(m => m.toLowerCase() === start.trim().toLowerCase());
                if (startIndex !== -1) {
                    const endIndex = (startIndex + monthOffset) % 12;
                    end = monthNames[endIndex];
                }
            }
            const location = "Online";
            const formattedName = record.fullname.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

            await sendOfferLetter({
              email: record.email,
              fullname: formattedName,
              date,
              start,
              end,
              domain: record.domain || "Mentorship Program",
              duration,
              location,
              isMentorship: true // Set to true for mentorship
            });

            record.offerlettersended = true;
            await record.save();
            console.log(`✅ Offer letter sent to ${record.email}`);
          } catch (err) {
            console.error(`❌ Failed to send offer letter for ${record.email}:`, err);
          }
        }

        // 2. Create User Account
        if (!record.userCreated) {
          try {
            const existingUser = await User.findOne({ email: record.email });
            if (!existingUser) {
              const newUser = new User({
                fullname: record.fullname,
                email: record.email,
                phone: record.phone || record.whatsAppNumber || "0000000000",
                password: "krutanic@123",
                advance: false
              });
              await newUser.save();
            }
            record.userCreated = true;
            await record.save();
            console.log(`✅ User account created for ${record.email}`);
          } catch (err) {
             console.error(`❌ Failed to create user for ${record.email}:`, err);
          }
        }

        // 3. Send Login Credentials
        if (!record.mailSended) {
          try {
            const defaultPassword = "krutanic@123";
            const subject = `Welcome to Our ${record.program || "Program"}`;
            const emailMessage = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
                  <h1 style="color: #ffffff; margin: 0;">Welcome to Krutanic</h1>
                </div>
                <div style="padding: 20px;">
                  <p style="font-size: 16px; text-transform: capitalize; color: #333;">Dear ${record.fullname},</p>
                  <p style="font-size: 14px; color: #555;">Thank you for joining us! Here are your details:</p>
                  <ul style="font-size: 14px; color: #555; line-height: 1.5;">
                    <li style="text-transform: capitalize;"><strong>Mode of Program:</strong> ${record.program || "N/A"}</li>
                    <li style="text-transform: capitalize;"><strong>You have opted a:</strong> ${record.monthOpted || "N/A"} month</li>
                    <li style="text-transform: capitalize;"><strong>You Have Opted for a Domain: </strong> ${record.domain || "N/A"}</li>
                    <li style="text-transform: capitalize;"><strong>Clear Due Payment Date:</strong> ${record.clearPaymentMonth || "N/A"}</li>
                  </ul>
                  <p style="font-size: 14px; color: #555;">Here are your login details:</p>
                  <p style="font-size: 14px; color: #333;">Use your email (<strong>${record.email}</strong>) and the default password provided below to log in:</p>
                  <p style="text-align: center; font-size: 18px; font-weight: bold; color: #4a90e2;">${defaultPassword}</p>
                  <p style="font-size: 14px; color: #555;">
                    <a href="https://www.krutanic.com/login" target="_blank" style="color: #F15B29; text-decoration: none; font-weight: bold;">Click here to log in</a>. 
                    After logging in, please set a new password according to your preferences.
                  </p>
                  <p>Note: Once you clear due amount then you'll get the access to your enrolled course.</p>
                  <p style="font-size: 14px; color: #555;">If you need any further assistance, feel free to reach out at <a href="mailto:support@krutanic.com" style="color: #F15B29; text-decoration: none;">support@krutanic.com</a>.</p>
                  <p style="font-size: 14px; color: #333;">Best regards,</p>
                  <p style="font-size: 14px; color: #333; font-weight: bold;">Team Krutanic</p>
                </div>
              </div>
            `;

            await sendEmail({
              email: record.email,
              subject: subject,
              message: emailMessage,
            });

            record.mailSended = true;
            await record.save();
            console.log(`✅ Login credentials sent to ${record.email}`);
          } catch (err) {
            console.error(`❌ Failed to send login credentials for ${record.email}:`, err);
          }
        }

        // 4. Send Onboarding Mail
        if (!record.onboardingSended) {
            try {
                const price = Number(record.programPrice) || 0;
                const paid = Number(record.paidAmount) || 0;
                const pendingAmount = price - paid;
                const formattedPendingAmount = pendingAmount.toLocaleString('en-IN');
              
                const emailMessage = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
                      <h1 style="color: #ffffff; margin: 0; font-family: Arial, sans-serif;">Welcome to Krutanic</h1>
                    </div>
                    <div style="padding: 20px; line-height: 1.6;">
                      <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Dear ${record.fullname},</p>
                      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Warm greetings from Krutanic! We're excited to have you on board for our ${record.domain}, commencing on the 5th of ${record.monthOpted}. Your journey with us promises to be an enriching experience.</p>
                      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">To ensure a seamless start, we kindly request you to login an LMS account by visiting <a href="https://www.krutanic.com" style="color: #F15B29; text-decoration: none; font-weight: bold;">krutanic.com</a>. Doing this promptly will help prevent any delays when the program begins.</p>
                      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Should you have any questions, contact us via email at <a href="mailto:support@krutanic.com" style="color: #0066cc; text-decoration: none;">support@krutanic.com</a>. We're here to support you.</p>
                      ${pendingAmount > 0 ? `<p style="font-size: 14px; color: #555; margin-bottom: 15px;">If you wish to clear your pending amount of <strong>₹${formattedPendingAmount}</strong> in advance, please use the link below:</p>
                      <p style="text-align: center; margin: 20px 0;">
                        <a href="https://smartpay.easebuzz.in/219610/Krutanic" target="_blank" style="background-color: #F15B29; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Pay Now</a>
                      </p>` : ''}
                      <p style="font-size: 14px; color: #555; margin-bottom: 15px;">Once again, welcome to Krutanic's ${record.domain}. We look forward to embarking on this learning journey with you!</p>
                      <p style="font-size: 14px; color: #333; margin: 15px 0 0 0;">Warm regards,</p>
                      <p style="font-size: 14px; color: #333; font-weight: bold; margin: 4px 0 0 0;">Team Krutanic</p>
                    </div>
                  </div>
                `;

                await sendEmail({
                  email: record.email,
                  subject: `Welcome to Krutanic's ${record.domain || ""} Program!`,
                  message: emailMessage,
                });

                record.onboardingSended = true;
                await record.save();
                console.log(`✅ Onboarding mail sent to ${record.email}`);
            } catch (err) {
                console.error(`❌ Failed to send onboarding mail for ${record.email}:`, err);
            }
        }
      }
    } catch (error) {
      console.error("❌ Error in MentorshipEnroll Automation Job:", error);
    }
};

const initializeMentorshipEnrollAutomation = async () => {
  console.log("✅ Running Mentorship Automation Service (Once on startup)");
  console.log("🔄 Running Mentorship Automation Job...");
  await runMentorshipEnrollAutomation();
};

module.exports = { initializeMentorshipEnrollAutomation, runMentorshipEnrollAutomation };
