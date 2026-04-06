const mongoose = require("mongoose");

const MicroCourseConfigSchema = new mongoose.Schema(
    {
        commonPaymentLink: { type: String, default: "https://rzp.io/rzp/Instructor_Led_Slot_Booking" }
    },
    {
        timestamps: true,
        strict: false
    }
);

const MicroCourseConfig = mongoose.model("MicroCourseConfig", MicroCourseConfigSchema);

module.exports = MicroCourseConfig;
