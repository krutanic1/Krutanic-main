import React, { useState, useEffect, useMemo } from "react";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";
import axios from 'axios';
import API from "../../API";

const InternshipPage = () => {
    const { enrollment, loading } = useDashboard();
    const [certData, setCertData] = useState(null);

    const startMonth = enrollment?.internshipstartsmonth || null;
    const endMonth = enrollment?.internshipendsmonth || null;
    const programName = enrollment?.domain?.title || enrollment?.domain || enrollment?.program || "Your Program";

    const progress = useMemo(() => {
        if (!enrollment?.projectProgress) return {};
        return enrollment.projectProgress instanceof Map
            ? Object.fromEntries(enrollment.projectProgress)
            : (typeof enrollment.projectProgress === 'object' && enrollment.projectProgress !== null ? enrollment.projectProgress : {});
    }, [enrollment]);

    const completedDays = useMemo(() => {
        let count = 0;
        for (const val of Object.values(progress)) {
            const isDone = typeof val === "boolean" ? val : !!val?.completed;
            if (isDone) count++;
        }
        return count;
    }, [progress]);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const userEmail = localStorage.getItem("userEmail");
                if (!userEmail) return;
                const response = await axios.get(`${API}/getcertificate?email=${userEmail}`);
                if (response.data) {
                    setCertData(response.data);
                }
            } catch (error) {
                // If not found, ignore
            }
        };
        fetchCertificate();
    }, []);

    // Determine conditions
    const isInternshipStarted = completedDays > 0;
    const isInternshipCompleted = completedDays >= 120; // 24 weeks * 5 days
    const isCertificateIssued = certData?.delivered || certData?.url;

    // Determine current step (1 to 5)
    let currentStep = 2; // Default starting point after enrollment
    if (isInternshipStarted) currentStep = 3;
    if (isInternshipCompleted) currentStep = 4;
    // According to user, if they received the certificate anyway, it should be marked as done
    if (certData) {
        currentStep = isCertificateIssued ? 5 : 4; // At least completed if they applied/received it
    }

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
            date: "After Training",
            done: true, // Assuming training is considered done if they are here, or it should be checked against video progress if available. Making it true to allow step 3 to clearly activate next.
        },
        {
            id: 3, icon: "work", label: "Internship Started",
            desc: `Internship begins. ${startMonth ? `Starts: ${startMonth}` : "Dates to be assigned."}`,
            date: startMonth || "TBD",
            done: isInternshipStarted || certData,
        },
        {
            id: 4, icon: "workspace_premium", label: "Internship Completed",
            desc: `Full internship period completed. ${endMonth ? `Ends: ${endMonth}` : ""}`,
            date: endMonth || "TBD",
            done: isInternshipCompleted || certData,
        },
        {
            id: 5, icon: "emoji_events", label: "Certificate Issued",
            desc: "Internship certificate will be issued upon completion.",
            date: "After Internship",
            done: isCertificateIssued,
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
                        <p className="nd-info-value">{currentStep >= 4 ? "Completed" : currentStep === 3 ? "In Progress" : startMonth ? "Scheduled" : "Pending"}</p>
                    </div>
                </div>
            </div>

            <div className="nd-timeline">
                {stages.map((stage, idx) => {
                    // Logic mapped from stages array 'done' property
                    const isDone = stage.done;
                    const isCurrent = (currentStep === stage.id) && !stage.done;

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
                                    <span className={`nd-timeline-date ${isCurrent || isDone ? "nd-tl-date-active" : ""}`}>{stage.date}</span>
                                </div>
                                <p className="nd-timeline-desc">
                                    {stage.id === 3 && isInternshipStarted && !certData ? (
                                        <span>You are currently logging your project progress!</span>
                                    ) : stage.id === 4 && isInternshipCompleted && !certData ? (
                                        <span>You have completed all 24 weeks of the diary.</span>
                                    ) : (
                                        stage.desc
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InternshipPage;
