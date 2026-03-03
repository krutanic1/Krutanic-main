const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const QuestionSchema = new mongoose.Schema({
    course: String,
    isActive: { type: Boolean, default: true }
}, { strict: false });

const Question = mongoose.model("Question", QuestionSchema);

async function check() {
    const uri = process.env.DB_NAME;
    if (!uri) {
        console.error("DB_NAME not found in .env");
        process.exit(1);
    }
    await mongoose.connect(uri);
    const stats = await Question.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$course", count: { $sum: 1 } } }
    ]);
    console.log("Active Questions per Course:");
    console.log(JSON.stringify(stats, null, 2));
    await mongoose.disconnect();
}

check();
