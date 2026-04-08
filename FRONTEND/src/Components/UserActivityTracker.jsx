import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import API from '../API';

/**
 * UserActivityTracker - Background component that tracks screen active time.
 * Uses a "Master Tab" logic to ensure only one tab sends heartbeats.
 */
const UserActivityTracker = ({ userId, currentScreen }) => {
    const heartbeatInterval = useRef(null);
    const lastActivityTime = useRef(Date.now());
    const isMasterTab = useRef(false);
    
    // BroadcastChannel for cross-tab communication
    const channel = useRef(new BroadcastChannel('user_activity_sync'));

    useEffect(() => {
        if (!userId) return;

        // 1. Tab Management: Election of Master Tab
        const electMaster = () => {
            const masterId = localStorage.getItem(`active_master_${userId}`);
            const now = Date.now();
            
            // If no master or master hasn't checked in for 40s, try to become master
            if (!masterId || (now - parseInt(masterId)) > 40000) {
                localStorage.setItem(`active_master_${userId}`, now.toString());
                isMasterTab.current = true;
                // console.log("Current tab became MASTER for activity tracking");
            } else {
                isMasterTab.current = false;
            }
        };

        // 2. Activity Detection
        const resetActivity = () => {
            lastActivityTime.current = Date.now();
        };

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, resetActivity));

        // 3. Heartbeat Function
        const sendHeartbeat = async () => {
            // Only send if this is the master tab
            if (!isMasterTab.current) {
                electMaster(); // Try to become master if current master is gone
                return;
            }

            // Update master lease in localStorage
            localStorage.setItem(`active_master_${userId}`, Date.now().toString());

            // Check conditions: tab must be visible AND user must be active (not idle > 5 mins)
            const isVisible = document.visibilityState === 'visible';
            const isIdle = (Date.now() - lastActivityTime.current) > 5 * 60 * 1000;

            if (isVisible && !isIdle) {
                try {
                    await axios.put(`${API}/api/activity/heartbeat`, {
                        userId,
                        currentScreen: currentScreen || window.location.pathname
                    });
                } catch (error) {
                    console.error("Failed to send activity pulse", error);
                }
            }
        };

        // Initialize Master Election
        electMaster();
        
        // Start Heartbeat Timer (every 30 seconds)
        heartbeatInterval.current = setInterval(sendHeartbeat, 30000);

        // Cleanup
        return () => {
            clearInterval(heartbeatInterval.current);
            events.forEach(event => document.removeEventListener(event, resetActivity));
            if (isMasterTab.current) {
                localStorage.removeItem(`active_master_${userId}`);
            }
            channel.current.close();
        };
    }, [userId, currentScreen]);

    return null; // Background component
};

export default UserActivityTracker;
