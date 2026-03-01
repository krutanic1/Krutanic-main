import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";
import { TopNav } from "./new-dashboad";
import "./new-dashboad.css";

/* ─────────────────────────────────────────────
   SIDEBAR — URL-aware active highlight
───────────────────────────────────────────── */
const sidebarItems = [
    { id: "overview", path: "/advancedashboard", emoji: "🏠", icon: "home", label: "Overview" },
    { id: "training", path: "/advancedashboard/training", emoji: "📚", icon: "menu_book", label: "Training" },
    { id: "practical", path: "/advancedashboard/practical", emoji: "🛠", icon: "build", label: "Practical" },
    { id: "internship", path: "/advancedashboard/internship", emoji: "💼", icon: "work", label: "Internship" },
    { id: "exercise", path: "/advancedashboard/exercise", emoji: "🏋️", icon: "fitness_center", label: "Exercise" },
    { id: "placement", path: "/advancedashboard/placement", emoji: "🚀", icon: "rocket_launch", label: "Placement" },
    { id: "certificates", path: "/advancedashboard/certificates", emoji: "🎖️", icon: "workspace_premium", label: "Certificates" },
    { id: "resume-builder", path: "/advancedashboard/resume-builder", emoji: "📄", icon: "edit_document", label: "Resume Builder" },
    { id: "profile", path: "/advancedashboard/profile", emoji: "🧑", icon: "account_circle", label: "Profile" },
    { id: "payments", path: "/advancedashboard/payments", emoji: "💳", icon: "payments", label: "Payments" },
];

const Sidebar = ({ collapsed, setCollapsed, onLogout, mobileOpen, setMobileOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (item) => {
        if (item.id === "overview") {
            return location.pathname === "/advancedashboard" || location.pathname === "/advancedashboard/";
        }
        return location.pathname.startsWith(item.path);
    };

    const handleNav = (path) => {
        navigate(path);
        // Close mobile sidebar after navigation
        if (setMobileOpen) setMobileOpen(false);
    };

    return (
        <aside className={`nd-sidebar hidden md:block ${collapsed ? "nd-sidebar-collapsed" : ""} ${mobileOpen ? "nd-sidebar-open" : ""}`}>
            {/* Mobile Close Button - visible only on mobile when sidebar is open */}
            {mobileOpen && (
                <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-700">Menu</span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined text-gray-600">close</span>
                    </button>
                </div>
            )}

            {/* Collapse Toggle (desktop only) */}
            <button
                className="nd-sidebar-toggle hidden md:flex"
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
                    const active = isActive(item);

                    if (item.external) {
                        return (
                            <a
                                key={item.id}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nd-sidebar-item"
                                title={collapsed && !mobileOpen ? item.label : ""}
                            >
                                <span className="material-symbols-outlined nd-sidebar-item-icon">
                                    {item.icon}
                                </span>
                                {(!collapsed || mobileOpen) && <span className="nd-sidebar-item-label">{item.label}</span>}
                            </a>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            className={`nd-sidebar-item ${active ? "nd-sidebar-item-active" : ""}`}
                            onClick={() => handleNav(item.path)}
                            title={collapsed && !mobileOpen ? item.label : ""}
                        >
                            <span className={`material-symbols-outlined nd-sidebar-item-icon ${active ? "fill-icon" : ""}`}>
                                {item.icon}
                            </span>
                            {(!collapsed || mobileOpen) && <span className="nd-sidebar-item-label">{item.label}</span>}
                            {active && (!collapsed || mobileOpen) && <div className="nd-sidebar-item-dot" />}
                        </button>
                    );
                })}

                <div className="nd-sidebar-divider" />
                <button
                    className="nd-sidebar-item nd-sidebar-logout"
                    onClick={onLogout}
                    title={collapsed && !mobileOpen ? "Logout" : ""}
                >
                    <span className="material-symbols-outlined nd-sidebar-item-icon">logout</span>
                    {(!collapsed || mobileOpen) && <span className="nd-sidebar-item-label">Logout</span>}
                </button>
            </nav>

            {(!collapsed || mobileOpen) && (
                <div className="nd-sidebar-footer">
                    <span className="nd-sidebar-footer-text">Krutanic LMS</span>
                </div>
            )}
        </aside>
    );
};

/* ─────────────────────────────────────────────
   BREADCRUMB — derives label from URL
───────────────────────────────────────────── */
const sectionTitles = {
    overview: "Overview", training: "Training", practical: "Practical",
    internship: "Internship", placement: "Placement",
    payments: "Payments", certificates: "Certificates",
    jobs: "Browse Jobs", "my-job": "Job Search", "mock-interview": "Mock Interview", "resume-ats": "Resume ATS",
    "resume-builder": "Resume Builder",
    "profile": "Profile",
};

const Breadcrumb = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const segment = location.pathname.split("/").pop(); // e.g. "training"
    const currentSection = sectionTitles[segment] || "Overview";
    const isOverview = !segment || segment === "advancedashboard";

    return (
        <div className="nd-breadcrumb">
            <button className="nd-breadcrumb-home" onClick={() => navigate("/advancedashboard")}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>home</span>
                Dashboard
            </button>
            {!isOverview && (
                <>
                    <span className="nd-breadcrumb-sep">›</span>
                    <span className="nd-breadcrumb-current">{currentSection}</span>
                </>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   INNER LAYOUT (consumes context)
───────────────────────────────────────────── */
const LayoutInner = () => {
    const { userData, enrollData, userProfile, handleLogout } = useDashboard();
    const { metrics } = useDashboardMetrics();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const extProgressPct = metrics?.programCompletion?.percentage || 0;
    const extTotalSessions = metrics?.programCompletion?.totalSessions || 0;
    const extWatchedSessions = metrics?.programCompletion?.completedSessions || 0;

    return (
        <div className="nd-root">
            <Toaster position="top-center" reverseOrder={false} />

            <TopNav
                userData={userData}
                enrollData={enrollData}
                userProfile={userProfile}
                onLogout={handleLogout}
                onHamburger={() => setMobileSidebarOpen((p) => !p)}
                mobileSidebarOpen={mobileSidebarOpen}
                extProgressPct={extProgressPct}
                extTotalSessions={extTotalSessions}
                extWatchedSessions={extWatchedSessions}
            />

            {/* Body */}
            <div className="nd-body">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                    onLogout={handleLogout}
                    mobileOpen={mobileSidebarOpen}
                    setMobileOpen={setMobileSidebarOpen}
                />

                {/* Mobile overlay — tap to close sidebar */}
                {mobileSidebarOpen && (
                    <div
                        className="nd-sidebar-overlay md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMobileSidebarOpen(false)}
                        aria-label="Close sidebar overlay"
                    />
                )}

                <main className="nd-main">
                    <div className="nd-content">
                        <Breadcrumb />

                        {/* Each page renders inside Outlet */}
                        <React.Suspense fallback={
                            <div className="nd-stats-grid">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="nd-stat-card nd-skeleton" />
                                ))}
                            </div>
                        }>
                            <Outlet />
                        </React.Suspense>

                        <footer className="nd-footer">
                            © 2026 All Rights Reserved. Powered by <strong>Krutanic</strong>.
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   EXPORTED LAYOUT WRAPPER (provides context)
───────────────────────────────────────────── */
const AdvanceDashboardLayout = () => (
    <DashboardProvider>
        <LayoutInner />
    </DashboardProvider>
);

export default AdvanceDashboardLayout;

