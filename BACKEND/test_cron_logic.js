const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const assignExecutive = require("./utils/assignExecutive");
const NewStudentEnroll = require("./models/NewStudentEnroll");

const runTest = async () => {
    try {
        await connectDB();
        console.log("DB Connected");

        // 1. Create a dummy unassigned student
        const dummyStudent = new NewStudentEnroll({
            fullname: "Test Student AutoAssign",
            email: "test.autoassign@example.com",
            phone: "0000000000",
            languages: ["English"], // Simulate language matching
            programPrice: 1000
        });

        // Ensure no operation is assigned initially
        dummyStudent.operationId = null;
        dummyStudent.operationName = null;

        // Save temporarily (optional, but good for realistic test)
        // await dummyStudent.save(); 
        // Note: I won't save to DB to avoid pollution, just passing the object

        console.log("Testing assignment for:", dummyStudent.fullname);

        const assignment = await assignExecutive(dummyStudent);

        if (assignment) {
            console.log("✅ SUCCESS: Assigned to", assignment.operationName);
        } else {
            console.log("❌ FAILED: No assignment made (Is there an online executive with capacity?)");
        }

        process.exit();
    } catch (error) {
        console.error("Test Error:", error);
        process.exit(1);
    }
};

runTest();
