import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/LOGO3.png";
import "./new-dashboad.css";

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
    { id: "calendar", emoji: "📅", icon: "calendar_month", label: "Calendar" },
];

const Sidebar = ({ collapsed, setCollapsed, activeSection, setActiveSection }) => {
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
const TopNav = ({ userData, enrollData, onLogout }) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Compute progress
    const enrollment = enrollData?.[0];
    const totalSessions = enrollment?.domain?.session ? Object.keys(enrollment.domain.session).length : 0;
    const watchedSessions = enrollment?.watchedSessions ?? Math.floor(totalSessions * 0.4); // fallback demo
    const progressPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "Your Program";

    const handleMentorContact = () => {
        const name = userData?.fullname || "Student";
        const email = userData?.email || "";
        const msg = `Hello, I need mentor support.\nName: ${name}\nEmail: ${email}\nProgram: ${programName}`;
        window.open(`https://wa.me/917022936875?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const notifications = [
        { id: 1, icon: "school", text: "New session added to your course", time: "2h ago", unread: true },
        { id: 2, icon: "workspace_premium", text: "Certificate eligibility coming soon", time: "1d ago", unread: true },
        { id: 3, icon: "celebration", text: "New event: Talent Hunt 2026", time: "2d ago", unread: false },
    ];
    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <header className="nd-header">
            {/* ── LEFT: Logo + Program Name ── */}
            <div className="nd-header-left">
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

                {/* Notification Bell */}
                <div className="nd-icon-btn-wrap" ref={notifRef}>
                    <button
                        className="nd-icon-btn"
                        onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
                        title="Notifications"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {unreadCount > 0 && <span className="nd-badge">{unreadCount}</span>}
                    </button>

                    {notifOpen && (
                        <div className="nd-dropdown nd-notif-dropdown">
                            <div className="nd-dropdown-header">
                                <span>Notifications</span>
                                <span className="nd-badge-inline">{unreadCount} new</span>
                            </div>
                            <div className="nd-notif-list">
                                {notifications.map((n) => (
                                    <div key={n.id} className={`nd-notif-item ${n.unread ? "nd-notif-unread" : ""}`}>
                                        <div className="nd-notif-icon-wrap">
                                            <span className="material-symbols-outlined nd-notif-icon">{n.icon}</span>
                                        </div>
                                        <div className="nd-notif-body">
                                            <p className="nd-notif-text">{n.text}</p>
                                            <p className="nd-notif-time">{n.time}</p>
                                        </div>
                                        {n.unread && <div className="nd-notif-dot" />}
                                    </div>
                                ))}
                            </div>
                            <div className="nd-dropdown-footer">
                                <button className="nd-dropdown-footer-btn">Mark all as read</button>
                            </div>
                        </div>
                    )}
                </div>

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
                            <Link to="/Setting" className="nd-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <span className="material-symbols-outlined nd-dropdown-item-icon">settings</span>
                                Settings
                            </Link>
                            <Link to="/Dashboard" className="nd-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <span className="material-symbols-outlined nd-dropdown-item-icon">dashboard</span>
                                Old Dashboard
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
const StatCard = ({ icon, label, value, color, sub }) => (
    <div className="nd-stat-card">
        <div className={`nd-stat-icon-wrap nd-stat-${color}`}>
            <span className="material-symbols-outlined nd-stat-icon">{icon}</span>
        </div>
        <div className="nd-stat-body">
            <p className="nd-stat-label">{label}</p>
            <p className="nd-stat-value">{value}</p>
            {sub && <p className="nd-stat-sub">{sub}</p>}
        </div>
    </div>
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
    const watchedSessions = enrollment?.watchedSessions ?? Math.floor(totalSessions * 0.4);
    const progressPct = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;
    const programName = enrollment?.domain?.title || enrollment?.program || "—";
    const paymentStatus = enrollment?.status || "—";
    const isFullyPaid = paymentStatus === "fullPaid";

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
                />

                {/* ── MAIN SCROLLABLE CONTENT ── */}
                <main className="nd-main">
                    <div className="nd-content">

                        {/* Welcome Banner */}
                        <div className="nd-welcome-banner">
                            <div className="nd-welcome-text">
                                <p className="nd-welcome-greeting">
                                    Welcome back, <span className="nd-welcome-name">{userData?.fullname?.split(" ")[0] || "Student"}</span> 👋
                                </p>
                                <p className="nd-welcome-sub">Here's what's happening with your learning journey today.</p>
                            </div>
                            <div className="nd-welcome-badge">
                                <span className="material-symbols-outlined nd-welcome-badge-icon">emoji_events</span>
                                <div>
                                    <p className="nd-welcome-badge-label">Current Streak</p>
                                    <p className="nd-welcome-badge-value">7 Days 🔥</p>
                                </div>
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
                                <StatCard icon="menu_book" label="Enrolled Courses" value={enrollData.length} color="blue" sub="Active programs" />
                                <StatCard icon="play_circle" label="Sessions Completed" value={watchedSessions} color="orange" sub={`of ${totalSessions} total`} />
                                <StatCard icon="trending_up" label="Overall Progress" value={`${progressPct}%`} color="green" sub="Keep it up!" />
                                <StatCard
                                    icon="payments"
                                    label="Payment Status"
                                    value={isFullyPaid ? "Full Paid" : "Pending"}
                                    color={isFullyPaid ? "green" : "red"}
                                    sub={isFullyPaid ? "All clear ✓" : "Action needed"}
                                />
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

                        {/* Quick Actions */}
                        <section className="nd-section">
                            <div className="nd-section-header">
                                <h2 className="nd-section-title">
                                    <span className="material-symbols-outlined nd-section-icon">bolt</span>
                                    Quick Actions
                                </h2>
                            </div>
                            <div className="nd-quick-grid">
                                {[
                                    { icon: "play_circle", label: "Continue Learning", path: "/Learning", color: "orange" },
                                    { icon: "menu_book", label: "My Courses", path: "/EnrolledCourses", color: "blue" },
                                    { icon: "person", label: "My Jobs", path: "/MyJob", color: "purple" },
                                    { icon: "assignment", label: "Mock Prep", path: "/MockInterview", color: "teal" },
                                    { icon: "edit_note", label: "Exercises", path: "/Exercise", color: "pink" },
                                    { icon: "fact_check", label: "ATS Checker", path: "/ResumeATS", color: "green" },
                                    { icon: "celebration", label: "Events", path: "/events", color: "yellow" },
                                    { icon: "settings", label: "Settings", path: "/Setting", color: "gray" },
                                ].map((item) => (
                                    <Link key={item.path} to={item.path} className={`nd-quick-card nd-quick-${item.color}`}>
                                        <span className="material-symbols-outlined nd-quick-icon">{item.icon}</span>
                                        <span className="nd-quick-label">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>

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
