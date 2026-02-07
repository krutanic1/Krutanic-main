require("dotenv").config();
console.log("SMTP Host: " + process.env.SMTP_HOST);
console.log("SMTP Port: " + process.env.SMTP_PORT);
console.log("SMTP User: " + process.env.SMTP_MAIL.replace(/(.{2}).+(.{2}@.+)/, "$1****$2"));
console.log("SMTP Operation User: " + process.env.SMTP_OFFFERMAIL.replace(/(.{2}).+(.{2}@.+)/, "$1****$2"));
