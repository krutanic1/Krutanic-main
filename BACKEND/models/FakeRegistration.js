const mongoose = require("mongoose");

const FakeRegistrationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        emailMasked: { type: String, required: true },
        location: { type: String },
        timeAgo: { type: String, default: "just now" }
    },
    {
        timestamps: true
    }
);

const FakeRegistration = mongoose.model("fakepopup", FakeRegistrationSchema);

module.exports = FakeRegistration;
