import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDashboard, getThumbnail } from "../DashboardContext";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { StatCard } from "../new-dashboad";
import { AssignmentMatrixSection, InternshipReadinessSection } from "../components/MatrixSections";
import AttendanceStreak from "../components/AttendanceStreak";

const OverviewPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        enrollment, loading: contextLoading,
        progressPct, totalSessions,
        programName, isFullyPaid,
    } = useDashboard();

    const { metrics, loading: metricsLoading, refetchMetrics } = useDashboardMetrics();
    const loading = contextLoading || metricsLoading;

    // Re-fetch matrix data every time user lands on Overview page
    useEffect(() => {
        refetchMetrics();
    }, [location.pathname, refetchMetrics]);

    // 1. Program Completion
    // Primary: use progressPct from enrollment context (real-time from AdvEnroll)
    // Fallback: use DashboardMetrics percentage
    const programCompletion = progressPct || metrics?.programCompletion?.percentage || 0;
    const completionStatus = programCompletion >= 80 ? "green" : programCompletion >= 50 ? "yellow" : "red";
    const completionText = programCompletion >= 80 ? "Good Progress" : programCompletion >= 50 ? "Can Improve" : "Needs Improvement";

    // 2. Assignment Score — best score across all levels
    const assignmentMatrix = Array.isArray(metrics?.assignmentMatrix) ? metrics.assignmentMatrix : [];
    const assignmentScore = assignmentMatrix.length > 0
        ? Math.max(...assignmentMatrix.map(l => l.bestScore || 0))
        : 0;
    const assignmentStatus = assignmentScore >= 100 ? "green" : assignmentScore > 0 ? "yellow" : "red";
    const assignmentText = assignmentScore >= 100 ? "Perfect Score" : assignmentScore > 0 ? "In Progress" : "Not Started";

    // 3. Internship Progress — % of 24 weeks completed
    const weeklyProgress = Array.isArray(metrics?.internshipReadiness?.weeklyProgress) ? metrics.internshipReadiness.weeklyProgress : [];
    const doneWeeks = weeklyProgress.filter(w => w.status === 'Submitted' || w.status === 'Approved').length;
    const internshipPct = Math.round((doneWeeks / 24) * 100);
    const internshipStatus = internshipPct >= 100 ? "green" : internshipPct > 0 ? "yellow" : "red";
    const iPhase = `${doneWeeks}/24 Weeks Done`;

    // 4. Placement Readiness
    const readinessScore = metrics?.placementReadiness?.scorePercentage || 0;

    const paymentStatusColor = isFullyPaid ? "green" : "red";
    const paymentStatusText = isFullyPaid ? "Paid in Full" : "Payment Due";

    return (
        <>
            {/* Welcome Banner */}
            <div className="nd-welcome-banner">
                <div className="nd-welcome-text">
                    <p className="nd-welcome-greeting">
                        Here's your program overview
                    </p>
                    <p className="nd-welcome-sub">Click a section in the sidebar to explore Training, Internship, Payments, and more.</p>
                </div>
            </div>

            {/* Stat Cards */}
            {loading ? (
                <div className="nd-stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="nd-stat-card nd-skeleton" />
                    ))}
                </div>
            ) : (
                <div className="nd-stats-grid">
                    <StatCard icon="school" label="Program Completion" value={`${programCompletion}%`} status={completionStatus} statusText={completionText} />
                    <StatCard icon="assignment" label="Assignment Score" value={`${assignmentScore}%`} status={assignmentStatus} statusText={assignmentText} />
                    <StatCard icon="work" label="Internship Status" value={`${internshipPct}%`} status={internshipStatus} statusText={iPhase} />
                    <StatCard icon="payments" label="Payment Status" value={isFullyPaid ? "Paid" : "Pending"} status={paymentStatusColor} statusText={paymentStatusText} />
                </div>
            )}

            {/* Attendance Streak Heatmap */}
            <AttendanceStreak userId={localStorage.getItem("userId")} />

            {/* Program Overview Card */}
            <section className="nd-section">
                <div className="nd-section-header">
                    <h2 className="nd-section-title">
                        <span className="material-symbols-outlined nd-section-icon">school</span>
                        Program Overview
                    </h2>
                    <Link to="/advancedashboard/training" className="nd-section-link">View All →</Link>
                </div>

                {loading ? (
                    <div className="nd-program-card nd-skeleton" style={{ height: 160 }} />
                ) : enrollment ? (
                    <div className="nd-program-card">
                        <div className="nd-program-card-left">
                            <div className="nd-program-badge">
                                <span className="material-symbols-outlined">auto_stories</span>
                            </div>
                            <div>
                                <p className="nd-program-card-title">{programName}</p>
                                <p className="nd-program-card-sub">{enrollment?.domain?.category || "Professional Program"}</p>
                                <div className="nd-program-tags">
                                    <span className="nd-tag nd-tag-blue">{totalSessions} Sessions</span>
                                    <span className={`nd-tag ${isFullyPaid ? "nd-tag-green" : "nd-tag-red"}`}>
                                        {isFullyPaid ? "Active" : "Payment Pending"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="nd-program-card-right">
                            <div className="nd-program-progress-ring">
                                <svg viewBox="0 0 80 80" className="nd-ring-svg">
                                    <circle cx="40" cy="40" r="34" className="nd-ring-track" />
                                    <circle
                                        cx="40" cy="40" r="34"
                                        className="nd-ring-fill"
                                        strokeDasharray={`${2 * Math.PI * 34}`}
                                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPct / 100)}`}
                                    />
                                </svg>
                                <div className="nd-ring-label">
                                    <span className="nd-ring-pct">{progressPct}%</span>
                                    <span className="nd-ring-sub">Done</span>
                                </div>
                            </div>
                            <button
                                className="nd-start-btn"
                                onClick={() => navigate("/advancedashboard/learning", {
                                    state: {
                                        courseTitle: enrollment?.domain?.title,
                                        sessions: null, // Let NewLearning fetch them dynamically
                                        enrollmentId: enrollment?._id,
                                        watchedSessionsFromDB: enrollment?.watchedSessions,
                                        thumbnail: getThumbnail(enrollment?.domain?.title || ""),
                                        isAdvance: enrollment?.advance || !!enrollment?.domainId?.sessions || !!localStorage.getItem("isAdvance"), // Help the learning page know which API to use
                                    },
                                })}
                            >
                                <span className="material-symbols-outlined">play_arrow</span>
                                Continue Learning
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="nd-empty-state">
                        <span className="material-symbols-outlined nd-empty-icon">school</span>
                        <p>No enrollment found. Contact support to get started.</p>
                    </div>
                )}
            </section>

            {/* Assignment Score Matrix */}
            <AssignmentMatrixSection
                assignmentMatrix={metrics?.assignmentMatrix}
                loading={metricsLoading}
            />

            {/* 24-Week Internship Readiness */}
            <InternshipReadinessSection
                internshipReadiness={metrics?.internshipReadiness}
                loading={metricsLoading}
            />
        </>
    );
};

export default OverviewPage;
