/**
 * Utility to handle date formatting for IST (India Standard Time).
 */

// For system-generated dates (createdAt, last_interaction_at)
export const formatSystemDate = (dateVal) => {
    if (!dateVal) return '—';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// For user-selected dates (followUpDate, next_followup_at)
// These are stored as "Fake UTC" to match CRM logic, so we subtract the offset for display.
export const formatUserDate = (dateVal) => {
    if (!dateVal) return '—';
    const ms = typeof dateVal === 'string' ? Date.parse(dateVal) : dateVal.getTime();
    if (isNaN(ms)) return '—';

    const offsetMs = (5 * 60 + 30) * 60 * 1000;
    const adjustedDate = new Date(ms - offsetMs);

    return adjustedDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

