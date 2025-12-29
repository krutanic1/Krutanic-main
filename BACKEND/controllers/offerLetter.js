
require("dotenv").config();
const nodemailer = require("nodemailer");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_OFFFERMAIL,
        pass: process.env.SMTP_OFFERPASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
    pool: true,
});

const createOfferLetterPDF = async (pdfword1,pdfword2) => {
    const pdfDoc = await PDFDocument.create();

    // Load and embed image for page 1
    const imagePath = path.join(__dirname, "offer.jpg");
    const imageBytes = fs.readFileSync(imagePath);
    const jpgImage = await pdfDoc.embedJpg(imageBytes);

    // Load and embed image for page 2
    const imagePath2 = path.join(__dirname, "offerback.jpg"); // Make sure this image exists
    const imageBytes2 = fs.readFileSync(imagePath2);
    const jpgImage2 = await pdfDoc.embedJpg(imageBytes2);
    
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const { width, height } = jpgImage.scale(1);

    const a4Width = 595.28;
    const a4Height = 841.89;

    // Page 1 "
    const page1 = pdfDoc.addPage([a4Width, a4Height]); // A4 size
    page1.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: a4Width,
        height: a4Height,
    });
    page1.drawText("Offer Letter", {
        x: (a4Width - boldFont.widthOfTextAtSize("Offer Letter", 12)) / 2, // Center text
        y: 730,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    page1.drawText(pdfword1, {
        x: 50,
        y: 690,
        size: 12,
        font:timesRomanFont,
        color: rgb(0, 0, 0),
        maxWidth: 495,
        lineHeight: 14,
    });
    page1.drawText("Bangalore, Karnataka |7022812878 | support@krutanic.com", {
        x: (a4Width - timesRomanFont.widthOfTextAtSize("Bangalore, Karnataka |7022812878 | support@krutanic.com", 12)) / 2, // Center text
        y: 200,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    // Page 2 with pdfword
    const page2 = pdfDoc.addPage([a4Width, a4Height]);
    page2.drawImage(jpgImage2, {
        x: 0,
        y: 0,
        width: a4Width,
        height: a4Height,
    });
    page2.drawText(pdfword2, {
        x: 50,
        y: 700,
        size: 12,
        font:timesRomanFont,
        color: rgb(0, 0, 0),
        maxWidth: 495,
        lineHeight: 14,
    });
    page2.drawText("Bangalore, Karnataka |7022812878 | support@krutanic.com", {
        x: (a4Width - timesRomanFont.widthOfTextAtSize("Bangalore, Karnataka |7022812878 | support@krutanic.com", 12)) / 2, // Center text
        y: 200,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};


const sendOfferLetter = async ({ email, fullname, date, start, end, domain, duration }) => {
    const subject = `Offer Letter - ${domain} Intern`;
    const body = `
    <p> <strong>Dear</strong> ${fullname},</p>
    <p>We at <strong>Krutanic</strong> are happy to inform you that based on your application and subsequent interview, you have secured the role of <strong> ${domain} Intern </strong>with us.<strong> This email is to be considered as a formal offer for the mentioned role.</strong></p>
    <p>Kindly find attached an offer letter with the particulars of your employment. We are extremely happy to offer you this role and look forward to having you on board with us.<strong> The date of commencement of your employment is ${start}.</strong></p>
    <p>For any further information please do not hesitate to contact us via mail to this mail ID.</p>
    <p>Wishing you all the best on your new journey.</p>
    <p>Best Regards,<br/>Operation Team <br/> +918971569165</p>
    `;

    const pdfword1 = `
${date}
   
Dear ${fullname},
    
With reference to your application regarding, we are pleased to offer you internship with Krutanic.
    
We take this opportunity in wishing you the very best in you training as well as advising you that our offer letter is on the following terms and conditions:
    
1. Period of Service: ${duration} Months of your training will be probationary.
You shall, for the purpose of your internship with us, sign this offer letter for submission and approval of the management.
    
    
2. Designation: You shall be intern as ${domain}.
    
    
Internship Start Date: ${start}
    
Internship End Date: ${end}
   
Your responsibilities will include those for which you are engaged, as well as any other duties given to you by your reporting manager from the time to time. By accepting this offer you agree to perform all responsibilities assigned to you with due care and diligence and in compliance with the management norms and clauses.
    
By accepting this offer letter of internship, you acknowledge that you will keep all this information strictly confidential and refrain from using it for your own purposes, that is, disclosing it to anyone outside of the company.
    `;

    const pdfword2 = `
By accepting this offer letter, you agree that throughout your internship, you will observe all policies and practices governing the conduct of our business and trainer.
    
This letter sets forth the complete offer we are extending to you and supersedes and replaces any prior inconsistent statements or discussions.
    
Official communication either within the company or outside the company should be through the official Email of the HR or support only.
    
To indicate your acceptance, please mail the signed and scanned so copy of the Offer Letter and the documents as mentioned below to <hr@krutanic.org>
    
Working Hours: Flexible
    
Job Type: Internship
    
Reporting Location: Online
    
    
I have read and understood the above terms and conditions and I accept this offer, as set forth above with Krutanic.
    
NAME:
    
DATE:
    
    
    
(Candidate’s Signature)
`;

    const pdfBuffer = await createOfferLetterPDF(pdfword1,pdfword2);

    const mailOptions = {
        from: process.env.SMTP_OFFERMAIL,
        to: email,
        cc: ["bhumika@krutanic.org", "shrikant@krutanic.org"],
        subject,
        html: body,
        priority: "high",
        attachments: [
            {
                filename: "Offer_Letter.pdf",
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                reject(error);
            } else {
                console.log("Email sent successfully!", info.response);
                resolve(info.response);
            }
        });
    });
};

module.exports = { sendOfferLetter };