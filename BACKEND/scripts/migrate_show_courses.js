const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const CreateAdvCourseSchema = new mongoose.Schema(
    {
        title: { type: String },
        show: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        strict: false,
    }
);

const CreateAdvCourse = mongoose.model("CreateAdvCourse", CreateAdvCourseSchema);

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected successfully.");

        console.log("Updating all courses to set show: true...");
        const result = await CreateAdvCourse.updateMany(
            {},
            { $set: { show: true } }
        );

        console.log(`Successfully updated ${result.modifiedCount} courses.`);
        
        // Also ensure those with show: null or false are set to true if the user wants ALL old courses shown
        // But usually $exists: false is what covers "old courses" that didn't have the field.
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
