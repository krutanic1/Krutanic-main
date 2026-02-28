import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";
import API from "../../API";
import { useQuery } from "@tanstack/react-query";

/* ══════════════════════════════════════════════════════
   COURSE → PROJECT CATALOGUE
   10 projects per domain, each with title, desc, level
══════════════════════════════════════════════════════ */
const levelColors = { Beginner: "#22c55e", Intermediate: "#f59e0b", Advanced: "#ef4444" };
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/* ══════════════════════════════════════════════════════
   COMPONENT: Confirmation Modal
   ══════════════════════════════════════════════════════ */
const ConfirmModal = ({ project, onConfirm, onCancel, loading }) => (
    <div className="nd-guide-overlay" onClick={onCancel}>
        <div className="nd-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nd-confirm-icon-wrap">
                <span className="material-symbols-outlined">lock</span>
            </div>
            <h3 className="nd-confirm-title">Lock This Project?</h3>
            <p className="nd-confirm-project">{project?.title}</p>
            <p className="nd-confirm-warning">
                ⚠️ Once you select a project, it <strong>cannot be changed</strong>. Are you sure you want to continue?
            </p>
            <div className="nd-confirm-actions">
                <button className="nd-confirm-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
                <button className="nd-confirm-lock" onClick={onConfirm} disabled={loading}>
                    {loading ? "Locking..." : "Confirm & Lock Project"}
                </button>
            </div>
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════
   COMPONENT: Day Detail Modal
   ══════════════════════════════════════════════════════ */
const DayDetailModal = ({ week, dayIdx, taskTitle, phase, dayData, onSave, onClose }) => {
    const logData = typeof dayData === "object" && dayData !== null ? dayData : {};

    const [diary, setDiary] = useState(logData.diary || "");
    const [repoUrl, setRepoUrl] = useState(logData.repoUrl || "");
    const [deployUrl, setDeployUrl] = useState(logData.deployUrl || "");
    const [notesUrl, setNotesUrl] = useState(logData.notesUrl || "");

    const suggestions = [
        "Break the problem down into logical steps.",
        "Write down key takeaways in your Learning Diary.",
        "Commit your code frequently with clear messages."
    ];

    const handleSaveClick = () => {
        if (!diary || diary.trim().length < 20) {
            toast.error("Learning Diary must be at least 20 characters long.");
            return;
        }
        onSave({ completed: true, diary, repoUrl, deployUrl, notesUrl });
    };

    return (
        <div className="nd-guide-overlay" onClick={onClose}>
            <div className="nd-day-modal" onClick={(e) => e.stopPropagation()}>
                <div className="nd-day-modal-header">
                    <div className="nd-day-modal-header-left">
                        <span className="material-symbols-outlined nd-day-header-icon">edit_document</span>
                        <div>
                            <h3 className="nd-day-modal-title">Week {week} - {dayNames[dayIdx]}</h3>
                            <p className="nd-day-modal-subtitle">{taskTitle}</p>
                        </div>
                    </div>
                    <button className="nd-guide-close" onClick={onClose} aria-label="Close modal">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="nd-day-modal-body">
                    {/* Learning Diary */}
                    <div className="nd-day-section">
                        <label className="nd-day-label-main">
                            <span className="material-symbols-outlined">book</span>
                            Learning Diary <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
                        </label>
                        <textarea
                            className="nd-day-textarea"
                            placeholder="Write today's learnings, challenges, and key takeaways... (min 20 chars)"
                            value={diary}
                            onChange={(e) => setDiary(e.target.value)}
                        />
                    </div>

                    {/* Git Repo & Links */}
                    <div className="nd-day-section">
                        <label className="nd-day-label-main">
                            <span className="material-symbols-outlined">link</span>
                            Git Repo & Links
                        </label>
                        <input
                            type="url"
                            className="nd-day-input"
                            placeholder="GitHub Repository URL"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <input
                                type="url"
                                className="nd-day-input"
                                placeholder="Deployment URL (Optional)"
                                value={deployUrl}
                                onChange={(e) => setDeployUrl(e.target.value)}
                            />
                            <input
                                type="url"
                                className="nd-day-input"
                                placeholder="Notes/Docs URL (Optional)"
                                value={notesUrl}
                                onChange={(e) => setNotesUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Suggestions Box */}
                    <div className="nd-day-suggestions">
                        <div className="nd-day-suggestions-header">
                            <span className="material-symbols-outlined">lightbulb</span>
                            <span>Suggestions to Learn Better</span>
                        </div>
                        <ul>
                            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="nd-day-modal-footer">
                    <button className="nd-day-save-btn" onClick={handleSaveClick}>
                        <span className="material-symbols-outlined">check_circle</span>
                        Save Day Log & Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   COMPONENT: Week Accordion Row
   ══════════════════════════════════════════════════════ */
const WeekAccordion = React.memo(({ wn, wp, isActive, isDone, weekData, setActiveWeek, progress, setSelectedDayModal }) => {
    return (
        <div key={wn} className={`border rounded-xl overflow-hidden transition-all bg-white ${isActive ? 'ring-2 ring-primary border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
            <button
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-orange-50/50 transition-colors"
                onClick={() => setActiveWeek(isActive ? null : wn)}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${isDone ? 'bg-green-100 text-green-600' : isActive ? 'bg-[#f15b29] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {isDone ? <span className="material-symbols-outlined text-lg">check</span> : wn}
                    </div>
                    <div className="text-left">
                        <p className={`font-bold ${isActive ? 'text-[#f15b29]' : 'text-gray-900'}`}>Week {wn}</p>
                        <p className="text-xs mt-1 flex gap-1">
                            {[0, 1, 2, 3, 4].map((d) => {
                                const val = (progress || {})[`w${wn}d${d}`];
                                const isTaskDone = typeof val === "boolean" ? val : !!val?.completed;
                                return (
                                    <span key={d} className={`w-2 h-2 rounded-full ${isTaskDone ? "bg-green-500" : "bg-gray-200"}`} />
                                )
                            })}
                        </p>
                    </div>
                </div>
                <span className={`material-symbols-outlined transition-transform ${isActive ? "text-[#f15b29] rotate-180" : "text-gray-400"}`}>
                    expand_more
                </span>
            </button>

            {isActive && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    {weekData ? (
                        <>
                            <div className="nd-phase-label" style={{ marginBottom: "16px" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#f15b29" }}>flag</span>
                                Phase: {weekData.phase}
                            </div>

                            <div className="nd-day-tasks">
                                {weekData.tasks.map((task, dayIdx) => {
                                    const key = `w${wn}d${dayIdx}`;
                                    const val = (progress || {})[key];
                                    const isTaskDone = typeof val === "boolean" ? val : !!val?.completed;

                                    return (
                                        <button
                                            key={dayIdx}
                                            className={`nd-day-task ${isTaskDone ? "nd-day-done" : ""}`}
                                            onClick={() => setSelectedDayModal({ weekNum: wn, dayIdx, task })}
                                            aria-label={`${dayNames[dayIdx]}: ${task}`}
                                        >
                                            <span className="material-symbols-outlined nd-day-check">
                                                {isTaskDone ? "check_circle" : "radio_button_unchecked"}
                                            </span>
                                            <div className="nd-day-body">
                                                <span className="nd-day-name">{dayNames[dayIdx]}</span>
                                                <span className="nd-day-label">{task}</span>
                                            </div>
                                            <span className="material-symbols-outlined nd-day-open-icon">open_in_new</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Roadmap data not available for this week.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
const PracticalPage = () => {
    const { enrollment, loading: enrollmentLoading } = useDashboard();
    const [confirmProject, setConfirmProject] = useState(null);
    const [lockedProject, setLockedProject] = useState(null);
    const [progress, setProgress] = useState({});
    const [activeWeek, setActiveWeek] = useState(1);
    const [locking, setLocking] = useState(false);
    const [selectedDayModal, setSelectedDayModal] = useState(null);

    const domainId = typeof enrollment?.domainId === 'object' ? enrollment.domainId._id : enrollment?.domainId;

    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ["projects", domainId],
        queryFn: async () => {
            const response = await axios.get(`${API}/api/projects/course/${domainId}`);
            return response.data;
        },
        enabled: !!domainId, // Always fetch to get the roadmap data for the locked project
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    // Initialize from enrollment data
    useEffect(() => {
        if (enrollment) {
            if (enrollment.selectedProject) {
                setLockedProject(enrollment.selectedProject);
            }
            if (enrollment.projectProgress) {
                const pg = enrollment.projectProgress instanceof Map
                    ? Object.fromEntries(enrollment.projectProgress)
                    : (typeof enrollment.projectProgress === 'object' && enrollment.projectProgress !== null ? enrollment.projectProgress : {});
                setProgress(pg);
            }
        }
    }, [enrollment]);

    const activeProjectData = useMemo(() => {
        if (!lockedProject || projects.length === 0) return null;
        return projects.find(p => p.title === lockedProject);
    }, [lockedProject, projects]);

    const roadmap = useMemo(() => {
        if (!activeProjectData?.roadmap) return null;
        return activeProjectData.roadmap instanceof Map
            ? Object.fromEntries(activeProjectData.roadmap)
            : activeProjectData.roadmap;
    }, [activeProjectData]);

    const handleLockProject = async () => {
        if (!confirmProject || !enrollment?._id) return;
        setLocking(true);
        try {
            await axios.post(`${API}/select-project`, {
                enrollmentId: enrollment._id,
                projectTitle: confirmProject.title,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            // Update local state and trigger a refresh of the dashboard context
            setLockedProject(confirmProject.title);
            setConfirmProject(null);
            toast.success("Project locked successfully!");
            setTimeout(() => window.location.reload(), 1000); // Simple reload to resync context
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to lock project";
            toast.error(msg);
        } finally {
            setLocking(false);
        }
    };

    const handleSaveDayLog = async (dayData) => {
        if (!selectedDayModal) return;
        const { weekNum, dayIdx } = selectedDayModal;
        const key = `w${weekNum}d${dayIdx}`;

        const prevData = progress[key];
        const newProgress = { ...progress, [key]: dayData };
        setProgress(newProgress);
        setSelectedDayModal(null);

        try {
            await axios.post(`${API}/update-project-progress`, {
                enrollmentId: enrollment._id,
                dayKey: key,
                dayData: dayData,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Day log saved successfully!");

            const allDone = [0, 1, 2, 3, 4].every((d) => {
                const dKey = `w${weekNum}d${d}`;
                const val = dKey === key ? dayData : (newProgress[dKey] || null);
                if (!val) return false;
                if (typeof val === "boolean") return val;
                return !!val.completed;
            });

            if (allDone) {
                const userId = localStorage.getItem("userId");
                if (userId) {
                    try {
                        await axios.post(`${API}/api/practicals/submit`, {
                            userId,
                            weekNumber: weekNum,
                            submissionData: `Week ${weekNum} completed via project roadmap diary.`,
                        }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        });
                        toast.success(`🎉 Week ${weekNum} submitted for review!`);
                    } catch (practicalErr) {
                        console.warn("Practical submit error:", practicalErr.message);
                    }
                }
            }
        } catch {
            setProgress((prev) => ({ ...prev, [key]: prevData }));
            toast.error("Failed to save progress");
        }
    };

    const progressMetrics = useMemo(() => {
        let completedDays = 0;
        const totalDays = 24 * 5;
        const weekStatus = {};

        for (const [key, val] of Object.entries(progress || {})) {
            const isDone = typeof val === "boolean" ? val : !!val?.completed;
            if (isDone) {
                completedDays++;
                const wn = parseInt(key.match(/w(\d+)d/)[1]);
                weekStatus[wn] = (weekStatus[wn] || 0) + 1;
            }
        }

        return {
            completedDays,
            totalDays,
            overallPct: Math.round((completedDays / totalDays) * 100) || 0,
            weekStatus
        };
    }, [progress]);

    if (enrollmentLoading || (lockedProject && projectsLoading)) {
        return (
            <div className="nd-section-skeleton">
                <div className="nd-skeleton nd-sk-hero" />
                <div className="nd-skeleton nd-sk-card" />
                <div className="nd-skeleton nd-sk-card" />
            </div>
        );
    }

    if (!lockedProject) {
        return (
            <div className="nd-section-body">
                <SectionHeader icon="build" title="Hands-on Experience & Projects" subtitle="Choose a project to start your practical journey" />

                <div className="nd-practical-info">
                    <span className="material-symbols-outlined nd-practical-info-icon">emoji_objects</span>
                    <div>
                        <p className="nd-practical-info-title">Why hands-on projects matter</p>
                        <p className="nd-practical-info-desc">
                            Real-world projects build confidence, sharpen problem-solving skills, and make your resume stand out.
                            Select a project below that aligns with your interests — you'll follow a 24-week guided roadmap to build it from scratch.
                        </p>
                    </div>
                </div>

                <p className="nd-practical-domain-label">
                    Projects for <strong>{enrollment?.domain?.title || enrollment?.domain || "your course"}</strong>
                </p>

                {projectsLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading projects...</div>
                ) : (
                    <div className="nd-project-grid">
                        {projects.map((p, i) => (
                            <div key={i} className="nd-project-card">
                                <div className="nd-project-card-top">
                                    <span className="nd-project-level" style={{ color: levelColors[p.level || 'Beginner'], borderColor: levelColors[p.level || 'Beginner'] }}>
                                        {p.level || 'Beginner'}
                                    </span>
                                </div>
                                <p className="nd-project-title">{p.title}</p>
                                <p className="nd-project-desc">{p.description}</p>
                                <button className="nd-project-select-btn" onClick={() => setConfirmProject(p)}>
                                    Select Project
                                </button>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px' }}>
                                No projects assigned to this course yet. Please check back later.
                            </div>
                        )}
                    </div>
                )}

                {confirmProject && (
                    <ConfirmModal
                        project={confirmProject}
                        onConfirm={handleLockProject}
                        onCancel={() => setConfirmProject(null)}
                        loading={locking}
                    />
                )}
            </div>
        );
    }

    const currentWeekData = roadmap ? roadmap[activeWeek] : null;

    return (
        <div className="nd-section-body">
            <SectionHeader icon="build" title="Project Roadmap" subtitle={lockedProject} />

            <div className="nd-locked-banner">
                <span className="material-symbols-outlined nd-locked-banner-icon">lock</span>
                <div>
                    <p className="nd-locked-banner-title">{lockedProject}</p>
                    <p className="nd-locked-banner-sub">{progressMetrics.overallPct}% complete · {progressMetrics.completedDays}/{progressMetrics.totalDays} tasks done</p>
                </div>
                <div className="nd-locked-banner-progress">
                    <div className="nd-locked-banner-fill" style={{ width: `${progressMetrics.overallPct}%` }} />
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
                {Array.from({ length: 24 }, (_, i) => i + 1).map((wn) => {
                    const wp = progressMetrics.weekStatus[wn] || 0;
                    const isActive = activeWeek === wn;
                    const isDone = wp === 5;
                    const weekData = roadmap ? roadmap[wn] : null;

                    return (
                        <WeekAccordion
                            key={wn}
                            wn={wn}
                            wp={wp}
                            isActive={isActive}
                            isDone={isDone}
                            weekData={weekData}
                            setActiveWeek={setActiveWeek}
                            progress={progress}
                            setSelectedDayModal={setSelectedDayModal}
                        />
                    );
                })}
            </div>

            {selectedDayModal && (
                <DayDetailModal
                    week={selectedDayModal.weekNum}
                    dayIdx={selectedDayModal.dayIdx}
                    taskTitle={selectedDayModal.task}
                    phase={currentWeekData?.phase}
                    dayData={progress[`w${selectedDayModal.weekNum}d${selectedDayModal.dayIdx}`]}
                    onSave={handleSaveDayLog}
                    onClose={() => setSelectedDayModal(null)}
                />
            )}
        </div>
    );
};

export default PracticalPage;
