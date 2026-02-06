
const mongoose = require("mongoose");
const AddEvent = require("./models/AddEvent");
const EventRegistration = require("./models/EventRegistration");
const EventApplication = require("./models/EventApplication");
require("dotenv").config();

async function run() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected to DB");

        // 1. Find an Ongoing event
        let event = await AddEvent.findOne({ status: "ongoing" });
        if (!event) {
            console.log("No ongoing event found. Finding ANY event to test.");
            event = await AddEvent.findOne();
            if (event) {
                console.log(`Found event: ${event.title}, Status: ${event.status}. Temporarily setting to 'ongoing' for test.`);
                event.status = 'ongoing';
                await event.save();
            }
        }

        if (!event) {
            console.log("No events found in DB.");
            return;
        }

        console.log(`Testing Event: ${event.title} (ID: ${event._id})`);
        console.log(`Direct Query Questions Length: ${event.questions ? event.questions.length : 0}`);

        // 2. Run Aggregation Pipeline
        const eventWithEnrolls = await AddEvent.aggregate([
            // Match specific event to declutter output
            { $match: { _id: event._id } },
            {
                $lookup: {
                    from: "eventapplications",
                    localField: "_id",
                    foreignField: "eventId",
                    as: "enrollments",
                },
            },
            {
                $addFields: {
                    enrollments: {
                        $cond: {
                            if: { $isArray: "$enrollments" },
                            then: "$enrollments",
                            else: ["$enrollments"],
                        },
                    },
                },
            },
            {
                $addFields: {
                    enrollments: {
                        $map: {
                            input: "$enrollments",
                            as: "enrollment",
                            in: {
                                userId: "$$enrollment.userId",
                                coin: "$$enrollment.coin",
                                remarks: "$$enrollment.remarks",
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    userIds: {
                        $map: {
                            input: "$enrollments",
                            as: "enrollment",
                            in: "$$enrollment.userId",
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "eventregistrations",
                    localField: "userIds",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    category: 1,
                    type: 1,
                    mode: 1,
                    location: 1,
                    status: 1,
                    isFree: 1,
                    startDate: 1,
                    endDate: 1,
                    startTime: 1,
                    endTime: 1,
                    timezone: 1,
                    shortDescription: 1,
                    fullDescription: 1,
                    eligibility: 1,
                    benefits: 1,
                    registrationLink: 1,
                    maxParticipants: 1,
                    isPublished: 1,
                    metaTitle: 1,
                    metaDescription: 1,
                    prizeMoney: 1,
                    image: 1,
                    questions: 1,
                    faqs: 1,
                    enrollments: 1,
                    userDetails: {
                        name: 1,
                        phone: 1,
                        email: 1,
                        collegeName: 1,
                        collegeEmailId: 1,
                        _id: 1,
                    },
                },
            },
        ]);

        if (eventWithEnrolls.length > 0) {
            const aggregatedEvent = eventWithEnrolls[0];
            console.log(`Aggregated Event Status: ${aggregatedEvent.status}`);
            console.log(`Aggregated Event Questions Length: ${aggregatedEvent.questions ? aggregatedEvent.questions.length : 0}`);

            if (aggregatedEvent.questions && aggregatedEvent.questions.length > 0) {
                console.log("Sample Question:", JSON.stringify(aggregatedEvent.questions[0], null, 2));
            } else {
                console.log("Questions are EMPTY in aggregation result!");
            }

        } else {
            console.log("Aggregation returned no results.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected");
    }
}

run();
