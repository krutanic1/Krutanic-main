import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API from "../../API";

const DEFAULT_LEVEL = { bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' };

export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState({
        programCompletion: { completedSessions: 0, totalSessions: 100, percentage: 0 },
        assignmentStats: { levels: { Beginner: DEFAULT_LEVEL, Intermediate: DEFAULT_LEVEL, Advanced: DEFAULT_LEVEL } },
        internshipStatus: { status: 'Not Eligible', phase: 'Not Eligible' },
        placementReadiness: { scorePercentage: 0, notes: '' },
        // New matrix data
        assignmentMatrix: [
            { levelName: 'Beginner', ...DEFAULT_LEVEL },
            { levelName: 'Intermediate', ...DEFAULT_LEVEL },
            { levelName: 'Advanced', ...DEFAULT_LEVEL },
        ],
        internshipReadiness: {
            totalWeeks: 24,
            completedWeeks: 0,
            pendingWeeks: 24,
            readinessScore: 0,
            internshipStatus: 'Not Eligible',
            weeklyProgress: Array.from({ length: 24 }, (_, i) => ({ week: i + 1, status: 'Pending' })),
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");

    const fetchMetrics = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API}/api/dashboard/${userId}`);
            setMetrics(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching dashboard metrics:", err);
            setError(err.response?.data?.error || "Failed to load metrics");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateMetrics = async (updates) => {
        if (!userId) return;
        try {
            const response = await axios.patch(`${API}/api/dashboard/${userId}`, updates);
            setMetrics(prev => ({
                ...prev,
                ...response.data.updatedMetrics
            }));
            return response.data;
        } catch (err) {
            console.error("Error updating dashboard metrics:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [userId]);

    return { metrics, loading, error, refetchMetrics: fetchMetrics, updateMetrics };
};
