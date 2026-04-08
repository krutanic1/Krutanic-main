const mongoose = require("mongoose")

const CreateAdvOperation = new mongoose.Schema({
    fullname: { type: String, unique: true, lowercase: true, },
    email: { type: String, unique: true, lowercase: true, },
    otp: { type: String },
    password: { type: String },
    mailSended: { type: Boolean, default: false },
    languages: [{ type: String }],
    isOnline: { type: Boolean, default: true },
    status: { type: String, default: "Active" },
    target: [{ currentMonth: { type: String }, percentage: { type: String }, }],
});

const AdvOperation = mongoose.model("AdvOperation", CreateAdvOperation);
module.exports = AdvOperation;
