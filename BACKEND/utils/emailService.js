const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (userEmail, userName, courseName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Welcome to ${courseName} - Enrollment Approved!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #FE4323;">Congratulations, ${userName}!</h2>
                <p>Your enrollment for the course <strong>${courseName}</strong> has been successfully verified and approved.</p>
                <p>You can now log in to your dashboard to access all the course sessions and videos.</p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/login" style="background-color: #FE4323; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
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
        const loginUrl = `${process.env.FRONTEND_URL}/login`;
        await transporter.sendMail({
            from: `"Krutanic Support" <${process.env.EMAIL_USER}>`,
            to: userEmail,
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
    } catch (error) {
        console.error("Credentials email failed:", error);
    }
};

module.exports = { sendWelcomeEmail, sendCredentialsEmail };
