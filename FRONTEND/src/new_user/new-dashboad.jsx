import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import "./new-dashboad.css";

/* ─── localStorage progress helper ─── */
const getWatchedFromStorage = (enrollmentId, sessionObj, dbWatchedSessions = []) => {
    try {
        const key = `krutanic_progress_${enrollmentId}`;
        const raw = localStorage.getItem(key);
        const localWatched = raw ? JSON.parse(raw) : [];

        // Combine unique keys from both sources
        const combined = new Set([...localWatched, ...(dbWatchedSessions || [])]);
        const keys = sessionObj ? Object.keys(sessionObj) : [];
        return keys.filter((k) => combined.has(k)).length;
    } catch {
        return 0;
    }
};

/* ─────────────────────────────────────────────
   SIDEBAR NAV
───────────────────────────────────────────── */
const sidebarItems = [
    { id: "overview", emoji: "🏠", icon: "home", label: "Overview" },
    { id: "training", emoji: "📚", icon: "menu_book", label: "Training" },
    { id: "practical", emoji: "🛠", icon: "build", label: "Practical" },
    { id: "internship", emoji: "💼", icon: "work", label: "Internship" },
    { id: "placement", emoji: "🚀", icon: "rocket_launch", label: "Placement" },
    { id: "performance", emoji: "📊", icon: "bar_chart", label: "Performance" },
    { id: "payments", emoji: "💳", icon: "payments", label: "Payments" },
];

const Sidebar = ({ collapsed, setCollapsed, activeSection, setActiveSection, onLogout }) => {
    return (
        <aside className={`nd-sidebar ${collapsed ? "nd-sidebar-collapsed" : ""}`}>
            {/* Collapse Toggle */}
            <button
                className="nd-sidebar-toggle"
                onClick={() => setCollapsed((p) => !p)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className="material-symbols-outlined nd-sidebar-toggle-icon">
                    {collapsed ? "chevron_right" : "chevron_left"}
                </span>
            </button>

            {/* Nav Items */}
            <nav className="nd-sidebar-nav">
                {sidebarItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            className={`nd-sidebar-item ${isActive ? "nd-sidebar-item-active" : ""}`}
                            onClick={() => setActiveSection(item.id)}
                            title={collapsed ? item.label : ""}
                        >
                            <span
                                className={`material-symbols-outlined nd-sidebar-item-icon ${isActive ? "fill-icon" : ""}`}
                            >
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="nd-sidebar-item-label">{item.label}</span>
                            )}
                            {isActive && !collapsed && <div className="nd-sidebar-item-dot" />}
                        </button>
                    );
                })}
                <div className="nd-sidebar-divider" />
                <button
                    className="nd-sidebar-item nd-sidebar-logout"
                    onClick={onLogout}
                    title={collapsed ? "Logout" : ""}
                >
                    <span className="material-symbols-outlined nd-sidebar-item-icon">logout</span>
                    {!collapsed && <span className="nd-sidebar-item-label">Logout</span>}
                </button>
            </nav>

            {/* Bottom: collapse hint */}
            {!collapsed && (
                <div className="nd-sidebar-footer">
                    <span className="nd-sidebar-footer-text">Krutanic LMS</span>
                </div>
            )}
        </aside>
    );
};

/* ─────────────────────────────────────────────
   TOP NAV BAR
───────────────────────────────────────────── */
export const TopNav = ({ userData, enrollData, onLogout, onHamburger, mobileSidebarOpen }) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Compute progress
    const enrollment = enrollData?.[0];
    const totalSessions = enrollment?.progressStats?.totalSessionsCount || 0;

    // Merge DB watched sessions with localStorage for real-time accuracy
    const dbWatched = new Set(enrollment?.watchedSessions || []);
    const localWatched = (() => {
        try {
            const raw = localStorage.getItem(`krutanic_progress_${enrollment?._id}`);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch { return new Set(); }
    })();
    const combinedWatched = new Set([...dbWatched, ...localWatched]);
    const watchedSessions = Math.min(combinedWatched.size, totalSessions);
    const progressPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "Your Program";

    const handleMentorContact = () => {
        const name = userData?.fullname || "Student";
        const email = userData?.email || "";
        const msg = `Hello, I need mentor support.\nName: ${name}\nEmail: ${email}\nProgram: ${programName}`;
        window.open(`https://wa.me/917022936875?text=${encodeURIComponent(msg)}`, "_blank");
    };


    return (
        <header className="nd-header">
            {/* ── LEFT: Hamburger (mobile) + Logo + Program Name ── */}
            <div className="nd-header-left">
                {/* Hamburger — visible only on mobile (block md:hidden) */}
                <button
                    className="nd-hamburger block md:hidden"
                    onClick={onHamburger}
                    aria-label="Toggle navigation menu"
                >
                    <span className="material-symbols-outlined">
                        {mobileSidebarOpen ? "close" : "menu"}
                    </span>
                </button>
                <img src={logo} alt="Krutanic" className="nd-logo" />
                <div className="nd-program-pill">
                    <span className="material-symbols-outlined nd-program-icon">school</span>
                    <span className="nd-program-name">{programName}</span>
                </div>
            </div>

            {/* ── CENTER: Progress Bar ── */}
            <div className="nd-header-center">
                <div className="nd-progress-wrapper">
                    <div className="nd-progress-labels">
                        <span className="nd-progress-label-left">Program Progress</span>
                        <span className="nd-progress-label-right">{progressPct}%</span>
                    </div>
                    <div className="nd-progress-track">
                        <div className="nd-progress-fill" style={{ width: `${progressPct}%` }}>
                            <div className="nd-progress-shimmer" />
                        </div>
                    </div>
                    <div className="nd-progress-sub">
                        {watchedSessions} of {totalSessions} sessions completed
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Actions ── */}
            <div className="nd-header-right">


                {/* Mentor Contact */}
                <button className="nd-mentor-btn" onClick={handleMentorContact} title="Contact Mentor">
                    <svg className="nd-wa-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="nd-mentor-label">Mentor</span>
                </button>

                {/* Profile Avatar + Dropdown */}
                <div className="nd-icon-btn-wrap" ref={profileRef}>
                    <button
                        className="nd-avatar-btn"
                        onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
                        title="Profile"
                    >
                        <span className="nd-avatar-letter">
                            {userData?.fullname?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                        <div className="nd-avatar-status" />
                    </button>

                    {profileOpen && (
                        <div className="nd-dropdown nd-profile-dropdown">
                            <div className="nd-profile-header">
                                <div className="nd-profile-avatar-lg">
                                    {userData?.fullname?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="nd-profile-name">{userData?.fullname || "Student"}</p>
                                    <p className="nd-profile-email">{userData?.email || ""}</p>
                                </div>
                            </div>
                            <div className="nd-dropdown-divider" />
                            <Link to="/advancedashboard/profile" className="nd-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <span className="material-symbols-outlined nd-dropdown-item-icon">account_circle</span>
                                Profile
                            </Link>
                            <Link to="/advancedashboard/setting" className="nd-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <span className="material-symbols-outlined nd-dropdown-item-icon">settings</span>
                                Settings
                            </Link>

                            <div className="nd-dropdown-divider" />
                            <button className="nd-dropdown-item nd-logout-item" onClick={onLogout}>
                                <span className="material-symbols-outlined nd-dropdown-item-icon">logout</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
export const StatCard = ({ icon, label, value, status, statusText }) => {
    const statusColors = {
        green: 'nd-stat-green',
        yellow: 'nd-stat-yellow',
        red: 'nd-stat-red'
    };
    return (
        <div className={`nd-stat-card ${statusColors[status]}`}>
            <div className="nd-stat-icon-wrap">
                <span className="material-symbols-outlined nd-stat-icon">{icon}</span>
            </div>
            <div className="nd-stat-body">
                <p className="nd-stat-label">{label}</p>
                <p className="nd-stat-value">{value}</p>
                <p className="nd-stat-status">{statusText}</p>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   SECTION HEADER (reusable)
───────────────────────────────────────────── */
export const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="nd-section-hero">
        <div className="nd-section-hero-icon">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <h2 className="nd-section-hero-title">{title}</h2>
            {subtitle && <p className="nd-section-hero-sub">{subtitle}</p>}
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   TRAINING SECTION
───────────────────────────────────────────── */
const TrainingSection = ({ enrollment, navigate }) => {
    const sessions = enrollment?.domain?.session ? Object.entries(enrollment.domain.session) : [];
    const totalSessions = sessions.length;
    const watchedSessions = enrollment ? getWatchedFromStorage(enrollment._id, enrollment.domain?.session) : 0;

    if (!enrollment) {
        return (
            <div className="nd-empty-state">
                <span className="material-symbols-outlined nd-empty-icon">menu_book</span>
                <p>No enrollment found. Contact support to get started.</p>
            </div>
        );
    }

    return (
        <div className="nd-section-body">
            <SectionHeader icon="menu_book" title="Training Sessions" subtitle={`${watchedSessions} of ${totalSessions} sessions completed`} />

            {totalSessions === 0 ? (
                <div className="nd-empty-state">
                    <span className="material-symbols-outlined nd-empty-icon">video_library</span>
                    <p>No sessions found for your program.</p>
                </div>
            ) : (
                <div className="nd-session-list">
                    {sessions.map(([key, session], idx) => {
                        const isWatched = idx < watchedSessions;
                        const isCurrent = idx === watchedSessions;
                        return (
                            <div key={key} className={`nd-session-card ${isWatched ? "nd-session-watched" : ""} ${isCurrent ? "nd-session-current" : ""}`}>
                                <div className="nd-session-number">
                                    {isWatched
                                        ? <span className="material-symbols-outlined nd-session-done-icon">check_circle</span>
                                        : <span className="nd-session-num-badge">{idx + 1}</span>
                                    }
                                </div>
                                <div className="nd-session-info">
                                    <p className="nd-session-title">{session?.title || session || `Session ${idx + 1}`}</p>
                                    <p className="nd-session-meta">
                                        {isWatched ? "Completed" : isCurrent ? "In Progress" : "Not Started"}
                                        {session?.duration ? ` · ${session.duration}` : ""}
                                    </p>
                                </div>
                                <div className="nd-session-action">
                                    {isCurrent ? (
                                        <button
                                            className="nd-session-play-btn nd-session-play-active"
                                            onClick={() => navigate("/Learning", {
                                                state: { courseTitle: enrollment?.domain?.title, sessions: enrollment?.domain?.session, enrollmentId: enrollment?._id, watchedSessionsFromDB: enrollment?.watchedSessions }
                                            })}
                                        >
                                            <span className="material-symbols-outlined">play_arrow</span>
                                            Continue
                                        </button>
                                    ) : isWatched ? (
                                        <button
                                            className="nd-session-play-btn nd-session-play-done"
                                            onClick={() => navigate("/Learning", {
                                                state: { courseTitle: enrollment?.domain?.title, sessions: enrollment?.domain?.session, enrollmentId: enrollment?._id, watchedSessionsFromDB: enrollment?.watchedSessions }
                                            })}
                                        >
                                            <span className="material-symbols-outlined">replay</span>
                                            Rewatch
                                        </button>
                                    ) : (
                                        <span className="nd-session-locked">
                                            <span className="material-symbols-outlined">lock</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   PRACTICAL SECTION
───────────────────────────────────────────── */
const practicalTasks = [
    { id: 1, title: "Build a REST API with Node.js", type: "Project", score: 85, maxScore: 100, submitted: true, dueDate: "Completed" },
    { id: 2, title: "React Component Architecture", type: "Assignment", score: 72, maxScore: 100, submitted: true, dueDate: "Completed" },
    { id: 3, title: "Database Schema Design", type: "Project", score: null, maxScore: 100, submitted: false, dueDate: "Due: Mar 10" },
    { id: 4, title: "Full Stack Mini Project", type: "Capstone", score: null, maxScore: 100, submitted: false, dueDate: "Due: Mar 25" },
    { id: 5, title: "Resume & Portfolio Review", type: "Submission", score: null, maxScore: 100, submitted: false, dueDate: "Due: Apr 5" },
];

const PracticalSection = ({ navigate }) => {
    const submitted = practicalTasks.filter(t => t.submitted);
    const avgScore = submitted.length > 0 ? Math.round(submitted.reduce((a, t) => a + t.score, 0) / submitted.length) : 0;

    return (
        <div className="nd-section-body">
            <SectionHeader icon="build" title="Practical Tasks" subtitle={`${submitted.length}/${practicalTasks.length} submitted · Avg score: ${avgScore}%`} />

            <div className="nd-practical-grid">
                {practicalTasks.map((task) => (
                    <div key={task.id} className={`nd-practical-card ${task.submitted ? "nd-practical-done" : ""}`}>
                        <div className="nd-practical-card-top">
                            <span className={`nd-practical-type-badge ${task.type === "Capstone" ? "nd-badge-gold" : task.type === "Project" ? "nd-badge-blue" : "nd-badge-gray"}`}>
                                {task.type}
                            </span>
                            {task.submitted && (
                                <span className="nd-practical-score">{task.score}/{task.maxScore}</span>
                            )}
                        </div>
                        <p className="nd-practical-title">{task.title}</p>
                        <div className="nd-practical-footer">
                            <span className={`nd-practical-due ${task.submitted ? "nd-practical-due-done" : ""}`}>
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                                    {task.submitted ? "check_circle" : "schedule"}
                                </span>
                                {task.dueDate}
                            </span>
                            {!task.submitted && (
                                <button className="nd-practical-submit-btn">Submit</button>
                            )}
                        </div>
                        {task.submitted && (
                            <div className="nd-practical-progress-bar">
                                <div className="nd-practical-progress-fill" style={{ width: `${task.score}%` }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   INTERNSHIP SECTION
───────────────────────────────────────────── */
const InternshipSection = ({ enrollment }) => {
    const startMonth = enrollment?.internshipstartsmonth || null;
    const endMonth = enrollment?.internshipendsmonth || null;
    const programName = enrollment?.domain?.title || enrollment?.domain || enrollment?.program || "Your Program";

    const stages = [
        {
            id: 1, icon: "school", label: "Program Enrolled",
            desc: "Successfully joined the program and started training.",
            date: enrollment?.createdAt ? new Date(enrollment.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Enrolled",
            done: true
        },
        {
            id: 2, icon: "assignment", label: "Training Complete",
            desc: "Complete all training sessions to unlock internship.",
            date: "After Training",
            done: false
        },
        {
            id: 3, icon: "work", label: "Internship Started",
            desc: `Internship begins. ${startMonth ? `Starts: ${startMonth}` : "Dates to be assigned."}`,
            date: startMonth || "TBD",
            done: false
        },
        {
            id: 4, icon: "workspace_premium", label: "Internship Completed",
            desc: `Full internship period completed. ${endMonth ? `Ends: ${endMonth}` : ""}`,
            date: endMonth || "TBD",
            done: false
        },
        {
            id: 5, icon: "emoji_events", label: "Certificate Issued",
            desc: "Internship certificate will be issued upon completion.",
            date: "After Internship",
            done: false
        },
    ];

    // Determine progress: first stage is always done
    const currentStep = 2; // mock: step 2 in progress (training)

    return (
        <div className="nd-section-body">
            <SectionHeader icon="work" title="Internship Journey" subtitle={`Program: ${programName}`} />

            {/* Info cards */}
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

            {/* Timeline */}
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

/* ─────────────────────────────────────────────
   PLACEMENT SECTION
───────────────────────────────────────────── */
const placementChecklist = [
    { id: 1, label: "Resume Updated", done: true },
    { id: 2, label: "LinkedIn Profile Optimized", done: true },
    { id: 3, label: "GitHub Portfolio Created", done: false },
    { id: 4, label: "Mock Interview Completed", done: false },
    { id: 5, label: "ATS Score > 70%", done: false },
    { id: 6, label: "Job Applications Sent (5+)", done: false },
];

const PlacementSection = ({ navigate }) => {
    const readiness = Math.round((placementChecklist.filter(c => c.done).length / placementChecklist.length) * 100);
    const circumference = 2 * Math.PI * 44;

    return (
        <div className="nd-section-body">
            <SectionHeader icon="rocket_launch" title="Placement Readiness" subtitle="Track your job readiness step by step" />

            <div className="nd-placement-top">
                {/* Readiness Ring */}
                <div className="nd-placement-ring-wrap">
                    <svg viewBox="0 0 100 100" className="nd-placement-ring-svg">
                        <circle cx="50" cy="50" r="44" className="nd-placement-ring-track" />
                        <circle
                            cx="50" cy="50" r="44"
                            className="nd-placement-ring-fill"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - readiness / 100)}
                        />
                    </svg>
                    <div className="nd-placement-ring-label">
                        <span className="nd-placement-ring-pct">{readiness}%</span>
                        <span className="nd-placement-ring-sub">Ready</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="nd-placement-actions">
                    <button className="nd-placement-action-btn nd-action-primary" onClick={() => navigate("/Jobs")}>
                        <span className="material-symbols-outlined">work_history</span>
                        Browse Jobs
                    </button>
                    <button className="nd-placement-action-btn nd-action-secondary" onClick={() => navigate("/Mock")}>
                        <span className="material-symbols-outlined">record_voice_over</span>
                        Mock Interview
                    </button>
                    <button className="nd-placement-action-btn nd-action-tertiary" onClick={() => navigate("/ATS")}>
                        <span className="material-symbols-outlined">document_scanner</span>
                        Resume ATS Check
                    </button>
                </div>
            </div>

            {/* Checklist */}
            <div className="nd-placement-checklist">
                <p className="nd-checklist-title">Placement Checklist</p>
                {placementChecklist.map((item) => (
                    <div key={item.id} className={`nd-checklist-item ${item.done ? "nd-checklist-done" : ""}`}>
                        <span className="material-symbols-outlined nd-checklist-icon">
                            {item.done ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span className="nd-checklist-label">{item.label}</span>
                        {item.done && <span className="nd-checklist-badge">Done</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PERFORMANCE SECTION
───────────────────────────────────────────── */
const PerformanceSection = ({ enrollment }) => {
    const totalSessions = enrollment?.domain?.session ? Object.keys(enrollment.domain.session).length : 0;
    const watchedSessions = enrollment ? getWatchedFromStorage(enrollment._id, enrollment.domain?.session, enrollment.watchedSessions) : 0;
    const trainingPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;

    const metrics = [
        { label: "Training Sessions", value: trainingPct, icon: "menu_book", color: "#6366f1" },
        { label: "Assignment Score", value: 78, icon: "assignment", color: "#f15b29" },
        { label: "Mock Interview", value: 65, icon: "record_voice_over", color: "#06b6d4" },
        { label: "Practical Tasks", value: 72, icon: "build", color: "#10b981" },
        { label: "Placement Readiness", value: Math.round((placementChecklist.filter(c => c.done).length / placementChecklist.length) * 100), icon: "rocket_launch", color: "#f59e0b" },
    ];

    const overall = Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length);

    return (
        <div className="nd-section-body">
            <SectionHeader icon="bar_chart" title="Performance Overview" subtitle={`Overall Score: ${overall}%`} />

            {/* Overall Score Ring */}
            <div className="nd-perf-overall-wrap">
                <div className="nd-perf-ring-wrap">
                    <svg viewBox="0 0 120 120" className="nd-perf-ring-svg">
                        <circle cx="60" cy="60" r="52" className="nd-perf-ring-track" />
                        <circle
                            cx="60" cy="60" r="52"
                            className="nd-perf-ring-fill"
                            strokeDasharray={`${2 * Math.PI * 52}`}
                            strokeDashoffset={`${2 * Math.PI * 52 * (1 - overall / 100)}`}
                        />
                    </svg>
                    <div className="nd-perf-ring-label">
                        <span className="nd-perf-ring-pct">{overall}%</span>
                        <span className="nd-perf-ring-sub">Overall</span>
                    </div>
                </div>
                <div className="nd-perf-grade-wrap">
                    <div className={`nd-perf-grade ${overall >= 80 ? "nd-grade-a" : overall >= 60 ? "nd-grade-b" : "nd-grade-c"}`}>
                        {overall >= 80 ? "A" : overall >= 60 ? "B" : "C"}
                    </div>
                    <p className="nd-perf-grade-label">Grade</p>
                    <p className="nd-perf-grade-sub">
                        {overall >= 80 ? "Excellent — Keep it up!" : overall >= 60 ? "Good — Push harder!" : "Needs Improvement"}
                    </p>
                </div>
            </div>

            {/* Metric Bars */}
            <div className="nd-perf-metrics">
                {metrics.map((m) => (
                    <div key={m.label} className="nd-perf-metric-row">
                        <div className="nd-perf-metric-left">
                            <span className="material-symbols-outlined nd-perf-icon" style={{ color: m.color }}>{m.icon}</span>
                            <span className="nd-perf-metric-label">{m.label}</span>
                        </div>
                        <div className="nd-perf-bar-wrap">
                            <div className="nd-perf-bar-track">
                                <div
                                    className="nd-perf-bar-fill"
                                    style={{ width: `${m.value}%`, background: m.color }}
                                />
                            </div>
                            <span className="nd-perf-metric-pct">{m.value}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PAYMENTS SECTION
───────────────────────────────────────────── */
const PaymentsSection = ({ enrollment, userData }) => {
    const programPrice = enrollment?.programPrice ?? 0;
    const paidAmount = enrollment?.paidAmount ?? 0;
    const remaining = Math.max(0, programPrice - paidAmount);
    const isFullyPaid = enrollment?.status === "fullPaid";
    const payPct = programPrice > 0 ? Math.round((paidAmount / programPrice) * 100) : 0;

    const handlePaySupport = () => {
        const name = userData?.fullname || "Student";
        const email = userData?.email || "";
        const msg = `Hello, I need help with my payment.\nName: ${name}\nEmail: ${email}\nProgram: ${enrollment?.program || ""}\nPaid: ₹${paidAmount.toLocaleString()} / ₹${programPrice.toLocaleString()}`;
        window.open(`https://wa.me/917022936875?text=${encodeURIComponent(msg)}`, "_blank");
    };

    return (
        <div className="nd-section-body">
            <SectionHeader icon="payments" title="Payment Details" subtitle="Your fee payment breakdown" />

            {!enrollment ? (
                <div className="nd-empty-state">
                    <span className="material-symbols-outlined nd-empty-icon">payments</span>
                    <p>No enrollment data found.</p>
                </div>
            ) : (
                <>
                    {/* Status Banner */}
                    <div className={`nd-payment-status-banner ${isFullyPaid ? "nd-pay-banner-green" : "nd-pay-banner-red"}`}>
                        <span className="material-symbols-outlined nd-pay-status-icon">
                            {isFullyPaid ? "check_circle" : "pending"}
                        </span>
                        <div>
                            <p className="nd-pay-status-title">{isFullyPaid ? "Payment Complete" : "Payment Pending"}</p>
                            <p className="nd-pay-status-sub">
                                {isFullyPaid ? "Your program fee is fully paid. Thank you!" : `₹${remaining.toLocaleString("en-IN")} remaining to clear your dues.`}
                            </p>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="nd-payment-card">
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Program</span>
                            <span className="nd-payment-row-value">{enrollment?.program || "—"}</span>
                        </div>
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Domain</span>
                            <span className="nd-payment-row-value">{enrollment?.domain?.title || enrollment?.domain || "—"}</span>
                        </div>
                        <div className="nd-payment-row nd-payment-divider">
                            <span className="nd-payment-row-label">Program Fee</span>
                            <span className="nd-payment-row-value nd-pay-total">₹{programPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Amount Paid</span>
                            <span className="nd-payment-row-value nd-pay-green">₹{paidAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Remaining</span>
                            <span className={`nd-payment-row-value ${remaining > 0 ? "nd-pay-red" : "nd-pay-green"}`}>
                                ₹{remaining.toLocaleString("en-IN")}
                            </span>
                        </div>
                        {enrollment?.monthOpted && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Opted Month</span>
                                <span className="nd-payment-row-value">{enrollment.monthOpted}</span>
                            </div>
                        )}
                        {enrollment?.clearPaymentMonth && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Payment Due Month</span>
                                <span className="nd-payment-row-value nd-pay-red">{enrollment.clearPaymentMonth}</span>
                            </div>
                        )}
                        {enrollment?.modeofpayment && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Payment Mode</span>
                                <span className="nd-payment-row-value">{enrollment.modeofpayment}</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="nd-payment-progress-wrap">
                        <div className="nd-payment-progress-labels">
                            <span className="nd-pp-label">Amount Paid</span>
                            <span className="nd-pp-pct">{payPct}%</span>
                        </div>
                        <div className="nd-payment-progress-track">
                            <div
                                className={`nd-payment-progress-fill ${isFullyPaid ? "nd-pp-fill-green" : "nd-pp-fill-orange"}`}
                                style={{ width: `${payPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Support Button */}
                    {!isFullyPaid && (
                        <button className="nd-payment-support-btn" onClick={handlePaySupport}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Contact Support for Payment
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   CALENDAR SECTION
───────────────────────────────────────────── */
const CalendarSection = ({ enrollment }) => {
    const today = new Date();
    const startMonth = enrollment?.internshipstartsmonth;
    const endMonth = enrollment?.internshipendsmonth;
    const enrolledDate = enrollment?.createdAt ? new Date(enrollment.createdAt) : null;

    const milestones = [
        {
            icon: "school",
            label: "Program Enrolled",
            date: enrolledDate ? enrolledDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—",
            color: "#6366f1", done: true
        },
        {
            icon: "menu_book",
            label: "Training Phase",
            date: "Ongoing",
            color: "#f15b29", done: false, current: true
        },
        {
            icon: "assignment",
            label: "Practicals Submission",
            date: "Mar – Apr 2026",
            color: "#06b6d4", done: false
        },
        {
            icon: "work",
            label: "Internship Starts",
            date: startMonth || "To be assigned",
            color: "#10b981", done: false
        },
        {
            icon: "event_available",
            label: "Internship Ends",
            date: endMonth || "To be assigned",
            color: "#f59e0b", done: false
        },
        {
            icon: "workspace_premium",
            label: "Certificate Issued",
            date: "After Internship",
            color: "#8b5cf6", done: false
        },
        {
            icon: "rocket_launch",
            label: "Placement Drive",
            date: "Based on readiness",
            color: "#ec4899", done: false
        },
    ];

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

/* ─────────────────────────────────────────────
   OVERVIEW SECTION (existing)
───────────────────────────────────────────── */
const OverviewSection = ({ enrollment, loading, progressPct, watchedSessions, totalSessions, programName, isFullyPaid, navigate,
    completionStatus, completionText, assignmentScore, assignmentStatus, assignmentText,
    internshipStage, internshipStatus, internshipText, readinessScore, readinessStatus, readinessText,
    paymentStatusColor, paymentStatusText, programCompletion }) => (
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
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="nd-stat-card nd-skeleton" />
                ))}
            </div>
        ) : (
            <div className="nd-stats-grid">
                <StatCard icon="school" label="Program Completion" value={`${programCompletion}%`} status={completionStatus} statusText={completionText} />
                <StatCard icon="assignment" label="Assignment Score" value={`${assignmentScore}%`} status={assignmentStatus} statusText={assignmentText} />
                <StatCard icon="work" label="Internship Status" value={internshipStage} status={internshipStatus} statusText={internshipText} />
                <StatCard icon="trending_up" label="Placement Readiness" value={`${readinessScore}%`} status={readinessStatus} statusText={readinessText} />
                <StatCard icon="payments" label="Payment Status" value={isFullyPaid ? "Paid" : "Pending"} status={paymentStatusColor} statusText={paymentStatusText} />
            </div>
        )}

        {/* Program Overview */}
        <section className="nd-section">
            <div className="nd-section-header">
                <h2 className="nd-section-title">
                    <span className="material-symbols-outlined nd-section-icon">school</span>
                    Program Overview
                </h2>
                <Link to="/EnrolledCourses" className="nd-section-link">View All →</Link>
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
                            onClick={() => navigate("/Learning", {
                                state: {
                                    courseTitle: enrollment?.domain?.title,
                                    sessions: enrollment?.domain?.session,
                                    enrollmentId: enrollment?._id,
                                    watchedSessionsFromDB: enrollment?.watchedSessions
                                }
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
    </>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const NewDashboard = () => {
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [enrollData, setEnrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const hasFetched = useRef(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [userRes, enrollRes] = await Promise.all([
                userId ? axios.get(`${API}/users`, { params: { userId } }) : Promise.resolve({ data: null }),
                userEmail ? axios.get(`${API}/enrollments`, { params: { userEmail } }) : Promise.resolve({ data: [] }),
            ]);
            setUserData(userRes.data);
            setEnrollData(Array.isArray(enrollRes.data) ? enrollRes.data : []);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchAll();
    }, []);

    const handleLogout = () => {
        toast.success("Logged out successfully!");
        setTimeout(() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            navigate("/Login");
        }, 1500);
    };

    const enrollment = enrollData?.[0];
    const totalSessions = enrollment?.domain?.session ? Object.keys(enrollment.domain.session).length : 0;
    const watchedSessions = enrollment ? getWatchedFromStorage(enrollment._id, enrollment.domain?.session, enrollment.watchedSessions) : 0;
    const progressPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "—";
    const paymentStatus = enrollment?.status || "—";
    const isFullyPaid = paymentStatus === "fullPaid";

    const programCompletion = progressPct;
    const completionStatus = programCompletion >= 75 ? 'green' : programCompletion >= 50 ? 'yellow' : 'red';
    const completionText = programCompletion >= 75 ? 'Good Progress' : programCompletion >= 50 ? 'Needs Attention' : 'Action Required';

    const assignmentScore = 78;
    const assignmentStatus = assignmentScore >= 80 ? 'green' : assignmentScore >= 60 ? 'yellow' : 'red';
    const assignmentText = assignmentScore >= 80 ? 'Great Work' : assignmentScore >= 60 ? 'Can Improve' : 'Needs Focus';

    const internshipStage = 'In Progress';
    const internshipStatus = internshipStage === 'Completed' ? 'green' : internshipStage === 'In Progress' ? 'yellow' : 'red';
    const internshipText = internshipStage === 'Completed' ? 'Completed' : internshipStage === 'In Progress' ? 'Ongoing' : 'Not Started';

    const readinessScore = 72;
    const readinessStatus = readinessScore >= 75 ? 'green' : readinessScore >= 50 ? 'yellow' : 'red';
    const readinessText = readinessScore >= 75 ? 'Ready' : readinessScore >= 50 ? 'Prepare More' : 'Not Ready';

    const paymentStatusColor = isFullyPaid ? 'green' : 'red';
    const paymentStatusText = isFullyPaid ? 'Paid in Full' : 'Payment Due';

    // Section title map for breadcrumb
    const sectionTitles = {
        overview: "Overview", training: "Training", practical: "Practical",
        internship: "Internship", placement: "Placement", performance: "Performance",
        payments: "Payments", calendar: "Calendar"
    };

    const renderSection = () => {
        switch (activeSection) {
            case "training":
                return <TrainingSection enrollment={enrollment} navigate={navigate} />;
            case "practical":
                return <PracticalSection navigate={navigate} />;
            case "internship":
                return <InternshipSection enrollment={enrollment} />;
            case "placement":
                return <PlacementSection navigate={navigate} />;
            case "performance":
                return <PerformanceSection enrollment={enrollment} />;
            case "payments":
                return <PaymentsSection enrollment={enrollment} userData={userData} />;
            case "calendar":
                return <CalendarSection enrollment={enrollment} />;
            default:
                return (
                    <OverviewSection
                        enrollment={enrollment}
                        loading={loading}
                        progressPct={progressPct}
                        watchedSessions={watchedSessions}
                        totalSessions={totalSessions}
                        programName={programName}
                        isFullyPaid={isFullyPaid}
                        navigate={navigate}
                        completionStatus={completionStatus}
                        completionText={completionText}
                        assignmentScore={assignmentScore}
                        assignmentStatus={assignmentStatus}
                        assignmentText={assignmentText}
                        internshipStage={internshipStage}
                        internshipStatus={internshipStatus}
                        internshipText={internshipText}
                        readinessScore={readinessScore}
                        readinessStatus={readinessStatus}
                        readinessText={readinessText}
                        paymentStatusColor={paymentStatusColor}
                        paymentStatusText={paymentStatusText}
                        programCompletion={programCompletion}
                    />
                );
        }
    };

    return (
        <div className="nd-root">
            <Toaster position="top-center" reverseOrder={false} />

            {/* ── FIXED TOP NAV ── */}
            <TopNav userData={userData} enrollData={enrollData} onLogout={handleLogout} />

            {/* ── BODY: Sidebar + Main ── */}
            <div className="nd-body">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    onLogout={handleLogout}
                />

                {/* ── MAIN SCROLLABLE CONTENT ── */}
                <main className="nd-main">
                    <div className="nd-content">

                        {/* Breadcrumb */}
                        <div className="nd-breadcrumb">
                            <button className="nd-breadcrumb-home" onClick={() => setActiveSection("overview")}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>home</span>
                                Dashboard
                            </button>
                            {activeSection !== "overview" && (
                                <>
                                    <span className="nd-breadcrumb-sep">›</span>
                                    <span className="nd-breadcrumb-current">{sectionTitles[activeSection]}</span>
                                </>
                            )}
                        </div>

                        {/* Welcome Banner (only overview) */}
                        {activeSection === "overview" && (
                            <div className="nd-welcome-banner">
                                <div className="nd-welcome-text">
                                    <p className="nd-welcome-greeting">
                                        Welcome back, <span className="nd-welcome-name">{userData?.fullname?.split(" ")[0] || "Student"}</span>
                                    </p>
                                    <p className="nd-welcome-sub">Here's what's happening with your learning journey today.</p>
                                </div>
                            </div>
                        )}

                        {/* Active Section Content */}
                        {loading && activeSection !== "overview" ? (
                            <div className="nd-section-skeleton">
                                <div className="nd-skeleton nd-sk-hero" />
                                <div className="nd-skeleton nd-sk-card" />
                                <div className="nd-skeleton nd-sk-card" />
                                <div className="nd-skeleton nd-sk-card" />
                            </div>
                        ) : (
                            renderSection()
                        )}

                        {/* Footer */}
                        <footer className="nd-footer">
                            © 2026 All Rights Reserved. Powered by <strong>Krutanic</strong>.
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NewDashboard;
