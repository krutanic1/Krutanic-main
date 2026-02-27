import React from "react";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";

const InternshipPage = () => {
    const { enrollment, loading } = useDashboard();
    const startMonth = enrollment?.internshipstartsmonth || null;
    const endMonth = enrollment?.internshipendsmonth || null;
    const programName = enrollment?.domain?.title || enrollment?.domain || enrollment?.program || "Your Program";

    const stages = [
        {
            id: 1, icon: "school", label: "Program Enrolled",
            desc: "Successfully joined the program and started training.",
            date: enrollment?.createdAt ? new Date(enrollment.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Enrolled",
            done: true,
        },
        {
            id: 2, icon: "assignment", label: "Training Complete",
            desc: "Complete all training sessions to unlock internship.",
            date: "After Training", done: false,
        },
        {
            id: 3, icon: "work", label: "Internship Started",
            desc: `Internship begins. ${startMonth ? `Starts: ${startMonth}` : "Dates to be assigned."}`,
            date: startMonth || "TBD", done: false,
        },
        {
            id: 4, icon: "workspace_premium", label: "Internship Completed",
            desc: `Full internship period completed. ${endMonth ? `Ends: ${endMonth}` : ""}`,
            date: endMonth || "TBD", done: false,
        },
        {
            id: 5, icon: "emoji_events", label: "Certificate Issued",
            desc: "Internship certificate will be issued upon completion.",
            date: "After Internship", done: false,
        },
    ];

    const currentStep = 2;

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
            <SectionHeader icon="work" title="Internship Journey" subtitle={`Program: ${programName}`} />

            <div className="nd-internship-info-row">
                <div className="nd-internship-info-card nd-info-blue">
                    <span className="material-symbols-outlined nd-info-icon">calendar_month</span>
                    <div>
                        <p className="nd-info-label">Start Month</p>
                        <p className="nd-info-value">{startMonth || "To be assigned"}</p>
                    </div>
                </div>
                <div className="nd-internship-info-card nd-info-green">
                    <span className="material-symbols-outlined nd-info-icon">event_available</span>
                    <div>
                        <p className="nd-info-label">End Month</p>
                        <p className="nd-info-value">{endMonth || "To be assigned"}</p>
                    </div>
                </div>
                <div className="nd-internship-info-card nd-info-orange">
                    <span className="material-symbols-outlined nd-info-icon">hourglass_top</span>
                    <div>
                        <p className="nd-info-label">Status</p>
                        <p className="nd-info-value">{startMonth ? "Scheduled" : "Pending"}</p>
                    </div>
                </div>
            </div>

            <div className="nd-timeline">
                {stages.map((stage, idx) => {
                    const isDone = stage.done || idx < currentStep - 1;
                    const isCurrent = idx === currentStep - 1;
                    return (
                        <div key={stage.id} className={`nd-timeline-step ${isDone ? "nd-tl-done" : ""} ${isCurrent ? "nd-tl-current" : ""}`}>
                            <div className="nd-timeline-left">
                                <div className="nd-timeline-dot">
                                    {isDone
                                        ? <span className="material-symbols-outlined nd-tl-icon">check</span>
                                        : isCurrent
                                            ? <span className="material-symbols-outlined nd-tl-icon">{stage.icon}</span>
                                            : <span className="nd-tl-num">{stage.id}</span>
                                    }
                                </div>
                                {idx < stages.length - 1 && <div className={`nd-timeline-line ${isDone ? "nd-tl-line-done" : ""}`} />}
                            </div>
                            <div className="nd-timeline-content">
                                <div className="nd-timeline-header">
                                    <p className="nd-timeline-label">{stage.label}</p>
                                    <span className={`nd-timeline-date ${isCurrent ? "nd-tl-date-active" : ""}`}>{stage.date}</span>
                                </div>
                                <p className="nd-timeline-desc">{stage.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InternshipPage;
