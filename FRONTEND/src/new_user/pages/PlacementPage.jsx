import React, { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";

/* ── Guide content for each checklist item ── */
const guideContent = {
    resume: {
        title: "How to Build a Strong Resume",
        icon: "description",
        steps: [
            { title: "Choose a clean, ATS-friendly template", desc: "Use a single-column layout with standard fonts like Inter, Arial, or Calibri. Avoid heavy graphics and tables." },
            { title: "Write a compelling summary", desc: "Start with 2–3 lines summarizing your skills, experience level, and career goal." },
            { title: "Highlight key skills", desc: "List 6–8 relevant technical & soft skills that match your target job descriptions." },
            { title: "Quantify achievements", desc: "Use numbers: 'Improved page load speed by 40%' is stronger than 'Improved performance'." },
            { title: "Add projects & certifications", desc: "Include 2–3 impactful projects with tech stack and outcomes. Add Krutanic certification." },
            { title: "Proofread everything", desc: "Check for typos, consistent formatting, correct dates, and proper grammar." },
        ],
    },
    linkedin: {
        title: "How to Optimize Your LinkedIn Profile",
        icon: "person",
        steps: [
            { title: "Use a professional headline", desc: "Go beyond your job title — e.g. 'Full Stack Developer | React & Node.js | Open to Opportunities'." },
            { title: "Write an engaging About section", desc: "Describe who you are, what you do, and what you're looking for in 3–5 short paragraphs." },
            { title: "Add a professional photo", desc: "Use a high-quality headshot with a clean background. Profiles with photos get 21x more views." },
            { title: "Complete Experience & Education", desc: "Add all relevant roles with bullet-point descriptions. Include internships and part-time work." },
            { title: "Showcase skills & get endorsements", desc: "Add your top 10 skills and ask colleagues to endorse them." },
            { title: "Engage with content", desc: "Share articles, comment on posts, and connect with people in your industry." },
        ],
    },
    github: {
        title: "How to Create an Impressive GitHub Portfolio",
        icon: "code",
        steps: [
            { title: "Pin your best 6 repositories", desc: "Select projects that showcase diverse skills — frontend, backend, full-stack." },
            { title: "Write detailed README files", desc: "Each repo should have: project description, setup instructions, screenshots, and tech stack." },
            { title: "Keep your contribution graph green", desc: "Commit regularly — even small fixes count. Aim for consistent activity." },
            { title: "Use proper folder structure", desc: "Organize code professionally with clear directory naming and separation of concerns." },
            { title: "Add a profile README", desc: "Create a special repo (your-username/your-username) with an intro, skills, and project links." },
            { title: "Include live demo links", desc: "Deploy projects on Vercel, Netlify, or Render and link them in your README." },
        ],
    },
    mockInterview: {
        title: "How to Prepare for Mock Interviews",
        icon: "record_voice_over",
        steps: [
            { title: "Practice common questions", desc: "Prepare answers for 'Tell me about yourself', 'Why this role?', and behavioral questions." },
            { title: "Use the STAR method", desc: "Structure answers: Situation → Task → Action → Result. This keeps responses clear and impactful." },
            { title: "Practice coding problems", desc: "Solve 2–3 problems daily on LeetCode/HackerRank focusing on arrays, strings, and trees." },
            { title: "Record yourself", desc: "Use your phone to record mock answers. Review for filler words, pace, and confidence." },
            { title: "Schedule AI mock interviews", desc: "Use the Mock Interview tool in your dashboard to practice with AI-powered feedback." },
            { title: "Prepare questions to ask", desc: "Always have 2–3 thoughtful questions about the team, growth opportunities, or tech stack." },
        ],
    },
    ats: {
        title: "How to Improve Your ATS Score",
        icon: "document_scanner",
        steps: [
            { title: "Match keywords from job descriptions", desc: "Copy key skills and phrases from the JD into your resume naturally." },
            { title: "Use standard section headings", desc: "Stick to: 'Experience', 'Education', 'Skills', 'Projects' — ATS scanners expect these." },
            { title: "Avoid images and graphics", desc: "ATS cannot parse images, logos, charts, or icons — use plain text only." },
            { title: "Use a .docx or .pdf format", desc: "Most ATS systems prefer .docx. If using PDF, ensure it's text-based (not scanned)." },
            { title: "Run an ATS check", desc: "Use the Resume ATS Check tool in your dashboard to scan your resume and get a score." },
            { title: "Aim for 70%+ match score", desc: "Iterate on your resume until your ATS score is above 70% for target roles." },
        ],
    },
};

/* ── Checklist items with guide keys ── */
const placementChecklist = [
    { id: 1, label: "Resume Updated", guideKey: "resume", ariaLabel: "Learn how to build a good resume" },
    { id: 2, label: "LinkedIn Profile Optimized", guideKey: "linkedin", ariaLabel: "Learn how to optimize LinkedIn profile" },
    { id: 3, label: "GitHub Portfolio Created", guideKey: "github", ariaLabel: "Learn how to create an impressive GitHub portfolio" },
    { id: 4, label: "Mock Interview Completed", guideKey: "mockInterview", ariaLabel: "Learn how to prepare and practice mock interviews" },
    { id: 5, label: "ATS Score > 70%", guideKey: "ats", ariaLabel: "Learn how to improve ATS score and use keywords" },
];

/* ── Guide Modal ── */
const GuideModal = memo(({ guide, onClose }) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (guide) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [guide, onClose]);

    if (!guide) return null;

    // Fix event bubbling issue rather than using e.stopPropagation()
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="nd-guide-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
        >
            <div className="nd-guide-modal">
                {/* Header */}
                <div className="nd-guide-header">
                    <div className="nd-guide-header-left">
                        <span className="material-symbols-outlined nd-guide-header-icon" aria-hidden="true">{guide.icon}</span>
                        <h3 className="nd-guide-title">{guide.title}</h3>
                    </div>
                    <button className="nd-guide-close" onClick={onClose} aria-label="Close guide">
                        <span className="material-symbols-outlined" aria-hidden="true">close</span>
                    </button>
                </div>

                {/* Steps */}
                <div className="nd-guide-steps">
                    {guide.steps.map((step, i) => (
                        <div key={i} className="nd-guide-step">
                            <div className="nd-guide-step-num" aria-hidden="true">{i + 1}</div>
                            <div className="nd-guide-step-body">
                                <p className="nd-guide-step-title">{step.title}</p>
                                <p className="nd-guide-step-desc">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="nd-guide-footer">
                    <button className="nd-guide-done-btn" onClick={onClose}>
                        <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
});

/* ── Placement Page ── */
const PlacementPage = () => {
    const navigate = useNavigate();
    const { loading } = useDashboard();
    const [activeGuide, setActiveGuide] = useState(null);

    // Memoize the close handler to prevent GuideModal from re-rendering unecessarily
    const handleCloseModal = useCallback(() => {
        setActiveGuide(null);
    }, []);

    if (loading) {
        return (
            <div className="nd-section-skeleton">
                <div className="nd-skeleton nd-sk-hero" />
                <div className="nd-skeleton nd-sk-card" />
            </div>
        );
    }

    return (
        <div className="nd-section-body">
            <SectionHeader icon="rocket_launch" title="Placement Readiness" subtitle="Track your job readiness step by step" />

            {/* Quick Actions */}
            <div className="nd-placement-actions">
                <button className="nd-placement-action-btn nd-action-primary" onClick={() => navigate("/advancedashboard/my-job")}>
                    <span className="material-symbols-outlined">work_history</span>
                    Browse Jobs
                </button>
                <button className="nd-placement-action-btn nd-action-secondary" onClick={() => navigate("/advancedashboard/mock-interview")}>
                    <span className="material-symbols-outlined">record_voice_over</span>
                    Mock Interview
                </button>
                <button className="nd-placement-action-btn nd-action-tertiary" onClick={() => navigate("/advancedashboard/resume-ats")}>
                    <span className="material-symbols-outlined">document_scanner</span>
                    Resume ATS Check
                </button>
            </div>

            {/* Clickable Placement Checklist */}
            <div className="nd-placement-checklist">
                <p className="nd-checklist-title">Placement Checklist</p>
                <p className="nd-checklist-subtitle">Click any item to view a step-by-step guide</p>
                {placementChecklist.map((item) => (
                    <button
                        key={item.id}
                        className="nd-checklist-item nd-checklist-clickable"
                        onClick={() => setActiveGuide(guideContent[item.guideKey])}
                        aria-label={item.ariaLabel}
                    >
                        <span className="nd-checklist-label">{item.label}</span>
                        <span className="nd-checklist-right">
                            <span className="material-symbols-outlined nd-checklist-arrow" aria-hidden="true">chevron_right</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* Guide Modal */}
            <GuideModal guide={activeGuide} onClose={handleCloseModal} />
        </div>
    );
};

export default PlacementPage;
