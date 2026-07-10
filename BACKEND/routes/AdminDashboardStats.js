const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Course = require('../models/CreateCourse');
const AdvCourse = require('../models/CreateAdvCourse');
const Operation = require('../models/CreateOperation');
const AdvOperation = require('../models/CreateAdvOperation');
const BDA = require('../models/CreateBDA');
const NewStudentEnroll = require('../models/NewStudentEnroll');
const AdvEnroll = require('../models/AdvEnroll');

/**
 * GET /api/admin/dashboard-stats
 * Returns aggregated stats for the admin dashboard.
 */
router.get('/dashboard-stats', async (req, res) => {
    try {
        const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
        const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1).toLocaleString("default", { month: "long", year: "numeric" });

        // 1. Fetch total counts
        const [
            totalCourses,
            totalAdvCourses,
            totalOperations,
            totalAdvOperations,
            totalBDAs,
            totalBooked,
            totalFullPaid,
            totalDefault
        ] = await Promise.all([
            Course.countDocuments(),
            AdvCourse.countDocuments(),
            Operation.countDocuments(),
            AdvOperation.countDocuments(),
            BDA.countDocuments(),
            NewStudentEnroll.countDocuments({ status: "booked" }),
            NewStudentEnroll.countDocuments({ status: "fullPaid" }),
            NewStudentEnroll.countDocuments({ status: "default" })
        ]);

        // 2. Fetch basic course information
        const courses = await Course.find({}, 'title session').lean();
        const advCourses = await AdvCourse.find({}, 'title sessions').lean();

        // 3. Aggregate payments for standard courses for current and next month
        const paymentStats = await NewStudentEnroll.aggregate([
            {
                $match: {
                    monthOpted: { $in: [currentMonth, nextMonth] }
                }
            },
            {
                $group: {
                    _id: {
                        domainId: "$domainId",
                        monthOpted: "$monthOpted",
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Aggregate payments for adv courses for current and next month
        const advPaymentStats = await AdvEnroll.aggregate([
            {
                $match: {
                    monthOpted: { $in: [currentMonth, nextMonth] }
                }
            },
            {
                $group: {
                    _id: {
                        domainId: "$domainId",
                        monthOpted: "$monthOpted",
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Helper function to map aggregated stats to course objects
        const mapStatsToCourse = (courseList, statsList) => {
            return courseList.map(course => {
                const courseIdStr = course._id.toString();
                let currentMonthCount = 0;
                let currentMonthFullPaid = 0;
                let nextMonthCount = 0;
                let nextMonthFullPaid = 0;

                statsList.forEach(stat => {
                    if (stat._id.domainId && stat._id.domainId.toString() === courseIdStr) {
                        if (stat._id.monthOpted === currentMonth) {
                            currentMonthCount += stat.count;
                            if (stat._id.status === "fullPaid") {
                                currentMonthFullPaid += stat.count;
                            }
                        } else if (stat._id.monthOpted === nextMonth) {
                            nextMonthCount += stat.count;
                            if (stat._id.status === "fullPaid") {
                                nextMonthFullPaid += stat.count;
                            }
                        }
                    }
                });

                return {
                    _id: course._id,
                    title: course.title,
                    sessionCount: course.session ? Object.keys(course.session).length : (course.sessions ? course.sessions.length : 0),
                    currentMonthCount,
                    currentMonthFullPaid,
                    nextMonthCount,
                    nextMonthFullPaid
                };
            });
        };

        const enrichedCourses = mapStatsToCourse(courses, paymentStats);
        const enrichedAdvCourses = mapStatsToCourse(advCourses, advPaymentStats);

        res.json({
            totals: {
                courses: totalCourses,
                advCourses: totalAdvCourses,
                operations: totalOperations,
                advOperations: totalAdvOperations,
                bdas: totalBDAs,
                booked: totalBooked,
                fullPaid: totalFullPaid,
                default: totalDefault
            },
            courses: enrichedCourses,
            advCourses: enrichedAdvCourses
        });

    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({ error: 'Server error fetching admin dashboard stats' });
    }
});

/**
 * GET /api/admin/filtered-payments
 * Returns raw payment records filtered by start and end date for Excel export.
 */
router.get('/filtered-payments', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                // To include the end date fully, set it to the end of the day
                const end = new Date(endDate);
                end.setUTCHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const filteredPayments = await NewStudentEnroll.find(query).lean();
        res.json(filteredPayments);
    } catch (error) {
        console.error('Error fetching filtered payments:', error);
        res.status(500).json({ error: 'Server error fetching filtered payments' });
    }
});

module.exports = router;
