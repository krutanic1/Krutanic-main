import api from './api';

export const teamService = {
    /**
     * Get performance stats for a specialist.
     * Backend endpoint: /api/adv-reports/specialist-stats/:id
     */
    getDashboardStats: async (specialistId, role) => {
        try {
            const response = await api.get('/api/adv-teams/dashboard-stats', {
                params: { specialistId, role }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch dashboard stats';
        }
    },

    /**
     * Get team leaderboard (Converted leads).
     * Backend endpoint: /api/adv-reports/leaderboard
     */
    getLeaderboard: async () => {
        try {
            const response = await api.get('/api/adv-reports/leaderboard');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch leaderboard';
        }
    },

    /**
     * Fetch team performance stats (for Managers/Leaders).
     */
    getTeamPerformance: async () => {
        try {
            const response = await api.get('/api/adv-teams/team-performance');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch team performance';
        }
    },

    /**
     * Fetch team leaderboard data.
     */
    getTeamLeaderboard: async () => {
        try {
            const response = await api.get('/api/adv-teams/team-leaderboard');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch leaderboard';
        }
    },

    getPipelineStats: async (agentId, timeframe = 'day') => {
        try {
            const response = await api.get(`/api/adv-teams/pipeline-stats?specialistId=${agentId}&timeframe=${timeframe}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch pipeline stats';
        }
    },

    /**
     * Get global system stats (Admin command center).
     */
    getAdminSystemStats: async () => {
        try {
            const response = await api.get('/api/admin/system-stats');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch system stats';
        }
    }
};

export default teamService;
