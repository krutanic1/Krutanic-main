
const mongoose = require('mongoose');
const AddEvent = require('./models/AddEvent');
const connectDB = require('./config/db');
require('dotenv').config();

const run = async () => {
    await connectDB();
    const now = new Date();
    console.log("Current Time (ISO):", now.toISOString());
    console.log("Current Time (Local):", now.toString());

    const allEvents = await AddEvent.find({ status: "Upcoming Events" });
    console.log("Total Upcoming Events:", allEvents.length);
    allEvents.forEach(e => {
        console.log(`Event: ${e.title}, Start: ${e.start.toISOString()}, isLE: ${e.start <= now}`);
    });

    const upcomingEvents = await AddEvent.find({
        status: "Upcoming Events",
        start: { $lte: now }
    });
    console.log("Matched events:", upcomingEvents.length);

    if (upcomingEvents.length > 0) {
        for (const event of upcomingEvents) {
            event.status = "Ongoing";
            await event.save();
            console.log(`Updated ${event.title} to Ongoing`);
        }
    }

    process.exit();
};

run();
