import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../API";
import "../attendance.css";

const AttendanceStreak = ({ userId }) => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/attendance/stats/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setAttendance(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching attendance stats", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchStats();
    }, [userId]);

    // Generate grid data for the last 53 weeks (to ensure full coverage)
    const generateGrid = () => {
        const grid = [];
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const oneYearAgo = new Date();
        oneYearAgo.setDate(today.getDate() - 364);

        const start = new Date(oneYearAgo);
        start.setDate(start.getDate() - start.getDay());

        const attendanceMap = new Set(attendance.map(a => a.date));

        for (let i = 0; i < 371; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const isPresent = attendanceMap.has(dateStr);
            const isToday = dateStr === todayStr;

            grid.push({
                date: dateStr,
                isPresent,
                isToday,
                label: `${dateStr}: ${isPresent ? 'Present' : 'Absent'}`
            });
        }
        return grid;
    };

    const gridData = generateGrid();
    const totalPresent = attendance.length;

    if (loading) return (
        <section className="nd-attendance-section nd-skeleton">
            <div style={{ height: 200 }}></div>
        </section>
    );

    return (
        <section className="nd-attendance-section">
            <div className="nd-attendance-header">
                <div className="nd-attendance-title">
                    <div className="nd-section-icon">
                        <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                        <h3>Attendance Streak</h3>
                        <p className="nd-attendance-stat-label">Your consistency over the last year</p>
                    </div>
                </div>
                <div className="nd-attendance-stats-row">
                    <div className="nd-attendance-stat">
                        <span className="nd-attendance-stat-val">{totalPresent}</span>
                        <span className="nd-attendance-stat-label">Total Days</span>
                    </div>
                </div>
            </div>

            <div className="nd-heatmap-wrapper">
                <div className="nd-heatmap-scroll">
                    <div className="nd-heatmap-grid">
                        {gridData.map((day, idx) => (
                            <div
                                key={idx}
                                className={`nd-heatmap-day ${day.isPresent ? 'nd-day-present' : ''} ${day.isToday && day.isPresent ? 'nd-day-streak' : ''}`}
                                data-date={day.label}
                                title={day.label}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="nd-heatmap-footer">
                    <div className="nd-heatmap-legend">
                        <span>Less</span>
                        <div className="nd-legend-item"><div className="nd-legend-box nd-legend-absent" /></div>
                        <div className="nd-legend-item"><div className="nd-legend-box nd-legend-present" /></div>
                        <span>More</span>
                    </div>
                    {totalPresent > 0 && (
                        <div className="nd-streak-info">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>local_fire_department</span>
                            Keep it up!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AttendanceStreak;
