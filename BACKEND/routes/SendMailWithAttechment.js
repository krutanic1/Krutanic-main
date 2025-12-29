// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const path = require("path");


// router.post("/sendedOfferLetterMail", async (req, res) => {
//     const { fullname, email, domain, monthOpted } = req.body;
//     const emailMessage = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
//       <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
//         <h1>Offer Letter - ${domain} Intern</h1>
//       </div>
//       <div style="padding: 20px;">
//         <p style="font-size: 16px; color: #333;">Dear ${fullname},</p>
//         <p style="font-size: 14px; color: #555;">We at Krutanic are happy to inform you that based on your application and subsequent interview, you have secured the role of ${domain} Intern with us. This email is to be considered as a formal offer for the mentioned role.</p>
//         <p style="font-size: 14px; color: #555;">Kindly find attached an offer letter with the particulars of your employment. We are extremely happy to offer you this role and look forward to having you on board with us. The date of commencement of your employment is 5th of ${monthOpted}.</p>
//         <p style="font-size: 14px; color: #555;">For any further information, please do not hesitate to contact us via this mail ID <a href="mailto:support@krutanic.com" style="color: #0066cc;">support@krutanic.com</a></p>
//         <p style="font-size: 14px; color: #555;">Wishing you all the best on your new journey.</p>
//         <p style="font-size: 14px; color: #333;">Best regards,</p>
//         <p style="font-size: 14px; color: #333;">Team Krutanic</p>
//       </div>
//       <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
//         <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
//       </div>
//     </div>
//   `;
//     try {
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: false,
//         auth: {
//           user: process.env.SMTP_MAIL,
//           pass: process.env.SMTP_PASSWORD,
//         },
//         tls: {
//           rejectUnauthorized: false,
//         },
//         pool: true,
//       });

//       const mailOptions = {
//         from: process.env.SMTP_MAIL,
//         to: email,
//         cc: process.env.SMTP_ADMIN_MAIL,
//         subject: `Offer Letter - ${domain} Intern`,
//         html: emailMessage,
//         priority: "high",
//         // attachments: [
//         //   {
//         //     path: file.path,
//         //     filename: file.originalname,
//         //   },
//         // ],
//       };

//       await new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error("Error sending email:", error);
//             reject(error);
//           } else {
//             console.log("Email sent successfully!", info.response);
//             resolve(info.response);
//           }
//         });
//       });

//       res.status(200).json({ message: "Offer letter email sent successfully!" });
//     } catch (error) {
//       console.error("Error sending email:", error);
//       res
//         .status(500)
//         .json({ message: "Error sending email.", error: error.message });
//     }
//   }
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const formidable = require("formidable"); 
const path = require("path");
const fs = require("fs");

router.post("/sendedOfferLetterMail", (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'uploads'); 
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form:", err);
      return res.status(500).json({ message: "Error parsing form data", error: err.message });
    }
    console.log("Form Fields:", fields);  // Log form fields
    console.log("Uploaded Files:", files);  // Log uploaded files
    const { fullname, email, domain, monthOpted } = fields;
    const file = files.offerLetter;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      console.log("File details:", file);
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F15B29; color: #fff; text-align: center; padding: 20px;">
          <h1>Offer Letter - ${domain} Intern</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Dear ${fullname},</p>
          <p style="font-size: 14px; color: #555;">We at Krutanic are happy to inform you that based on your application and subsequent interview, you have secured the role of ${domain} Intern with us. This email is to be considered as a formal offer for the mentioned role.</p>
          <p style="font-size: 14px; color: #555;">Kindly find attached an offer letter with the particulars of your employment. We are extremely happy to offer you this role and look forward to having you on board with us. The date of commencement of your employment is 5th of ${monthOpted}.</p>
          <p style="font-size: 14px; color: #555;">For any further information, please do not hesitate to contact us via this mail ID <a href="mailto:support@krutanic.com" style="color: #0066cc;">support@krutanic.com</a></p>
          <p style="font-size: 14px; color: #555;">Wishing you all the best on your new journey.</p>
          <p style="font-size: 14px; color: #333;">Best regards,</p>
          <p style="font-size: 14px; color: #333;">Team Krutanic</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px 0; border-top: 1px solid #ddd;">
          <p>&copy; 2024 Krutanic. All Rights Reserved.</p>
        </div>
      </div>
    `;

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        pool: true,
      });

      const attachment = {
        path: file.filepath,
        filename: file.originalFilename,
        contentType: 'application/pdf', 
      };


      const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        // cc: process.env.SMTP_ADMIN_MAIL,
        subject: `Offer Letter - ${domain} Intern`,
        html: emailMessage,
        priority: "high",
        attachments: [attachment],
      };
      console.log("Sending email with attachment path:", file.path);
      // Send the email
      await new Promise((resolve, reject) => {
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
     
      console.log("File Path to Delete:", file.filepath);
      if (file.filepath) {
        fs.unlink(file.filepath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      }


      res.status(200).json({ message: "Offer letter email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email.", error: error.message });
    }
  });
});

module.exports = router;
