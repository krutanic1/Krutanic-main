
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
    user: process.env.SMTP_MAIL2,
    pass: process.env.SMTP_PASSWORD2,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
});

const createOfferLetterPDF = async (pdfword1, pdfword2) => {
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
    font: timesRomanFont,
    color: rgb(0, 0, 0),
    maxWidth: 495,
    lineHeight: 14,
  });
  page1.drawText("Bangalore, Karnataka |7829104024 | support@krutanic.com", {
    x: (a4Width - timesRomanFont.widthOfTextAtSize("Bangalore, Karnataka |7829104024 | support@krutanic.com", 12)) / 2, // Center text
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
    font: timesRomanFont,
    color: rgb(0, 0, 0),
    maxWidth: 495,
    lineHeight: 14,
  });
  page2.drawText("Bangalore, Karnataka |7829104024 | support@krutanic.com", {
    x: (a4Width - timesRomanFont.widthOfTextAtSize("Bangalore, Karnataka |7829104024 | support@krutanic.com", 12)) / 2, // Center text
    y: 200,
    size: 12,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};


const createAdvanceOfferLetterPDF = async ({ fullname, date, start, domain, durationLabel, programName }) => {
  const pdfDoc = await PDFDocument.create();

  const imagePath = path.join(__dirname, "offer.jpg");
  const imageBytes = fs.readFileSync(imagePath);
  const jpgImage = await pdfDoc.embedJpg(imageBytes);

  const imagePath2 = path.join(__dirname, "offerback.jpg");
  const imageBytes2 = fs.readFileSync(imagePath2);
  const jpgImage2 = await pdfDoc.embedJpg(imageBytes2);

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const a4Width = 595.28;
  const a4Height = 841.89;

  const durationWeeks = durationLabel.includes("Weeks") ? durationLabel.split(" ")[0] + " Weeks" : "24 Weeks";

  // --- Page 1 ---
  const page1 = pdfDoc.addPage([a4Width, a4Height]);
  page1.drawImage(jpgImage, { x: 0, y: 0, width: a4Width, height: a4Height });

  page1.drawText("ENROLLMENT & ADMISSION CONFIRMATION", {
    x: (a4Width - boldFont.widthOfTextAtSize("ENROLLMENT & ADMISSION CONFIRMATION", 13)) / 2,
    y: 730,
    size: 13,
    font: boldFont,
    color: rgb(0.95, 0.36, 0.16),
  });

  let y1 = 685;
  page1.drawText(`Date: ${date}`, { x: 55, y: y1, size: 10, font: boldFont, color: rgb(0.15, 0.15, 0.15) });
  y1 -= 25;

  const salutationName = fullname.replace(/\s*candidate\b/gi, "").trim();
  page1.drawText(`Dear ${salutationName},`, { x: 55, y: y1, size: 11, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  y1 -= 30;

  page1.drawText("Congratulations and Welcome to Krutanic!", { x: 55, y: y1, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y1 -= 20;

  const introText = `We are pleased to confirm your enrollment in the ${programName}, commencing on ${start}.

By securing your place in this program, you have taken an important step toward strengthening your analytical capabilities and building expertise in one of the most sought-after professional domains in today's data-driven economy.

Whether your goal is career advancement, professional growth, internal promotion, or transitioning into your field, this program has been carefully designed to help you develop practical skills aligned with current industry requirements.`;

  page1.drawText(introText, {
    x: 55,
    y: y1,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y1 -= 145;

  page1.drawText("A Message from Krutanic", { x: 55, y: y1, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y1 -= 18;

  const messageText = `Thank you for choosing Krutanic as your learning partner. The decision to invest in your professional growth is one of the most valuable investments you can make. The knowledge, skills, and practical experience you gain over the next six months have the potential to influence your career trajectory for years to come.

Our commitment is to provide you with industry-relevant learning, practical implementation, expert mentorship, and career guidance throughout your journey. We look forward to supporting your success and helping you achieve your professional goals.`;

  page1.drawText(messageText, {
    x: 55,
    y: y1,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y1 -= 125;

  page1.drawText("Program Details", { x: 55, y: y1, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });

  const programDetailsList = [
    { label: "Program Name", value: programName },
    { label: "Enrollment Date", value: date },
    { label: "Program Start Date", value: start },
    { label: "Mode of Learning", value: "100% Live Online Instructor-Led Training" },
    { label: "Program Duration", value: durationLabel },
    { label: "Specialization", value: domain },

  ];

  let detailY = y1 - 18;
  for (const detail of programDetailsList) {
    // Draw custom bullet
    page1.drawCircle({
      x: 60,
      y: detailY + 3,
      size: 2,
      color: rgb(0.95, 0.36, 0.16)
    });

    // Draw bold label
    const labelText = detail.label + ": ";
    page1.drawText(labelText, {
      x: 70,
      y: detailY,
      size: 9,
      font: boldFont,
      color: rgb(0.15, 0.15, 0.15)
    });

    const labelWidth = boldFont.widthOfTextAtSize(labelText, 9);

    // Draw regular value
    page1.drawText(detail.value, {
      x: 70 + labelWidth,
      y: detailY,
      size: 9,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: 485 - (70 + labelWidth - 55)
    });

    detailY -= 17;
  }

  page1.drawText("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", {
    x: (a4Width - regularFont.widthOfTextAtSize("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", 9.5)) / 2,
    y: 80,
    size: 9.5,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // --- Page 2 ---
  const page2 = pdfDoc.addPage([a4Width, a4Height]);
  page2.drawImage(jpgImage, { x: 0, y: 0, width: a4Width, height: a4Height });

  let y2 = 720;

  page2.drawText("Your Learning Journey Includes", { x: 55, y: y2, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });

  const journeyItems = [
    `${durationWeeks} of Structured Learning`,
    "Live Instructor-Led Sessions",
    "Hands-On Assignments & Case Studies",
    "Industry-Oriented Projects",
    "Real-World Applications & Portfolio Development",
    "Mentorship & Career Guidance",
    "Resume Building & LinkedIn Profile Optimization",
    "Mock Interview & Interview Preparation Support",
    "Professional Networking Opportunities & Career Growth Guidance"
  ];

  let journeyY = y2 - 18;
  for (const item of journeyItems) {
    // Draw custom bullet
    page2.drawCircle({
      x: 60,
      y: journeyY + 3,
      size: 2,
      color: rgb(0.95, 0.36, 0.16)
    });

    // Draw regular item text
    page2.drawText(item, {
      x: 70,
      y: journeyY,
      size: 9.5,
      font: regularFont,
      color: rgb(0.25, 0.25, 0.25),
      maxWidth: 470
    });

    journeyY -= 17;
  }

  y2 = journeyY - 18;

  page2.drawText("Professional Commitment", { x: 55, y: y2, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y2 -= 18;

  const commitmentText = `At Krutanic, we believe meaningful career growth comes from consistent effort and practical application. To derive maximum value from the program, participants are expected to attend sessions regularly, complete assignments, assessments, and projects within the prescribed timelines, participate actively during mentor interactions, and demonstrate professionalism, discipline, and commitment throughout.`;

  page2.drawText(commitmentText, {
    x: 55,
    y: y2,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y2 -= 75;

  page2.drawText("Learning Resources & Confidentiality", { x: 55, y: y2, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y2 -= 18;

  const confidentialityText = `All learning materials, recordings, assignments, assessments, projects, presentations, templates, case studies, and educational resources shared remain the exclusive intellectual property of Krutanic. Sharing program content, recording, reproducing, distributing, or providing unauthorized access to resources is strictly prohibited. Any violation may result in removal from the program.`;

  page2.drawText(confidentialityText, {
    x: 55,
    y: y2,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y2 -= 85;

  page2.drawText("Certification", { x: 55, y: y2, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y2 -= 18;

  const certificationText = `Participants who successfully complete the program requirements, including attendance, assignments, assessments, and project submissions, shall be eligible to receive the Completion Certificate for the:\n${programName}\nIssued by Krutanic.`;

  page2.drawText(certificationText, {
    x: 55,
    y: y2,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });

  page2.drawText("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", {
    x: (a4Width - regularFont.widthOfTextAtSize("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", 9.5)) / 2,
    y: 80,
    size: 9.5,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // --- Page 3 ---
  const page3 = pdfDoc.addPage([a4Width, a4Height]);
  page3.drawImage(jpgImage2, { x: 0, y: 0, width: a4Width, height: a4Height });

  let y3 = 700;

  page3.drawText("Career Support", { x: 55, y: y3, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y3 -= 18;

  const supportText = `Participants will receive access to Resume Review & Enhancement, LinkedIn Optimization, Portfolio Development Guidance, Mock Interview Prep, Career Mentorship, and Placement Assistance. Please note that career support services are intended to enhance employability. Employment outcomes depend on individual performance, skills, and market conditions.`;

  page3.drawText(supportText, {
    x: 55,
    y: y3,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y3 -= 85;

  page3.drawText("Welcome to the Next Phase of Your Career", { x: 55, y: y3, size: 11, font: boldFont, color: rgb(0.95, 0.36, 0.16) });
  y3 -= 18;

  const welcomeText = `We are excited to partner with you on this journey. Over the coming months, you will gain practical knowledge, work on real-world projects, strengthen your professional profile, and develop skills that can create long-term career opportunities. Welcome to Krutanic. Welcome to your learning Journey.`;

  page3.drawText(welcomeText, {
    x: 55,
    y: y3,
    size: 9.5,
    font: regularFont,
    color: rgb(0.25, 0.25, 0.25),
    maxWidth: 485,
    lineHeight: 14.5,
  });
  y3 -= 60;

  page3.drawText("Warm Regards,", { x: 55, y: y3, size: 10, font: regularFont, color: rgb(0.25, 0.25, 0.25) });
  y3 -= 18;
  page3.drawText("Team Krutanic", { x: 55, y: y3, size: 10.5, font: boldFont, color: rgb(0.95, 0.36, 0.16) });

  // Position Participant Acknowledgement nicely
  y3 -= 60;

  page3.drawText("Participant Acknowledgement", { x: 55, y: y3, size: 11, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
  y3 -= 20;

  page3.drawText("I hereby acknowledge that I have successfully enrolled in the program and agree to abide by the academic policies, guidelines, code of conduct, and confidentiality requirements.", {
    x: 55,
    y: y3,
    size: 8.5,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3),
    maxWidth: 320,
    lineHeight: 11.5
  });
  y3 -= 45;

  page3.drawText("Participant Name: ___________________________", { x: 55, y: y3, size: 9.5, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
  y3 -= 25;
  page3.drawText("Signature: _________________________________", { x: 55, y: y3, size: 9.5, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
  y3 -= 25;
  page3.drawText("Date: _____________________________________", { x: 55, y: y3, size: 9.5, font: regularFont, color: rgb(0.2, 0.2, 0.2) });

  page3.drawText("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", {
    x: (a4Width - regularFont.widthOfTextAtSize("Bangalore, Karnataka | +91 7829104024 | support@krutanic.com", 9.5)) / 2,
    y: 80,
    size: 9.5,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const sendOfferLetter = async ({ email, fullname, date, start, end, domain, duration, location }) => {
  const isMentorship = domain && typeof domain === "string" && /mentorship|mentor/i.test(domain);
  const salutationName = fullname.replace(/\s*candidate\b/gi, "").trim();

  let subject, body, pdfBuffer;

  if (isMentorship) {
    // --- MENTORSHIP: Keep original offer letter ---
    subject = `Offer Letter - ${domain} Intern`;
    body = `
        <p>Dear ${salutationName},</p>
        <p>We at Krutanic are happy to inform you that based on your application and subsequent interview, you have secured the role of <strong>${domain} Intern</strong> with us. This email is to be considered as a formal offer for the mentioned role.</p>
        <p>Kindly find attached an offer letter with the particulars of your employment. We are extremely happy to offer you this role and look forward to having you on board with us. The date of commencement of your employment is <strong>${start}</strong>.</p>
        <p>For any further information please do not hesitate to contact us via mail to this mail ID.</p>
        <p>Wishing you all the best on your new journey.</p>
        <p>Best Regards,</p>
        <p><strong>Team Krutanic</strong></p>
        `;

    const pdfword1 = `
${date}
   
Dear ${salutationName},
    
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
    
Reporting Location: ${location || 'Online'}
    
    
I have read and understood the above terms and conditions and I accept this offer, as set forth above with Krutanic.
    
NAME:
    
DATE:
    
    
    
(Candidate’s Signature)
        `;

    pdfBuffer = await createOfferLetterPDF(pdfword1, pdfword2);
  } else {
    // --- ADVANCE: Use new enrollment and admission confirmation content ---
    const programName = domain.toLowerCase().includes("program") ? domain : `${domain} Professional Program`;

    let durationWeeks = "24 Weeks";
    let durationLabel = "24 Weeks (6 Months)";
    if (duration) {
      if (duration.toLowerCase() === "six" || duration === "6") {
        durationWeeks = "24 Weeks";
        durationLabel = "24 Weeks (6 Months)";
      } else if (duration.toLowerCase() === "three" || duration === "3") {
        durationWeeks = "12 Weeks";
        durationLabel = "12 Weeks (3 Months)";
      } else if (duration.toLowerCase() === "two" || duration === "2") {
        durationWeeks = "8 Weeks";
        durationLabel = "8 Weeks (2 Months)";
      } else if (duration.toLowerCase() === "one" || duration === "1") {
        durationWeeks = "4 Weeks";
        durationLabel = "4 Weeks (1 Month)";
      } else {
        durationLabel = `${duration} Months`;
      }
    }

    subject = `Enrollment & Admission Confirmation - ${fullname}`;
    body = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);">
            <!-- Brand Header -->
            <div style="background: linear-gradient(135deg, #F15B29 0%, #ff7a45 100%); color: #ffffff; text-align: center; padding: 35px 20px;">
              <img src="https://lh3.googleusercontent.com/d/1rmHu8ecr-JC3kzrM3Q5QALubDAXwVmx6" alt="Krutanic Logo" style="max-height: 55px; margin-bottom: 15px; display: inline-block; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #ffffff;">ENROLLMENT & ADMISSION CONFIRMATION</h1>
            </div>
    
            <!-- Main Body Content -->
            <div style="padding: 40px 30px; color: #333333; font-size: 15px; line-height: 1.6;">
              <p style="font-size: 14px; color: #666666; margin-bottom: 25px;"><strong>Date:</strong> ${date}</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${salutationName}</strong>,</p>
              
              <h2 style="font-size: 18px; color: #F15B29; margin-top: 0; margin-bottom: 15px;">Congratulations and Welcome to Krutanic!</h2>
              
              <p style="margin-bottom: 20px;">We are pleased to confirm your enrollment in the <strong>${programName}</strong>, commencing on <strong>${start}</strong>.</p>
              
              <p style="margin-bottom: 25px; color: #555555;">By securing your place in this program, you have taken an important step toward strengthening your analytical capabilities and building expertise in one of the most sought-after professional domains in today's data-driven economy.</p>
              
              <p style="margin-bottom: 30px; color: #555555;">Whether your goal is career advancement, professional growth, internal promotion, or transitioning into your field, this program has been carefully designed to help you develop practical skills aligned with current industry requirements.</p>
    
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
    
              <h3 style="font-size: 16px; color: #F15B29; margin-bottom: 15px;">A Message from Krutanic</h3>
              <p style="margin-bottom: 15px; color: #555555;">Thank you for choosing Krutanic as your learning partner.</p>
              <p style="margin-bottom: 15px; color: #555555;">The decision to invest in your professional growth is one of the most valuable investments you can make. The knowledge, skills, and practical experience you gain over the next six months have the potential to influence your career trajectory for years to come.</p>
              <p style="margin-bottom: 15px; color: #555555;">Our commitment is to provide you with industry-relevant learning, practical implementation, expert mentorship, and career guidance throughout your journey.</p>
              <p style="margin-bottom: 15px; color: #555555;">This program has been carefully designed to help working professionals develop job-relevant skills through a structured learning experience, real-world projects, and hands-on application.</p>
              <p style="margin-bottom: 25px; color: #555555;">We look forward to supporting your success and helping you achieve your professional goals.</p>
    
              <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
    
              <!-- Program Details -->
              <div style="background-color: #fafafa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <h3 style="font-size: 16px; color: #F15B29; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; text-transform: uppercase;">Program Details</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #4f4f4f; line-height: 1.8;">
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold; width: 180px;">Program Name:</td>
                    <td style="padding: 5px 0;">${programName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Enrollment Date:</td>
                    <td style="padding: 5px 0;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Program Start Date:</td>
                    <td style="padding: 5px 0;">${start}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Mode of Learning:</td>
                    <td style="padding: 5px 0;">100% Live Online Instructor-Led Training</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Program Duration:</td>
                    <td style="padding: 5px 0;">${durationLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Specialization:</td>
                    <td style="padding: 5px 0;">${domain}</td>
                  </tr>
                  
                </table>
              </div>
    
              <!-- Learning Journey -->
              <div style="margin-bottom: 35px;">
                <h3 style="font-size: 16px; color: #F15B29; border-bottom: 2px solid #F15B29; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;">Your Learning Journey Includes</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 15px; color: #4f4f4f; line-height: 1.8;">
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>${durationWeeks} of Structured Learning</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Live Instructor-Led Sessions</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Hands-On Assignments & Case Studies</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Industry-Oriented Projects</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Real-World Applications & Portfolio Development</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Mentorship & Career Guidance</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Resume Building & LinkedIn Optimization</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Interview Preparation Support</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; vertical-align: top; width: 30px; font-size: 18px; color: #F15B29;">✔</td>
                    <td style="padding: 6px 0; vertical-align: top;"><strong>Professional Networking & Career Growth Guidance</strong></td>
                  </tr>
                </table>
              </div>
    
              <!-- Professional Commitment -->
              <div style="margin-bottom: 35px; border-left: 4px solid #F15B29; padding-left: 20px; background-color: #fafafa; padding: 15px; border-radius: 4px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #F15B29; text-transform: uppercase;">Professional Commitment</h3>
                <p style="margin-bottom: 0; font-size: 14px; color: #555555;">At Krutanic, we believe meaningful career growth comes from consistent effort and practical application. To derive maximum value from the program, participants are expected to attend sessions regularly, complete assignments and projects within prescribed timelines, and demonstrate professionalism, discipline, and commitment throughout.</p>
              </div>
    
              <!-- Confidentiality -->
              <div style="margin-bottom: 35px; background-color: #fff9f9; border: 1px dashed #d32f2f; padding: 20px; border-radius: 8px;">
                <h3 style="margin-top: 0; font-size: 16px; color: #d32f2f; text-transform: uppercase;">Learning Resources & Confidentiality</h3>
                <p style="margin-bottom: 0; font-size: 14px; color: #555555;">All learning materials, recordings, assignments, assessments, and projects shared remain the exclusive intellectual property of Krutanic. Sharing program content, recording, reproducing, or providing unauthorized access is strictly prohibited and may result in removal from the program.</p>
              </div>
    
              <!-- Certification & Support -->
              <div style="margin-bottom: 35px;">
                <h3 style="font-size: 16px; color: #F15B29; text-transform: uppercase; margin-bottom: 10px;">Certification</h3>
                <p style="margin-bottom: 15px;">Successful completion of program requirements, including attendance, assignments, and project submissions, makes you eligible to receive the official <strong>Completion Certificate</strong> for the program issued by Krutanic.</p>
                
                <h3 style="font-size: 16px; color: #F15B29; text-transform: uppercase; margin-bottom: 10px;">Career Support</h3>
                <p style="margin-bottom: 0;">You will receive access to resume enhancements, LinkedIn optimization, mock interview prep, career mentorship, and placement assistance support to enhance employability.</p>
              </div>
    
              <!-- Closing -->
              <div style="border-top: 1px solid #eeeeee; padding-top: 30px;">
                <p style="margin-bottom: 10px;">We are excited to partner with you on this journey. We look forward to supporting your success.</p>
                
                <p style="margin: 0; font-size: 14px; color: #333333;">Warm Regards,</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: bold; color: #F15B29;">Team Krutanic</p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #777777;">
                  Bangalore, Karnataka<br>
                  📞 +91 7829104024 &bull; 📧 <a href="mailto:support@krutanic.com" style="color: #F15B29; text-decoration: none;">support@krutanic.com</a>
                </p>
              </div>
            </div>
    
            <!-- Disclaimer Footer -->
            <div style="background-color: #f7f7f7; border-top: 1px solid #e0e0e0; padding: 25px 30px; font-size: 12px; color: #777777; text-align: center;">
              <p style="margin: 0;">&copy; 2026 Krutanic. All Rights Reserved.</p>
            </div>
          </div>
        `;

    pdfBuffer = await createAdvanceOfferLetterPDF({ fullname, date, start, domain, durationLabel, programName });
  }

  const mailOptions = {
    from: `"Krutanic HR Team" <${process.env.SMTP_MAIL2}>`,
    replyTo: process.env.SMTP_MAIL2,
    to: email,
    cc: ["bhumika@krutanic.org", "shrikant@krutanic.org", "tejo.raditya@krutanic.org"],
    subject,
    html: body,
    priority: "normal", // Change from "high" to "normal" - high priority can trigger spam filters
    headers: {
      'X-Mailer': 'Krutanic',
      'X-Priority': '3',
      'Importance': 'Normal'
    },
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

module.exports = { sendOfferLetter, createAdvanceOfferLetterPDF, createOfferLetterPDF };