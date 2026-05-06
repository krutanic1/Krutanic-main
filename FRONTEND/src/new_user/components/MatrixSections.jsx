import React from "react";

const STATUS_COLORS = {
    'Not Started': { badge: 'nd-tag-gray', text: '#999' },
    'In Progress': { badge: 'nd-tag-yellow', text: '#f0a500' },
    'Completed': { badge: 'nd-tag-green', text: '#22c55e' },
};

const ELIGIBILITY_COLORS = {
    'Not Eligible': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    'In Progress': { color: '#f0a500', bg: 'rgba(240,165,0,0.1)' },
    'Eligible for Internship': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
};

const DEFAULT_MATRIX = [
    { levelName: 'Beginner', bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' },
    { levelName: 'Intermediate', bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' },
    { levelName: 'Advanced', bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' },
];

/** ── Assignment Score Matrix ── */
export const AssignmentMatrixSection = ({ assignmentMatrix, loading }) => {
    const rows = (Array.isArray(assignmentMatrix) && assignmentMatrix.length > 0)
        ? assignmentMatrix
        : DEFAULT_MATRIX;

    if (loading) {
        return (
            <section className="nd-section">
                <div className="nd-section-header">
                    <h2 className="nd-section-title">
                        <span className="material-symbols-outlined nd-section-icon">quiz</span>
                        Assignment Score Matrix
                    </h2>
                </div>
                <div className="nd-skeleton" style={{ height: 200, borderRadius: 12 }} />
            </section>
        );
    }

    return (
        <section className="nd-section">
            <div className="nd-section-header">
                <h2 className="nd-section-title">
                    <span className="material-symbols-outlined nd-section-icon">quiz</span>
                    Assignment Score Matrix
                </h2>
            </div>
            <div className="nd-matrix-table-wrap">
                <table className="nd-matrix-table">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Best Score</th>
                            <th>Latest Score</th>
                            <th>Attempts</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const { badge } = STATUS_COLORS[row.status] || STATUS_COLORS['Not Started'];
                            return (
                                <tr key={row.levelName}>
                                    <td>
                                        <span className="nd-matrix-level">{row.levelName}</span>
                                    </td>
                                    <td>
                                        <span className="nd-matrix-score nd-matrix-best">
                                            {row.bestScore}%
                                        </span>
                                    </td>
                                    <td>
                                        <span className="nd-matrix-score">
                                            {row.latestScore}%
                                        </span>
                                    </td>
                                    <td>
                                        <span className="nd-matrix-attempts">{row.attemptsCount}</span>
                                    </td>
                                    <td>
                                        <span className={`nd-tag ${badge}`}>{row.status}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

/** ── 12-Week Internship Readiness ── */
export const InternshipReadinessSection = ({ internshipReadiness, loading }) => {
    if (loading) {
        return (
            <section className="nd-section">
                <div className="nd-section-header">
                    <h2 className="nd-section-title">
                        <span className="material-symbols-outlined nd-section-icon">work_history</span>
                        12-Week Practical Progress
                    </h2>
                </div>
                <div className="nd-skeleton" style={{ height: 260, borderRadius: 12 }} />
            </section>
        );
    }

    const {
        completedWeeks = 0,
        weeklyProgress = [],
    } = internshipReadiness || {};

    const doneWeeks = weeklyProgress.filter(w => w.status === 'Submitted' || w.status === 'Approved').length;
    const progressPct = Math.round((doneWeeks / 12) * 100);

    return (
        <section className="nd-section">
            <div className="nd-section-header">
                <h2 className="nd-section-title">
                    <span className="material-symbols-outlined nd-section-icon">work_history</span>
                    12-Week Practical Progress
                </h2>
                <span className="nd-tag" style={{ color: '#22c55e', background: '#f0fdf4', border: '1px solid #22c55e33', fontWeight: 600 }}>
                    {doneWeeks}/12 Weeks
                </span>
            </div>

            {/* Progress Bar */}
            <div className="nd-readiness-bar-wrap">
                <div className="nd-readiness-bar-track">
                    <div
                        className="nd-readiness-bar-fill"
                        style={{ width: `${progressPct}%`, background: '#22c55e' }}
                    />
                </div>
                <span className="nd-readiness-bar-label">{progressPct}% Complete</span>
            </div>

            {/* Week Grid — green if all 5 days done, gray otherwise */}
            <div className="nd-week-grid">
                {weeklyProgress.map(({ week, status }) => {
                    const isDone = status === 'Submitted' || status === 'Approved';
                    return (
                        <div
                            key={week}
                            className={`nd-week-cell ${isDone ? 'nd-week-approved' : 'nd-week-pending'}`}
                            title={`Week ${week}: ${isDone ? 'Completed ✅' : 'Pending'}`}
                        >
                            <span className="material-symbols-outlined nd-week-icon">
                                {isDone ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className="nd-week-num">W{week}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

