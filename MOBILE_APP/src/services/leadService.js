import api from './api';

const leadService = {
    /**
     * Fetch leads assigned to current user.
     */
    getMyLeads: async (params = {}) => {
        try {
            const response = await api.get('/api/adv-leads/get-adv-leads', {
                params: {
                    strictlyOwned: 'true',
                    ...params
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch leads';
        }
    },

    /**
     * Fetch a single lead's details.
     */
    getLeadDetails: async (leadId) => {
        try {
            const response = await api.get(`/api/adv-leads/${leadId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch lead details';
        }
    },

    /**
   * Log a call activity for a lead.
   */
    logCall: async (callData) => {
        try {
            const response = await api.post('/api/adv-leads/log-call-activity', callData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to log call activity';
        }
    },

    /**
     * Fetch call history for a lead.
     */
    getCallHistory: async (leadId) => {
        try {
            const response = await api.get(`/api/adv-leads/call-history/${leadId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch call history';
        }
    },

    /**
     * Fetch upcoming follow-ups for current user.
     */
    getUpcomingFollowUps: async (specialistId) => {
        try {
            const response = await api.get('/api/adv-leads/upcoming-followups', {
                params: { specialistId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch follow-ups';
        }
    },

    /**
     * Fetch today's follow-up count for Dashboard.
     */
    getTodayFollowUpCount: async (agentId) => {
        const response = await api.get(`/api/adv-leads/followups-today-count?specialistId=${agentId}`);
        return response.data;
    },

    getDialerQueue: async (agentId) => {
        const response = await api.get(`/api/adv-leads/dialer-queue?specialistId=${agentId}`);
        return response.data;
    }
};

export default leadService;
