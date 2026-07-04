const AdvTask = require("../models/AdvTask");
const AdvLead = require("../models/AdvLead");
const AdvUser = require("../models/AdvUser");
const mongoose = require("mongoose");
const moment = require("moment"); // Ensure moment is available or use native Date

// Helper to get local start/end of day
const getLocalStartOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};
const getLocalEndOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

exports.createTask = async (req, res, next) => {
    try {
        const { lead_id, task_type, priority, due_date, due_time, remarks } = req.body;
        
        if (!lead_id || !task_type || !due_date || !due_time) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const lead = await AdvLead.findById(lead_id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        const task = new AdvTask({
            lead_id,
            lead_name: lead.full_name || lead.owner_name, // Assuming full_name exists, fallback
            student_mobile: lead.phone_number,
            counsellor_id: lead.current_owner_id || lead.owner_id, // Ensure accurate owner reference
            team_id: lead.team_id,
            task_type,
            priority,
            due_date: new Date(due_date),
            due_time,
            remarks,
            created_by: req.user ? (req.user._id || req.user.id) : undefined
        });

        await task.save();
        res.status(201).json({ success: true, message: "Task created successfully", data: task });
    } catch (error) {
        next(error);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const { date, counsellor_id, team_id, status, type, page = 1, limit = 50 } = req.query;
        let query = {};

        // Manager or Counsellor filtering
        if (req.user && req.user.role === "manager") {
            if (team_id) query.team_id = team_id;
            if (counsellor_id) query.counsellor_id = counsellor_id;
            else query.team_id = req.user.team_id || req.query.team_id; // Default to manager's team
        } else if (req.user && (req.user._id || req.user.id)) {
            query.counsellor_id = req.user._id || req.user.id;
        } else if (counsellor_id) {
            query.counsellor_id = counsellor_id; // For flexibility
        }

        if (status) {
            if (status === 'All') {
                // Do not filter by status
            } else {
                query.status = status;
            }
        } else {
            query.status = { $ne: "Completed" };
        }
        if (type) query.task_type = type;
        
        if (date) {
            query.due_date = {
                $gte: getLocalStartOfDay(date),
                $lte: getLocalEndOfDay(date)
            };
        }

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 50;
        const skip = (pageNumber - 1) * limitNumber;

        const totalItems = await AdvTask.countDocuments(query);
        const tasks = await AdvTask.find(query)
            .sort({ due_date: 1, due_time: 1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({ 
            success: true, 
            data: tasks,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalItems / limitNumber),
            totalItems
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        
        const task = await AdvTask.findById(id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        // Business Rule: Completed task cannot be edited except by manager
        if (task.status === "Completed" && req.user && req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only managers can edit completed tasks" });
        }

        if (status) task.status = status;
        if (remarks) task.remarks = remarks;
        if (req.user) task.updated_by = req.user._id || req.user.id;

        await task.save();
        res.status(200).json({ success: true, message: "Task updated", data: task });
    } catch (error) {
        next(error);
    }
};

exports.reassignTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { new_counsellor_id } = req.body;

        if (req.user && req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only managers can reassign tasks" });
        }

        const task = await AdvTask.findById(id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        const newUser = await AdvUser.findById(new_counsellor_id);
        if (!newUser) return res.status(404).json({ success: false, message: "New counsellor not found" });

        task.counsellor_id = new_counsellor_id;
        task.team_id = newUser.team_id;
        if (req.user) task.updated_by = req.user._id || req.user.id;

        await task.save();
        res.status(200).json({ success: true, message: "Task reassigned", data: task });
    } catch (error) {
        next(error);
    }
};

exports.getCounsellorDashboard = async (req, res, next) => {
    try {
        const counsellor_id = (req.user && (req.user._id || req.user.id)) || req.query.counsellor_id;
        if (!counsellor_id) return res.status(400).json({ success: false, message: "Counsellor ID required" });

        const startOfDay = getLocalStartOfDay();
        const endOfDay = getLocalEndOfDay();
        const now = new Date();

        const [createdToday, completedToday, allTasks] = await Promise.all([
            AdvTask.countDocuments({ counsellor_id, created_at: { $gte: startOfDay, $lte: endOfDay } }),
            AdvTask.countDocuments({ counsellor_id, status: "Completed", completed_at: { $gte: startOfDay, $lte: endOfDay } }),
            AdvTask.find({ counsellor_id })
        ]);

        let pendingCount = 0;
        let dueTodayCount = 0;
        let overdueCount = 0;

        allTasks.forEach(task => {
            if (task.status !== "Completed" && task.status !== "Missed") {
                pendingCount++;
                const dueDateTime = new Date(task.due_date);
                if (task.due_time) {
                    const [hrs, mins] = task.due_time.split(":");
                    dueDateTime.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);
                }

                if (task.due_date >= startOfDay && task.due_date <= endOfDay) {
                    dueTodayCount++;
                }

                if (now > dueDateTime) {
                    overdueCount++;
                }
            }
        });

        const completionRate = createdToday > 0 ? ((completedToday / createdToday) * 100).toFixed(0) : 0;

        res.status(200).json({
            success: true,
            data: {
                tasksCreatedToday: createdToday,
                tasksCompletedToday: completedToday,
                pendingTasks: pendingCount,
                dueTodayTasks: dueTodayCount,
                overdueTasks: overdueCount,
                completionRate: `${completionRate}%`
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getManagerDashboard = async (req, res, next) => {
    try {
        const team_id = req.query.team_id || (req.user ? req.user.team_id : null);
        let matchStage = {};
        if (team_id) matchStage.team_id = new mongoose.Types.ObjectId(team_id);

        const startOfDay = getLocalStartOfDay();
        const endOfDay = getLocalEndOfDay();

        const report = await AdvTask.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    todayStats: [
                        { $match: { created_at: { $gte: startOfDay, $lte: endOfDay } } },
                        {
                            $group: {
                                _id: "$counsellor_id",
                                created: { $sum: 1 },
                                completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
                            }
                        }
                    ],
                    overallPendingAndOverdue: [
                        { $match: { status: { $in: ["Pending", "In Progress"] } } },
                        {
                            $group: {
                                _id: "$counsellor_id",
                                pending: { $sum: 1 },
                                overdue: {
                                    $sum: {
                                        $cond: [
                                            { $lt: ["$due_date", startOfDay] }, // Approximating overdue by date for aggregation
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        // Merge facets and populate user names
        let userStatsMap = {};
        
        report[0].todayStats.forEach(stat => {
            const uid = stat._id.toString();
            if (!userStatsMap[uid]) userStatsMap[uid] = { created: 0, completed: 0, pending: 0, overdue: 0 };
            userStatsMap[uid].created = stat.created;
            userStatsMap[uid].completed = stat.completed;
        });

        report[0].overallPendingAndOverdue.forEach(stat => {
            const uid = stat._id.toString();
            if (!userStatsMap[uid]) userStatsMap[uid] = { created: 0, completed: 0, pending: 0, overdue: 0 };
            userStatsMap[uid].pending = stat.pending;
            userStatsMap[uid].overdue = stat.overdue;
        });

        const userIds = Object.keys(userStatsMap);
        const users = await AdvUser.find({ _id: { $in: userIds } }, "name email");

        const finalReport = users.map(user => {
            const stats = userStatsMap[user._id.toString()];
            const completionRate = stats.created > 0 ? ((stats.completed / stats.created) * 100).toFixed(0) : 0;
            return {
                counsellor_id: user._id,
                name: user.name,
                created: stats.created,
                completed: stats.completed,
                pending: stats.pending,
                overdue: stats.overdue,
                completionRate: `${completionRate}%`
            };
        });

        res.status(200).json({ success: true, data: finalReport });
    } catch (error) {
        next(error);
    }
};
