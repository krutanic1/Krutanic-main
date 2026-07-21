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

const admissionsSender = process.env.ADMISSIONS_MAIL || process.env.SMTP_MAIL || process.env.DIKSHANNT_SMTP;

const admissionsTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: admissionsSender,
        pass: process.env.ADMISSIONS_PASSWORD || process.env.SMTP_PASSWORD || process.env.DIKSHANNT_PASSWORD,
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

const sendMasterclassCertificateEmail = async (userEmail, userName, masterclassTitle, certificateUrl) => {
    try {
        const noreplyAddress = process.env.NOREPLY_MAIL || admissionsSender;
        await admissionsTransporter.sendMail({
            from: `"Krutanic Masterclasses" <${noreplyAddress}>`,
            replyTo: admissionsSender,
            to: userEmail,
            subject: `Your Certificate: ${masterclassTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #FE4323;">Congratulations, ${userName}!</h2>
                    <p>Your certificate for <strong>${masterclassTitle}</strong> is ready. Click the button below to download it.</p>
                    <div style="margin: 30px 0;">
                        <a href="${certificateUrl}" style="background-color: #FE4323; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Certificate</a>
                    </div>
                    <p>If the button doesn't work, copy-paste this link into your browser:</p>
                    <p style="word-break:break-all;color:#555">${certificateUrl}</p>
                    <br/>
                    <p>Best regards,</p>
                    <p><strong>Krutanic Team</strong></p>
                </div>
            `,
        });
        console.log(`Certificate email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Certificate email failed:", error);
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
        await admissionsTransporter.sendMail({
            from: `"Krutanic Admissions" <${admissionsSender}>`,
            to: userEmail,
            subject: "Application Received: Krutanic Advanced Program",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Application Received</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fa;
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            -webkit-font-smoothing: antialiased;
                        }
                        .wrapper {
                            width: 100%;
                            table-layout: fixed;
                            background-color: #f4f7fa;
                            padding-bottom: 40px;
                        }
                        .main {
                            background-color: #ffffff;
                            margin: 0 auto;
                            width: 100%;
                            max-width: 600px;
                            border-spacing: 0;
                            font-family: sans-serif;
                            color: #1e293b;
                            border-radius: 12px;
                            overflow: hidden;
                            margin-top: 40px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                        }
                        .header {
                            padding: 40px 0;
                            text-align: center;
                            background-color: #ffffff;
                        }
                        .content {
                            padding: 0 50px 40px 50px;
                        }
                        .greeting {
                            font-size: 24px;
                            font-weight: 700;
                            margin-bottom: 16px;
                            color: #0f172a;
                            letter-spacing: -0.02em;
                        }
                        .text {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #475569;
                            margin-bottom: 24px;
                        }
                        .steps-container {
                            background-color: #f8fafc;
                            border-radius: 16px;
                            padding: 32px;
                            margin-bottom: 32px;
                            border: 1px solid #f1f5f9;
                        }
                        .steps-title {
                            font-size: 12px;
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            color: #6366f1;
                            margin-bottom: 24px;
                        }
                        .step {
                            margin-bottom: 20px;
                            display: flex;
                        }
                        .step-num {
                            font-weight: 800;
                            color: #6366f1;
                            margin-right: 16px;
                            font-size: 14px;
                            min-width: 20px;
                        }
                        .step-body {
                            font-size: 14px;
                            line-height: 1.5;
                            color: #334155;
                        }
                        .step-body strong {
                            color: #0f172a;
                        }
                        .cta-wrapper {
                            text-align: center;
                            margin-top: 40px;
                        }
                        .button {
                            background-color: #000000;
                            color: #ffffff !important;
                            padding: 16px 32px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 15px;
                            display: inline-block;
                        }
                        .footer {
                            text-align: center;
                            padding: 40px 20px;
                        }
                        .footer-text {
                            font-size: 12px;
                            color: #94a3b8;
                            line-height: 1.8;
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <table class="main" width="100%">
                            <tr>
                                <td class="header">
                                    <div style="font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #000; text-transform: uppercase;">KRUTANIC</div>
                                    <div style="font-size: 9px; letter-spacing: 3px; color: #94a3b8; text-transform: uppercase; margin-top: 8px; font-weight: 600;">Advanced Placement Acceleration</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="content">
                                    <h1 class="greeting">Welcome to the Journey, ${userName}.</h1>
                                    <p class="text">
                                        We have successfully received your application for the <strong>Krutanic Advanced Program</strong> in <strong>${domainName}</strong>. 
                                        Our admissions committee is currently reviewing your credentials to assess the strategic alignment with our upcoming cohort.
                                    </p>
                                    <p class="text">
                                        This program is engineered for professionals who demonstrate a high readiness to execute and a commitment to career excellence.
                                    </p>
                                    
                                    <div class="steps-container">
                                        <div class="steps-title">Operational Roadmap</div>
                                        <div style="margin-bottom: 20px;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #6366f1; font-size: 14px;">01</td>
                                                    <td style="font-size: 14px; color: #334155; line-height: 1.5;">
                                                        <strong>Profile Review:</strong> Our team is evaluating your career goals and current skill gaps to ensure a high-impact fit.
                                                    </td>
                                                </tr>
                                                <tr><td height="15"></td></tr>
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #6366f1; font-size: 14px;">02</td>
                                                    <td style="font-size: 14px; color: #334155; line-height: 1.5;">
                                                        <strong>Advisory Call:</strong> A 1:1 consultation with a Senior Career Advisor to architect your professional roadmap.
                                                    </td>
                                                </tr>
                                                <tr><td height="15"></td></tr>
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #6366f1; font-size: 14px;">03</td>
                                                    <td style="font-size: 14px; color: #334155; line-height: 1.5;">
                                                        <strong>Skill Evaluation:</strong> A technical baseline assessment to gauge your aptitude and execution readiness.
                                                    </td>
                                                </tr>
                                                <tr><td height="15"></td></tr>
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #6366f1; font-size: 14px;">04</td>
                                                    <td style="font-size: 14px; color: #334155; line-height: 1.5;">
                                                        <strong>Cohort Selection:</strong> Final enrollment decision for the 2026 Advanced Placement session.
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="cta-wrapper">
                                        <a href="https://krutanic.com" class="button">Explore Success Stories</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div class="footer">
                            <p class="footer-text">
                                &copy; 2024 Krutanic. Professional Excellence.<br>
                                You are receiving this because you applied for the Krutanic Advanced Program.<br>
                                <a href="https://krutanic.com" style="color: #6366f1; text-decoration: none;">Visit Website</a> &bull; <a href="#" style="color: #6366f1; text-decoration: none;">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Enrollment welcome email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Enrollment welcome email failed:", error);
        return false;
    }
};

const sendMasterclassWelcomeEmail = async (userEmail, userName, masterclassTitle, startDateTime, whatsappLink) => {
    try {
        await admissionsTransporter.sendMail({
            from: `"Krutanic Masterclasses" <${admissionsSender}>`,
            to: userEmail,
            subject: `Registration Confirmed: ${masterclassTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registration Confirmed</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fa;
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            -webkit-font-smoothing: antialiased;
                        }
                        .wrapper {
                            width: 100%;
                            table-layout: fixed;
                            background-color: #f4f7fa;
                            padding-bottom: 40px;
                        }
                        .main {
                            background-color: #ffffff;
                            margin: 0 auto;
                            width: 100%;
                            max-width: 600px;
                            border-spacing: 0;
                            font-family: sans-serif;
                            color: #1e293b;
                            border-radius: 12px;
                            overflow: hidden;
                            margin-top: 40px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                        }
                        .header {
                            padding: 40px 0;
                            text-align: center;
                            background-color: #ffffff;
                        }
                        .content {
                            padding: 0 50px 40px 50px;
                        }
                        .greeting {
                            font-size: 24px;
                            font-weight: 700;
                            margin-bottom: 16px;
                            color: #0f172a;
                            letter-spacing: -0.02em;
                        }
                        .text {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #475569;
                            margin-bottom: 24px;
                        }
                        .steps-container {
                            background-color: #f8fafc;
                            border-radius: 16px;
                            padding: 32px;
                            margin-bottom: 32px;
                            border: 1px solid #f1f5f9;
                        }
                        .steps-title {
                            font-size: 12px;
                            font-weight: 800;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            color: #ff6b2d;
                            margin-bottom: 24px;
                        }
                        .cta-wrapper {
                            text-align: center;
                            margin-top: 40px;
                        }
                        .button {
                            background-color: #ff6b2d;
                            color: #ffffff !important;
                            padding: 16px 32px;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 15px;
                            display: inline-block;
                            box-shadow: 0 4px 12px rgba(255, 107, 45, 0.2);
                        }
                        .footer {
                            text-align: center;
                            padding: 40px 20px;
                        }
                        .footer-text {
                            font-size: 12px;
                            color: #94a3b8;
                            line-height: 1.8;
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <table class="main" width="100%">
                            <tr>
                                <td style="background-color: #ff6b2d; padding: 35px 0; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
                                    <div style="font-size: 32px; font-weight: 800; letter-spacing: 1px; color: #ffffff; margin: 0;">Krutanic</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="content">
                                    <h1 class="greeting">Registration Confirmed, ${userName}.</h1>
                                    <p class="text">
                                        Congratulations! Your spot for the highly anticipated <strong>${masterclassTitle}</strong> masterclass is secured. 
                                    </p>
                                    <p class="text">
                                        This session is packed with industry-level insights and frameworks designed to accelerate your career growth.
                                    </p>
                                    
                                    <div class="steps-container">
                                        <div class="steps-title">Session Details</div>
                                        <div style="margin-bottom: 20px;">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #ff6b2d; font-size: 16px;"><i class="fa fa-calendar"></i></td>
                                                    <td style="font-size: 15px; color: #0f172a; line-height: 1.5; font-weight: 600;">
                                                        Date & Time
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="30"></td>
                                                    <td style="font-size: 14px; color: #475569; padding-top: 4px;">
                                                        ${new Date(startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} (IST)
                                                    </td>
                                                </tr>
                                                <tr><td height="20"></td></tr>
                                                <tr>
                                                    <td width="30" valign="top" style="font-weight: 800; color: #ff6b2d; font-size: 16px;"><i class="fa fa-video-camera"></i></td>
                                                    <td style="font-size: 15px; color: #0f172a; line-height: 1.5; font-weight: 600;">
                                                        Joining Info
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="30"></td>
                                                    <td style="font-size: 14px; color: #475569; padding-top: 4px;">
                                                        You will receive the secure joining link and community access straight to your inbox shortly before the session begins.
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                    <div class="cta-wrapper">
                                        <a href="https://krutanic.com" class="button">Visit Our Platform</a>
                                        ${whatsappLink ? `
                                        <div style="margin-top: 20px;">
                                            <a href="${whatsappLink}" class="button" style="background-color: #25D366; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);">
                                                Join WhatsApp Community
                                            </a>
                                        </div>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div class="footer">
                            <p class="footer-text">
                                &copy; 2024 Krutanic. Professional Excellence.<br>
                                You are receiving this because you registered for a Krutanic Masterclass.<br>
                                <a href="https://krutanic.com" style="color: #ff6b2d; text-decoration: none;">Visit Website</a> &bull; <a href="#" style="color: #ff6b2d; text-decoration: none;">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`Masterclass welcome email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error("Masterclass welcome email failed:", error);
        return false;
    }
};

const sendMasterclassDailyReminder = async (userEmail, userName, masterclassTitle, startDateTime, whatsappLink) => {
    try {
        await admissionsTransporter.sendMail({
            from: `"Krutanic Masterclasses" <${admissionsSender}>`,
            to: userEmail,
            subject: `Reminder: Upcoming Masterclass - ${masterclassTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Upcoming Masterclass Reminder</title>
                    <style>
                        body { margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Inter', sans-serif; }
                        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7fa; padding-bottom: 40px; }
                        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; margin-top: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); }
                        .header { background-color: #ff6b2d; padding: 35px 0; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px; }
                        .content { padding: 0 50px 40px 50px; }
                        .steps-container { background-color: #f8fafc; border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 1px solid #f1f5f9; }
                        .button { background-color: #ff6b2d; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 107, 45, 0.2); }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <table class="main" width="100%">
                            <tr>
                                <td class="header">
                                    <div style="font-size: 32px; font-weight: 800; letter-spacing: 1px; color: #ffffff; margin: 0;">Krutanic</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="content">
                                    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #0f172a; margin-top: 40px;">Hi ${userName},</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                                        This is a quick reminder about your upcoming masterclass: <strong>${masterclassTitle}</strong>.
                                    </p>
                                    
                                    <div class="steps-container">
                                        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #ff6b2d; margin-bottom: 24px;">Session Schedule</div>
                                        <div style="font-size: 15px; color: #0f172a; font-weight: 600;">Date & Time</div>
                                        <div style="font-size: 14px; color: #475569; margin-bottom: 20px;">
                                            ${new Date(startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} (IST)
                                        </div>
                                    </div>

                                    <div style="text-align: center; margin-top: 40px;">
                                        <a href="https://krutanic.com" class="button">Visit Platform</a>
                                        ${whatsappLink ? `
                                        <div style="margin-top: 20px;">
                                            <a href="${whatsappLink}" class="button" style="background-color: #25D366; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);">Join WhatsApp Community</a>
                                        </div>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="text-align: center; padding: 40px 20px; font-size: 12px; color: #94a3b8;">
                            &copy; 2024 Krutanic. Professional Excellence.
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        return true;
    } catch (error) {
        console.error("Daily reminder email failed:", error);
        return false;
    }
};

const sendMasterclassTodayReminder = async (userEmail, userName, masterclassTitle, startDateTime, meetingLink) => {
    try {
        await admissionsTransporter.sendMail({
            from: `"Krutanic Masterclasses" <${admissionsSender}>`,
            to: userEmail,
            subject: `🚨 TODAY is the day: ${masterclassTitle}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Masterclass is Today</title>
                    <style>
                        body { margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Inter', sans-serif; }
                        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f7fa; padding-bottom: 40px; }
                        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; margin-top: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.03); }
                        .header { background-color: #0f172a; padding: 35px 0; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px; }
                        .content { padding: 0 50px 40px 50px; }
                        .steps-container { background-color: #fef2f2; border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 1px solid #fee2e2; }
                        .button { background-color: #ef4444; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <table class="main" width="100%">
                            <tr>
                                <td class="header">
                                    <div style="font-size: 32px; font-weight: 800; letter-spacing: 1px; color: #ffffff; margin: 0;">Krutanic</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="content">
                                    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #0f172a; margin-top: 40px;">Hi ${userName},</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                                        The wait is over! Your highly anticipated masterclass on <strong>${masterclassTitle}</strong> is happening <strong>TODAY</strong>.
                                    </p>
                                    
                                    <div class="steps-container">
                                        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin-bottom: 24px;">Live Session Details</div>
                                        <div style="font-size: 15px; color: #0f172a; font-weight: 600;">Time</div>
                                        <div style="font-size: 14px; color: #475569; margin-bottom: 20px;">
                                            ${new Date(startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} (IST)
                                        </div>
                                    </div>

                                    <div style="text-align: center; margin-top: 40px;">
                                        <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">Click the button below to join the live session at the scheduled time.</p>
                                        <a href="${meetingLink}" class="button">Click Here to Join Live Session</a>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div style="text-align: center; padding: 40px 20px; font-size: 12px; color: #94a3b8;">
                            &copy; 2024 Krutanic. Professional Excellence.
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        return true;
    } catch (error) {
        console.error("Today reminder email failed:", error);
        return false;
    }
};

const sendSkillEvaluationWelcomeEmail = async (userEmail, fullName, slotDate, slotTime) => {
    try {
        const mailOptions = {
            from: senderEmail,
            to: userEmail,
            cc: "tarunsai.kola@krutanic.org",
            bcc: "fedrick_sarone@krutanic.org",
            subject: "Your Skill Evaluation Test & Career Consultation Slot is Confirmed - Krutanic",
            html: `
<div style="background:#f5f7fb;padding:40px 20px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

        <!-- Header -->
        <div style="background:#f15b29;padding:30px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                Krutanic
            </h1>
        </div>

        <!-- Content -->
        <div style="padding:40px 35px;">

            <!-- Success Icon -->
            <div style="text-align:center;margin-bottom:25px;">
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="48" fill="#ECFDF3" stroke="#12B76A" stroke-width="3"/>
                    <path d="M30 52L44 66L72 38" stroke="#12B76A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>

            <h2 style="text-align:center;color:#111827;font-size:28px;margin-top:0;margin-bottom:10px;">
                Payment Received Successfully
            </h2>

            <p style="text-align:center;color:#6b7280;font-size:16px;margin-bottom:35px;">
                Your consultation slot has been confirmed.
            </p>

            <p style="color:#374151;font-size:16px;line-height:1.7;">
                Dear <strong>${fullName}</strong>,
            </p>

            <p style="color:#374151;font-size:16px;line-height:1.7;">
                Thank you for successfully completing the payment for the
                <strong>Skill Evaluation Test</strong>.
            </p>

            <p style="color:#374151;font-size:16px;line-height:1.7;">
                We are pleased to confirm your 1-on-1 Career Consultation session.
            </p>

            <!-- Appointment Card -->
            <div style="margin:30px 0;background:#fff7f4;border:1px solid #ffd5c8;border-radius:12px;padding:25px;">

                <div style="font-size:14px;color:#9ca3af;text-transform:uppercase;font-weight:600;letter-spacing:1px;margin-bottom:15px;">
                    Appointment Details
                </div>

                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:15px;">
                            Date
                        </td>
                        <td style="padding:8px 0;color:#111827;font-size:15px;font-weight:600;text-align:right;">
                            ${slotDate}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:15px;">
                            Time
                        </td>
                        <td style="padding:8px 0;color:#111827;font-size:15px;font-weight:600;text-align:right;">
                            ${slotTime}
                        </td>
                    </tr>
                </table>
            </div>

            <p style="color:#374151;font-size:16px;line-height:1.7;">
                Our career experts will contact you shortly and guide you through the next steps to ensure you are fully prepared for the assessment.
            </p>

            <p style="color:#374151;font-size:16px;line-height:1.7;">
                We look forward to helping you discover your strengths, identify career opportunities, and create a personalized growth roadmap.
            </p>

            <p style="color:#374151;font-size:16px;line-height:1.7;margin-bottom:0;">
                Regards,<br>
                <strong>Team Krutanic</strong>
            </p>

        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px;text-align:center;">
            <p style="margin:0;color:#6b7280;font-size:13px;">
                © 2026 Krutanic. All rights reserved.
            </p>
        </div>

    </div>
</div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${userEmail} for Skill Evaluation Test`);
    } catch (error) {
        console.error("Error sending skill evaluation welcome email:", error);
    }
};

const sendSkillEvaluationAdminNotification = async (assessmentDetails) => {
    try {
        const mailOptions = {
            from: senderEmail,
            to: "fedrick_sarone@krutanic.org",
            cc: "tarunsai.kola@krutanic.org",
            subject: "New Enrollment: Skill Evaluation Test Submitted",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">New Skill Evaluation Test Enrollment</h2>
                    <p style="color: #34495e;">A new candidate has successfully paid and booked their slot.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.fullName}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.email}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobile Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.mobileNumber}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>City</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.city}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Booked Slot</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.bookedDate} at ${assessmentDetails.bookedTimeSlot}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Assigned Executive</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.assignedExecutiveName || 'Unassigned / Not found in CRM'}</td></tr>
                    </table>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending admin notification email:", error);
    }
};

const sendSkillEvaluationExecutiveNotification = async (executiveEmail, assessmentDetails) => {
    try {
        const mailOptions = {
            from: senderEmail,
            to: executiveEmail,
            subject: "SUCCESS! Your Lead Enrolled for Skill Evaluation Test",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #27ae60; border-radius: 10px;">
                    <h2 style="color: #27ae60;">Great News! Your Lead Enrolled!</h2>
                    <p style="color: #34495e;">Dear Executive,</p>
                    <p style="color: #34495e;">One of your leads has successfully paid and enrolled for the <strong>Skill Evaluation Test & Career Consultation</strong>.</p>
                    <p style="color: #34495e; font-weight: bold;">Please take care of this candidate and prepare for their upcoming slot!</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Lead Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.fullName}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.email}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobile Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.mobileNumber}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Slot Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.bookedDate} at ${assessmentDetails.bookedTimeSlot}</td></tr>
                    </table>
                    <p style="color: #34495e;">You can view the full details of their assessment on your ADV Dashboard.</p>
                    <p style="color: #34495e;">Best regards,<br><strong>Krutanic Admin</strong></p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Executive notification sent to ${executiveEmail}`);
    } catch (error) {
        console.error("Error sending executive notification email:", error);
    }
};

const sendSkillEvaluationAssignmentNotification = async (executiveEmail, assessmentDetails) => {
    try {
        const mailOptions = {
            from: senderEmail,
            to: executiveEmail,
            subject: "NEW ASSIGNMENT: Skill Evaluation Lead Assigned to You",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #3498db; border-radius: 10px;">
                    <h2 style="color: #3498db;">New Lead Assigned!</h2>
                    <p style="color: #34495e;">Dear Executive,</p>
                    <p style="color: #34495e;">The Admin has assigned a new <strong>Skill Evaluation Test</strong> lead to you.</p>
                    <p style="color: #34495e; font-weight: bold;">Please review the lead details below and take necessary action!</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Lead Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.fullName}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.email}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Mobile Number</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.mobileNumber}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Payment Status</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.paymentStatus || 'Pending'}</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Slot Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${assessmentDetails.bookedDate || 'Not Booked'} at ${assessmentDetails.bookedTimeSlot || ''}</td></tr>
                    </table>
                    <p style="color: #34495e;">You can view the full details of their assessment on your ADV Dashboard under Skill Evaluations.</p>
                    <p style="color: #34495e;">Best regards,<br><strong>Krutanic Admin</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Assignment notification email sent to ${executiveEmail}`);
    } catch (error) {
        console.error("Error sending assignment notification email:", error);
    }
};

module.exports = { 
    sendWelcomeEmail, 
    sendMasterclassCertificateEmail,
    sendCredentialsEmail, 
    sendCollegeCredentialsEmail,
    sendEnrollmentFormWelcomeEmail,
    sendMasterclassWelcomeEmail,
    sendMasterclassDailyReminder,
    sendMasterclassTodayReminder,
    sendSkillEvaluationWelcomeEmail,
    sendSkillEvaluationAdminNotification,
    sendSkillEvaluationExecutiveNotification,
    sendSkillEvaluationAssignmentNotification
};
