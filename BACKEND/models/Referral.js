const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        discountPercentage: { type: Number, default: 40 },
        usageLimit: { type: Number, default: 100 },
        usedCount: { type: Number, default: 0 },
        paymentLink: { type: String }
    },
    {
        timestamps: true,
        strict: false
    }
);

const Referral = mongoose.model("Referral", ReferralSchema);

module.exports = Referral;
