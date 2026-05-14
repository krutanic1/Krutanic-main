const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL || process.env.EMAIL_USER,
        pass: process.env.DIKSHANNT_PASSWORD || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    pool: true,
});

const senderEmail = process.env.DIKSHANNT_SMTP || process.env.SMTP_MAIL || process.env.EMAIL_USER;
const adminBcc = process.env.DIKSHANNT_ADMIN_MAIL;

const resolveLoginUrl = () => {
    const explicitUrl = (process.env.DIKSHANNT_LOGIN_URL || '').trim();
    if (explicitUrl) return explicitUrl;

    const configured = (process.env.FRONTEND_URL || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    const preferred = configured.find((value) => /dikshannt\.com/i.test(value));
    if (preferred) return `${preferred.replace(/\/$/, '')}/login`;

    return 'https://dikshannt.com/login';
};

const loginUrl = resolveLoginUrl();

const sendWelcomeEmail = async (userEmail, userName, courseName) => {
    const mailOptions = {
        from: senderEmail,
        to: userEmail,
        subject: `Welcome to ${courseName} - Enrollment Approved!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #FE4323;">Congratulations, ${userName}!</h2>
                <p>Your enrollment for the course <strong>${courseName}</strong> has been successfully verified and approved.</p>
                <p>You can now log in to your dashboard to access all the course sessions and videos.</p>
                <div style="margin: 30px 0;">
                    <a href="${loginUrl}" style="background-color: #FE4323; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                </div>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>Krutanic Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return false;
    }
};

const sendCredentialsEmail = async (userEmail, userName, password) => {
    try {
        await transporter.sendMail({
            from: `"Dikshannt Support" <${senderEmail}>`,
            to: userEmail,
            bcc: adminBcc,
            subject: "Your Krutanic MicroCourses Credentials",
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee;">
                    <h2 style="color: #000; font-weight: 300; border-bottom: 2px solid #FE4323; padding-bottom: 15px; margin-bottom: 30px;">Your Learning Access</h2>
                    <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${userName}</strong>,</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666;">Your enrollment has been successfully verified. You can now access your courses using the credentials below:</p>
                    
                    <div style="background: #f9f9f9; padding: 25px; margin: 30px 0; border-left: 4px solid #FE4323;">
                        <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #999; font-weight: bold;">Login Details</p>
                        <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${userEmail}</p>
                        <p style="margin: 5px 0 0 0; font-size: 16px;"><strong>Password:</strong> <span style="color: #FE4323; font-family: monospace; font-size: 18px;">${password}</span></p>
                    </div>

                    <a href="${loginUrl}" style="display: inline-block; background: #000; color: #fff; padding: 15px 35px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; transition: background 0.3s;">Access Student Dashboard</a>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #999; line-height: 1.6;">
                        <em>Security Note: Please change your password after your first login. Do not share these credentials with anyone.</em>
                    </p>
                    <div style="margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
                        <p style="font-size: 11px; color: #ccc; text-transform: uppercase; letter-spacing: 1px;">© 2024 Krutanic. Professional Excellence.</p>
                    </div>
                </div>
            `,
        });
        console.log(`Credentials email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Credentials email failed:", error);
        return false;
    }
};
const sendCollegeCredentialsEmail = async (collegeEmail, authorizerName, collegeName, password) => {
    try {
        await transporter.sendMail({
            from: `"Dikshannt Institutional Support" <${senderEmail}>`,
            to: collegeEmail,
            bcc: adminBcc,
            subject: "Your Institutional Portal Credentials - Dikshannt",
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; background: #fff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #FE4323; margin: 0; font-size: 28px; letter-spacing: 2px;">DIKSHANNT</h1>
                        <p style="margin: 5px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #999;">Institutional Partner Access</p>
                    </div>

                    <h2 style="color: #000; font-weight: 300; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 30px; font-size: 20px;">Portal Authorization Details</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${authorizerName}</strong>,</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #444;">We are pleased to provide the administrative credentials for the <strong>${collegeName}</strong> portal. Your partnership with Dikshannt is now fully active.</p>
                    
                    <div style="background: #fdfdfd; border: 1px solid #f0f0f0; padding: 25px; margin: 30px 0; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; font-size: 11px; text-transform: uppercase; color: #FE4323; font-weight: bold; letter-spacing: 1px;">Access Credentials</p>
                        <p style="margin: 0; font-size: 15px; color: #333;"><strong>Official Email:</strong> ${collegeEmail}</p>
                        <p style="margin: 8px 0 0 0; font-size: 15px; color: #333;"><strong>Access Password:</strong> <span style="font-family: monospace; font-size: 16px; background: #eee; padding: 2px 6px; border-radius: 3px;">${password}</span></p>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${loginUrl}" style="display: inline-block; background: #FE4323; color: #fff; padding: 18px 40px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; box-shadow: 0 4px 12px rgba(254, 67, 35, 0.2);">Access Institutional Portal</a>
                    </div>
                    
                    <p style="font-size: 12px; color: #999; line-height: 1.6; border-left: 3px solid #eee; padding-left: 15px;">
                        <em>Security protocol: Please update your password upon initial entry. These credentials grant root administrative access to your institution's scholarly data.</em>
                    </p>

                    <div style="margin-top: 50px; border-top: 1px solid #f0f0f0; padding-top: 25px; text-align: center;">
                        <p style="font-size: 11px; color: #ccc; text-transform: uppercase; letter-spacing: 1px;">© 2024 Dikshannt. Scholarly Excellence.</p>
                    </div>
                </div>
            `,
        });
        console.log(`College credentials sent to ${collegeEmail}`);
        return true;
    } catch (error) {
        console.error("College credentials failed:", error);
        return false;
    }
};

const sendEnrollmentFormWelcomeEmail = async (userEmail, userName, domainName) => {
    try {
        await transporter.sendMail({
            from: `"Krutanic Admissions" <${senderEmail}>`,
            to: userEmail,
            subject: "Application Received: Krutanic Advanced Program",
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 12px; background: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4f46e5; margin: 0; font-size: 28px; letter-spacing: -0.5px; font-weight: 800;">KRUTANIC</h1>
                        <p style="margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #64748b;">Advanced Placement Acceleration</p>
                    </div>

                    <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin-bottom: 20px;">Welcome to the Journey, ${userName}!</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for your interest in the <strong>Krutanic Advanced Program</strong> for <strong>${domainName}</strong>. We've successfully received your application.</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Our admissions board is currently reviewing your profile. We focus on selecting candidates who demonstrate high ambition and readiness to execute. You can expect a call from our senior career advisor within the next 24 hours.</p>
                    
                    <div style="background: #f8faff; border: 1px solid #eef2ff; padding: 25px; margin: 30px 0; border-radius: 12px;">
                        <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #4f46e5; font-weight: 800; letter-spacing: 1px;">What's Next?</p>
                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151; line-height: 1.8;">
                            <li><strong>Profile Review:</strong> Our team evaluates your career goals and current skill gaps.</li>
                            <li><strong>Advisory Call:</strong> A 1:1 consultation to discuss your career roadmap.</li>
                            <li><strong>Skill Evaluation Test:</strong> An assessment to gauge your technical baseline and aptitude.</li>
                            <li><strong>Cohort Selection:</strong> Final decision on your enrollment for the 2026 cohort.</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 40px 0;">
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">In the meantime, feel free to explore our success stories.</p>
                        <a href="https://krutanic.com" style="display: inline-block; background: #4f46e5; color: #fff; padding: 16px 32px; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">Explore Success Stories</a>
                    </div>
                    
                    <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; text-align: center;">
                        Our team is committed to your career growth. We look forward to speaking with you soon.
                    </p>

                    <div style="margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 30px; text-align: center;">
                        <p style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">© 2024 Krutanic. All rights reserved.</p>
                    </div>
                </div>
            `,
        });
        console.log(`Enrollment welcome email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Enrollment welcome email failed:", error);
        return false;
    }
};

module.exports = { 
    sendWelcomeEmail, 
    sendCredentialsEmail, 
    sendCollegeCredentialsEmail,
    sendEnrollmentFormWelcomeEmail 
};
