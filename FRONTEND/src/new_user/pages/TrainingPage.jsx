import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard, getWatchedFromStorage, getThumbnail } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";

const TrainingPage = () => {
    const navigate = useNavigate();
    const { enrollment, loading } = useDashboard();

    const sessions = enrollment?.domain?.session ? Object.entries(enrollment.domain.session) : [];
    const totalSessions = sessions.length;
    const watchedSessions = enrollment
        ? getWatchedFromStorage(enrollment._id, enrollment.domain?.session, enrollment.watchedSessions)
        : 0;

    if (loading) {
        return (
            <div className="nd-section-skeleton">
                <div className="nd-skeleton nd-sk-hero" />
                <div className="nd-skeleton nd-sk-card" />
                <div className="nd-skeleton nd-sk-card" />
                <div className="nd-skeleton nd-sk-card" />
            </div>
        );
    }

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
                                            onClick={() => navigate("/advancedashboard/learning", {
                                                state: { courseTitle: enrollment?.domain?.title, sessions: enrollment?.domain?.session, enrollmentId: enrollment?._id, watchedSessionsFromDB: enrollment?.watchedSessions, thumbnail: getThumbnail(enrollment?.domain?.title) }
                                            })}
                                        >
                                            <span className="material-symbols-outlined">play_arrow</span>
                                            Continue
                                        </button>
                                    ) : isWatched ? (
                                        <button
                                            className="nd-session-play-btn nd-session-play-done"
                                            onClick={() => navigate("/advancedashboard/learning", {
                                                state: { courseTitle: enrollment?.domain?.title, sessions: enrollment?.domain?.session, enrollmentId: enrollment?._id, watchedSessionsFromDB: enrollment?.watchedSessions, thumbnail: getThumbnail(enrollment?.domain?.title) }
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

export default TrainingPage;
