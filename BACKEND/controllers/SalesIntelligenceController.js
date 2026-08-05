const mongoose = require('mongoose');
const AdvLead = require('../models/AdvLead');
const AdvCallActivity = require('../models/AdvCallActivity');
const AdvEnroll = require('../models/AdvEnroll');

const SalesIntelligenceController = {

    getExecutiveMetrics: async (req, res) => {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Lead data facet
            const leadAgg = await AdvLead.aggregate([
                {
                    $facet: {
                        totalLeads: [{ $count: "count" }],
                        todaysLeads: [
                            { $match: { created_at: { $gte: todayStart } } },
                            { $count: "count" }
                        ],
                        activeCounselors: [
                            { $group: { _id: "$owner_id" } }
                        ],
                        leadsTrend: [
                            { $match: { created_at: { $gte: sevenDaysAgo } } },
                            {
                                $group: {
                                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]);

            const totalLeads = leadAgg[0].totalLeads[0]?.count || 0;
            const todaysLeads = leadAgg[0].todaysLeads[0]?.count || 0;
            const activeCounselors = leadAgg[0].activeCounselors.length || 0;
            const leadsTrend = leadAgg[0].leadsTrend || [];

            // Enroll data facet
            const enrollAgg = await AdvEnroll.aggregate([
                {
                    $facet: {
                        bookedStudents: [{ $count: "count" }],
                        revenueStats: [
                            {
                                $group: {
                                    _id: null,
                                    totalRevenue: { $sum: '$paidAmount' },
                                    pendingRevenue: { $sum: '$remainingAmount' }
                                }
                            }
                        ],
                        revenueTrend: [
                            { $match: { createdAt: { $gte: sevenDaysAgo } } },
                            {
                                $group: {
                                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                    revenue: { $sum: '$paidAmount' }
                                }
                            },
                            { $sort: { _id: 1 } }
                        ]
                    }
                }
            ]);

            const bookedStudents = enrollAgg[0].bookedStudents[0]?.count || 0;
            const totalRevenue = enrollAgg[0].revenueStats[0]?.totalRevenue || 0;
            const pendingRevenue = enrollAgg[0].revenueStats[0]?.pendingRevenue || 0;
            const revenueTrend = enrollAgg[0].revenueTrend || [];

            // Conversion %
            const conversionRate = totalLeads > 0 ? ((bookedStudents / totalLeads) * 100).toFixed(2) : 0;

            // Calls Today (separate collection)
            const callsToday = await AdvCallActivity.countDocuments({ createdAt: { $gte: todayStart } });

            res.json({
                totalLeads,
                todaysLeads,
                bookedStudents,
                conversionRate,
                totalRevenue,
                pendingRevenue,
                activeCounselors,
                callsToday,
                leadsTrend,
                revenueTrend
            });

        } catch (error) {
            console.error('Error fetching executive metrics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getLeadAnalytics: async (req, res) => {
        try {
            const analyticsAgg = await AdvLead.aggregate([
                {
                    $facet: {
                        sources: [
                            {
                                $group: {
                                    _id: { $ifNull: ["$source", "Organic"] },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { count: -1 } }
                        ],
                        domains: [
                            {
                                $group: {
                                    _id: { $ifNull: ["$opted_domain", "Other"] },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { count: -1 } },
                            { $limit: 10 }
                        ],
                        stages: [
                            {
                                $group: {
                                    _id: { $ifNull: ["$stage", "Unknown"] },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { count: -1 } }
                        ]
                    }
                }
            ]);

            const sources = analyticsAgg[0].sources || [];
            const domains = analyticsAgg[0].domains || [];
            const stages = analyticsAgg[0].stages || [];

            res.json({ sources, domains, stages });
        } catch (error) {
            console.error('Error fetching lead analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getSalesFunnel: async (req, res) => {
        try {
            const leadAgg = await AdvLead.aggregate([
                {
                    $facet: {
                        totalLeads: [{ $count: "count" }],
                        assigned: [
                            { $match: { current_owner_id: { $exists: true } } },
                            { $count: "count" }
                        ],
                        contacted: [
                            { $match: { stage: { $in: ["Attempting Contact", "In Conversation", "Demo Conducted", "Closed Won", "Closed Lost"] } } },
                            { $count: "count" }
                        ],
                        interested: [
                            { $match: { stage: { $in: ["In Conversation", "Demo Conducted", "Closed Won"] } } },
                            { $count: "count" }
                        ],
                        demoScheduled: [
                            { $match: { stage: { $in: ["Demo Conducted", "Closed Won"] } } },
                            { $count: "count" }
                        ]
                    }
                }
            ]);

            const totalLeads = leadAgg[0].totalLeads[0]?.count || 0;
            const assigned = leadAgg[0].assigned[0]?.count || 0;
            const contacted = leadAgg[0].contacted[0]?.count || 0;
            const interested = leadAgg[0].interested[0]?.count || 0;
            const demoScheduled = leadAgg[0].demoScheduled[0]?.count || 0;

            const enrollAgg = await AdvEnroll.aggregate([
                {
                    $facet: {
                        booked: [{ $count: "count" }],
                        paidFull: [
                            { $match: { remainingAmount: { $lte: 0 } } },
                            { $count: "count" }
                        ]
                    }
                }
            ]);

            const booked = enrollAgg[0].booked[0]?.count || 0;
            const paidFull = enrollAgg[0].paidFull[0]?.count || 0;

            res.json({
                totalLeads,
                assigned,
                contacted,
                interested,
                demoScheduled,
                booked,
                paidFull
            });

        } catch (error) {
            console.error('Error fetching sales funnel:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCounselorAnalytics: async (req, res) => {
        try {
            const leaderboard = await AdvLead.aggregate([
                { $match: { owner_name: { $exists: true, $ne: null } } },
                {
                    $group: {
                        _id: "$owner_name",
                        assignedLeads: { $sum: 1 },
                        closedWon: {
                            $sum: { $cond: [{ $eq: ["$stage", "Closed Won"] }, 1, 0] }
                        }
                    }
                },
                { $sort: { closedWon: -1, assignedLeads: -1 } }
            ]);

            res.json({ leaderboard });
        } catch (error) {
            console.error('Error fetching counselor analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCallAnalytics: async (req, res) => {
        try {
            const outcomes = await AdvCallActivity.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$callOutcome", "Unknown"] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            const callsByHour = await AdvCallActivity.aggregate([
                {
                    $group: {
                        _id: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            res.json({ outcomes, callsByHour });
        } catch (error) {
            console.error('Error fetching call analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getRevenueAnalytics: async (req, res) => {
        try {
            const revenueByProgram = await AdvEnroll.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$domain", "Unknown"] },
                        totalCollected: { $sum: '$paidAmount' },
                        totalRemaining: { $sum: '$remainingAmount' },
                        admissions: { $sum: 1 }
                    }
                },
                { $sort: { totalCollected: -1 } }
            ]);

            const monthlyRevenue = await AdvEnroll.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        revenue: { $sum: '$paidAmount' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            res.json({ revenueByProgram, monthlyRevenue });
        } catch (error) {
            console.error('Error fetching revenue analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getStudentAnalytics: async (req, res) => {
        try {
            const languages = await AdvEnroll.aggregate([
                { $unwind: "$languages" },
                {
                    $group: {
                        _id: "$languages",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            // For college and others we can use AdvLead
            const colleges = await AdvLead.aggregate([
                { $match: { education_background: { $exists: true, $ne: "" } } },
                {
                    $group: {
                        _id: "$education_background",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            res.json({ languages, colleges });
        } catch (error) {
            console.error('Error fetching student analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getAiInsights: async (req, res) => {
        try {
            // Heuristic logic to determine conversion probability
            const highQualityLeads = await AdvLead.aggregate([
                { $match: { stage: { $in: ["In Conversation", "Demo Conducted"] }, attempt_count: { $gte: 2 } } },
                { $limit: 5 },
                { $project: { full_name: 1, phone_number: 1, opted_domain: 1, stage: 1, score: { $literal: 85 } } }
            ]);

            const needsFollowUp = await AdvLead.aggregate([
                { $match: { next_followup_at: { $lte: new Date() }, stage: { $ne: "Closed Won" } } },
                { $limit: 5 },
                { $project: { full_name: 1, phone_number: 1, next_followup_at: 1, owner_name: 1 } }
            ]);

            res.json({ highQualityLeads, needsFollowUp });
        } catch (error) {
            console.error('Error fetching AI insights:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = SalesIntelligenceController;
