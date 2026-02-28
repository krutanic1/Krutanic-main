import axios from "axios";
import API from "../../API";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const DEFAULT_LEVEL = { bestScore: 0, latestScore: 0, attemptsCount: 0, status: 'Not Started' };
const DEFAULT_METRICS = {
    programCompletion: { completedSessions: 0, totalSessions: 100, percentage: 0 },
    assignmentStats: { levels: { Beginner: DEFAULT_LEVEL, Intermediate: DEFAULT_LEVEL, Advanced: DEFAULT_LEVEL } },
    internshipStatus: { status: 'Not Eligible', phase: 'Not Eligible' },
    placementReadiness: { scorePercentage: 0, notes: '' },
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
};

export const useDashboardMetrics = () => {
    const userId = localStorage.getItem("userId");
    const queryClient = useQueryClient();

    const { data: metrics = DEFAULT_METRICS, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['dashboardMetrics', userId],
        queryFn: async () => {
            const response = await axios.get(`${API}/api/dashboard/${userId}`);
            return response.data;
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    const mutation = useMutation({
        mutationFn: async (updates) => {
            const response = await axios.patch(`${API}/api/dashboard/${userId}`, updates);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboardMetrics', userId] });
        }
    });

    return {
        metrics,
        loading,
        error: error?.response?.data?.error || error?.message,
        refetchMetrics: refetch,
        updateMetrics: mutation.mutateAsync
    };
};
