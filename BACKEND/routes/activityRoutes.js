const express = require("express");
const router = express.Router();
const AdvTeam = require("../models/CreateAdvTeam");

// In-memory cache for Live Sales Ops to reduce MongoDB charges
const activeUsersMap = new Map();
let isCacheInitialized = false;
const DB_FLUSH_INTERVAL = 20 * 60 * 1000; // 20 minutes

// Flush cache to DB periodically
setInterval(async () => {
    if (activeUsersMap.size === 0) return;
    
    // We only flush users whose data needs to be saved (we could filter by dirty flag, but for simplicity we flush all active ones)
    const entries = Array.from(activeUsersMap.entries());
    
    try {
        const bulkOps = entries.map(([userId, userBase]) => {
            let updateOp = {
                $set: { 
                    lastActiveAt: userBase.lastActiveAt,
                    currentScreen: userBase.currentScreen
                }
            };
            
            // Only update todayActiveTime if we have pending increments
            if (userBase.isNewDay) {
                updateOp.$set.todayActiveTime = userBase.todayActiveTime;
                userBase.isNewDay = false; // reset flag
            } else if (userBase.pendingIncrement > 0) {
                updateOp.$inc = { todayActiveTime: userBase.pendingIncrement };
                userBase.pendingIncrement = 0; // reset counter after flush
            }
            
            return {
                updateOne: {
                    filter: { _id: userId },
                    update: updateOp
                }
            };
        });

        if (bulkOps.length > 0) {
            await AdvTeam.bulkWrite(bulkOps);
            console.log(`[LiveMonitor] Flushed ${bulkOps.length} heartbeats to DB`);
        }
        
        // Cleanup inactive users from memory (inactive for more than 10 mins)
        const tenMinsAgo = Date.now() - 10 * 60 * 1000;
        for (const [userId, userBase] of activeUsersMap.entries()) {
            if (new Date(userBase.lastActiveAt).getTime() < tenMinsAgo && userBase.pendingIncrement === 0) {
                activeUsersMap.delete(userId);
            }
        }
        
    } catch (error) {
        console.error("Error flushing heartbeats:", error);
    }
}, DB_FLUSH_INTERVAL);

// PUT: Update heartbeat and active time
router.put("/heartbeat", async (req, res) => {
    try {
        const { userId, currentScreen } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const now = new Date();
        let increment = 30; // Heartbeat interval in seconds
        
        let userBase = activeUsersMap.get(userId);
        
        if (!userBase) {
            // First time seeing this user since server start, fetch from DB
            const user = await AdvTeam.findById(userId).select("fullname email designation lastActiveAt todayActiveTime currentScreen status");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            userBase = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                designation: user.designation,
                lastActiveAt: user.lastActiveAt || now,
                todayActiveTime: user.todayActiveTime || 0,
                currentScreen: user.currentScreen,
                pendingIncrement: 0,
                isNewDay: false
            };
        }

        const lastActive = new Date(userBase.lastActiveAt);
        const isNewDay = now.toDateString() !== lastActive.toDateString();
        
        if (isNewDay) {
            userBase.todayActiveTime = increment;
            userBase.pendingIncrement = increment;
            userBase.isNewDay = true;
        } else {
            userBase.todayActiveTime += increment;
            userBase.pendingIncrement += increment;
        }

        userBase.lastActiveAt = now;
        if (currentScreen) {
            userBase.currentScreen = currentScreen;
        }
        
        // Save to in-memory cache (NO DB WRITE HERE!)
        activeUsersMap.set(userId, userBase);

        res.status(200).json({ 
            success: true, 
            todayActiveTime: userBase.todayActiveTime 
        });
    } catch (error) {
        console.error("Heartbeat error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET: Fetch all active users for Admin monitor
router.get("/live-status", async (req, res) => {
    try {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        
        // If server just restarted, prime the cache from DB once to avoid empty dashboard
        if (!isCacheInitialized) {
            const recentUsers = await AdvTeam.find({
                lastActiveAt: { $gte: new Date(fiveMinutesAgo) },
                status: "Active"
            }).select("fullname email designation lastActiveAt todayActiveTime currentScreen status");
            
            for (const u of recentUsers) {
                if (!activeUsersMap.has(u._id.toString())) {
                    activeUsersMap.set(u._id.toString(), {
                        _id: u._id,
                        fullname: u.fullname,
                        email: u.email,
                        designation: u.designation,
                        lastActiveAt: u.lastActiveAt,
                        todayActiveTime: u.todayActiveTime || 0,
                        currentScreen: u.currentScreen,
                        pendingIncrement: 0,
                        isNewDay: false
                    });
                }
            }
            isCacheInitialized = true;
        }

        const activeUsers = [];
        for (const userBase of activeUsersMap.values()) {
            if (new Date(userBase.lastActiveAt).getTime() >= fiveMinutesAgo) {
                activeUsers.push({
                    _id: userBase._id,
                    fullname: userBase.fullname,
                    email: userBase.email,
                    designation: userBase.designation,
                    lastActiveAt: userBase.lastActiveAt,
                    todayActiveTime: userBase.todayActiveTime,
                    currentScreen: userBase.currentScreen
                });
            }
        }
        
        res.status(200).json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching live status" });
    }
});

module.exports = router;
