import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DashboardProvider, useDashboard } from "./DashboardContext";
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
    { id: "resume-builder", path: "/advancedashboard/resume-builder", emoji: "📄", icon: "edit_document", label: "Resume Builder" },
    { id: "profile", path: "/advancedashboard/profile", emoji: "🧑", icon: "account_circle", label: "Profile" },
    { id: "payments", path: "/advancedashboard/payments", emoji: "💳", icon: "payments", label: "Payments" },
    { id: "interview-questions", path: "/advancedashboard/interview-questions", emoji: "💬", icon: "forum", label: "Interview Questions" },
    { id: "aptitude-test", path: "/advancedashboard/aptitude-test", emoji: "🧠", icon: "quiz", label: "Aptitude Test" },
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
        <aside className={`nd-sidebar ${collapsed ? "nd-sidebar-collapsed" : ""} ${mobileOpen ? "nd-sidebar-open" : ""}`}>


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
    overview: "Overview",
    training: "Training",
    practical: "Practical",
    internship: "Internship",
    exercise: "Exercise",
    placement: "Placement",
    profile: "Profile",
    payments: "Payments",
    jobs: "Browse Jobs",
    "my-job": "Job Search",
    "mock-interview": "Mock Interview",
    "resume-ats": "Resume ATS",
    "resume-builder": "Resume Builder",
    "interview-questions": "Interview Questions",
};

const Breadcrumb = () => {
    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "overview";
    const currentSection = sectionTitles[lastPart] || (lastPart.charAt(0).toUpperCase() + lastPart.slice(1));

    return (
        <div className="nd-breadcrumb">
            <span className="nd-breadcrumb-current">{currentSection}</span>
        </div>
    );
};

/* ─────────────────────────────────────────────
   INNER LAYOUT (consumes context)
───────────────────────────────────────────── */
const LayoutInner = () => {
    const { userData, enrollData, handleLogout } = useDashboard();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="nd-root">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Fixed Top Nav — passes hamburger toggle */}
            <TopNav
                userData={userData}
                enrollData={enrollData}
                onLogout={handleLogout}
                onHamburger={() => setMobileSidebarOpen((p) => !p)}
                mobileSidebarOpen={mobileSidebarOpen}
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
                        className="nd-sidebar-overlay nd-overlay-visible"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                <main className="nd-main">
                    <div className="nd-content">
                        <Breadcrumb />

                        {/* Each page renders inside Outlet */}
                        <Outlet />
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

