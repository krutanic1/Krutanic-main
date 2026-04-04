const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();
        console.log("Available Models:");
        for (const m of models) {
            console.log(`- ${m.name}`);
        }
    } catch (err) {
        console.error("Error Listing Models:", err.message);
    }
}

listModels();
