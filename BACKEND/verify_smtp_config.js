require("dotenv").config();
const nodemailer = require("nodemailer");

async function verifyTransporter(name, host, port, user, pass) {
    try {
        let transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: false,
            auth: {
                user: user,
                pass: pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.verify();
        console.log(`SUCCESS: ${name}`);
        return true;
    } catch (error) {
        console.log(`FAILURE: ${name} - ${error.message}`);
        return false;
    }
}

async function main() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;

    await verifyTransporter("DEFAULT_MAIL", host, port, process.env.SMTP_MAIL, process.env.SMTP_PASSWORD);
    await verifyTransporter("OPERATION_MAIL", host, port, process.env.SMTP_OFFFERMAIL, process.env.SMTP_OFFERPASSWORD);
}

main();
