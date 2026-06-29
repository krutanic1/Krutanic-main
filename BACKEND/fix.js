const fs = require('fs');
const file = 'c:\\Users\\tarun\\OneDrive\\Desktop\\Krutanic-main-1\\BACKEND\\routes\\AdvLead.js';
let content = fs.readFileSync(file, 'utf8');

const importBlock = `const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fsNode = require("fs");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const pathNode = require("path");
const os = require("os");
const upload = multer({ dest: pathNode.join(os.tmpdir(), "uploads") });
const AdvLead = require("../models/AdvLead");
const AdvCallActivity = require("../models/AdvCallActivity");
const DeviceCallLog = require("../models/DeviceCallLog");
const AdvFollowup = require("../models/AdvFollowup");
const AdvTeamStructure = require("../models/AdvTeamStructure");
const rateLimit = require("express-rate-limit");
const AdvUser = require("../models/AdvUser");
const AdvNotification = require("../models/AdvNotification");
const AdvTeamMember = require("../models/CreateAdvTeam");
const AdvFormLead = require("../models/AdvFormLead");
const RemoteDialQueue = require("../models/RemoteDialQueue");`;

// Regex to remove one copy of the duplicate imports
const matchDup = content.match(/const express = require\("express"\);\nconst router = express\.Router\(\);(?:.|\n)+?const RemoteDialQueue = require\("\.\.\/models\/RemoteDialQueue"\);/);
if (matchDup) {
    const firstIndex = content.indexOf(matchDup[0]);
    const secondIndex = content.indexOf(matchDup[0], firstIndex + 1);
    if (secondIndex !== -1) {
        content = content.substring(0, secondIndex) + content.substring(secondIndex + matchDup[0].length);
    }
}

const stages = `const STAGES_AND_DISPOSITIONS = {
    "Fresh Lead": ["New Lead", "Invalid Lead"],
    "Attempting Contact": ["RNR", "Callback Requested", "No Response (Multi-touch)"],
    "First Call Connected": ["In Conversation", "Demo Booked"],
    "Demo Conducted": ["Decision Pending", "Negotiation Review", "Expected Payment Date"],
    "Closed Won": ["Converted"],
    "Closed Lost": ["Irrelevant Lead", "Not Interested", "Pricing Does Not Match", "No Response"]
};`;

content = content.replace(/};\nconst crypto = require\("crypto"\);/, stages + '\nconst crypto = require("crypto");');

fs.writeFileSync(file, content);
console.log('Fixed syntax error in AdvLead.js');
