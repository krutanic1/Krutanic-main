import React from "react";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";

const CalendarPage = () => {
    const { enrollment, loading } = useDashboard();

    const startMonth = enrollment?.internshipstartsmonth;
    const endMonth = enrollment?.internshipendsmonth;
    const enrolledDate = enrollment?.createdAt ? new Date(enrollment.createdAt) : null;

    const milestones = [
        {
            icon: "school", label: "Program Enrolled",
            date: enrolledDate ? enrolledDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—",
            color: "#6366f1", done: true,
        },
        {
            icon: "menu_book", label: "Training Phase",
            date: "Ongoing", color: "#f15b29", done: false, current: true,
        },
        {
            icon: "assignment", label: "Practicals Submission",
            date: "Mar – Apr 2026", color: "#06b6d4", done: false,
        },
        {
            icon: "work", label: "Internship Starts",
            date: startMonth || "To be assigned", color: "#10b981", done: false,
        },
        {
            icon: "event_available", label: "Internship Ends",
            date: endMonth || "To be assigned", color: "#f59e0b", done: false,
        },
        {
            icon: "workspace_premium", label: "Certificate Issued",
            date: "After Internship", color: "#8b5cf6", done: false,
        },
        {
            icon: "rocket_launch", label: "Placement Drive",
            date: "Based on readiness", color: "#ec4899", done: false,
        },
    ];

    if (loading) {
        return (
            <div className="nd-section-skeleton">
                <div className="nd-skeleton nd-sk-hero" />
                <div className="nd-skeleton nd-sk-card" />
                <div className="nd-skeleton nd-sk-card" />
            </div>
        );
    }

    return (
        <div className="nd-section-body">
            <SectionHeader icon="calendar_month" title="Program Calendar" subtitle="Your complete learning journey timeline" />

            <div className="nd-calendar-list">
                {milestones.map((m, i) => (
                    <div key={i} className={`nd-cal-item ${m.done ? "nd-cal-done" : ""} ${m.current ? "nd-cal-current" : ""}`}>
                        <div className="nd-cal-icon-wrap" style={{ background: `${m.color}18`, border: `2px solid ${m.color}30` }}>
                            <span className="material-symbols-outlined nd-cal-icon" style={{ color: m.color }}>{m.icon}</span>
                        </div>
                        <div className="nd-cal-body">
                            <div className="nd-cal-label-row">
                                <span className="nd-cal-label">{m.label}</span>
                                {m.done && <span className="nd-cal-badge-done">Completed</span>}
                                {m.current && <span className="nd-cal-badge-current">In Progress</span>}
                            </div>
                            <span className="nd-cal-date">{m.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarPage;
