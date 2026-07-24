const mongoose = require('mongoose');
const AdvLead = require('../models/AdvLead');
const AdvCallActivity = require('../models/AdvCallActivity');
const AdvEnroll = require('../models/AdvEnroll');

const SalesIntelligenceController = {

    getExecutiveMetrics: async (req, res) => {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            // Fetch Total Leads
            const totalLeads = await AdvLead.countDocuments();
            
            // Fetch Today's Leads
            const todaysLeads = await AdvLead.countDocuments({ created_at: { $gte: todayStart } });

            // Fetch Booked Students
            const bookedStudents = await AdvEnroll.countDocuments();

            // Conversion %
            const conversionRate = totalLeads > 0 ? ((bookedStudents / totalLeads) * 100).toFixed(2) : 0;

            // Revenue Data
            const revenueStats = await AdvEnroll.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$paidAmount' },
                        pendingRevenue: { $sum: '$remainingAmount' }
                    }
                }
            ]);

            const totalRevenue = revenueStats[0]?.totalRevenue || 0;
            const pendingRevenue = revenueStats[0]?.pendingRevenue || 0;

            // Active Counselors (based on unique owners in AdvLead)
            const activeCounselorsList = await AdvLead.distinct('owner_id');
            const activeCounselors = activeCounselorsList.length;

            // Calls Today
            const callsToday = await AdvCallActivity.countDocuments({ createdAt: { $gte: todayStart } });

            // Trend Data (last 7 days leads & admissions & revenue)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const leadsTrend = await AdvLead.aggregate([
                { $match: { created_at: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            const revenueTrend = await AdvEnroll.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        revenue: { $sum: '$paidAmount' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

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
            // Source Breakdown
            const sources = await AdvLead.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$source", "Organic"] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            // Domain Breakdown
            const domains = await AdvLead.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$opted_domain", "Other"] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            // Stage Breakdown
            const stages = await AdvLead.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ["$stage", "Unknown"] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            res.json({ sources, domains, stages });
        } catch (error) {
            console.error('Error fetching lead analytics:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getSalesFunnel: async (req, res) => {
        try {
            const totalLeads = await AdvLead.countDocuments();
            const assigned = await AdvLead.countDocuments({ current_owner_id: { $exists: true } });
            
            // Contacted = Attempting Contact + In Conversation + Demo Conducted + Closed Won + Closed Lost
            const contacted = await AdvLead.countDocuments({
                stage: { $in: ["Attempting Contact", "In Conversation", "Demo Conducted", "Closed Won", "Closed Lost"] }
            });
            
            const interested = await AdvLead.countDocuments({
                stage: { $in: ["In Conversation", "Demo Conducted", "Closed Won"] }
            });

            const demoScheduled = await AdvLead.countDocuments({
                stage: { $in: ["Demo Conducted", "Closed Won"] }
            });

            const booked = await AdvEnroll.countDocuments();
            const paidFull = await AdvEnroll.countDocuments({ remainingAmount: { $lte: 0 } });

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
