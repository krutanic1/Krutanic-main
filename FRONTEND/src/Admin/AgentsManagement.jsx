import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import AgentTable from './Components/AgentTable';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AgentsManagement = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/agents`);
            setAgents(res.data);
        } catch (error) {
            toast.error("Failed to fetch agents");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await axios.patch(`${API}/api/admin/agents/${id}/deactivate`);
            toast.success("Agent status updated");
            fetchAgents();
        } catch (error) {
            toast.error("Failed to update agent status");
        }
    };

    const handleViewActivity = (id) => {
        navigate(`/admin/agent-activity/${id}`);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Agents Management</h1>
                    <p className="text-gray-500 mt-1">Monitor performance and manage system access</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchAgents}
                        className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        <i className="fa fa-refresh"></i>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <AgentTable
                    agents={agents}
                    onDeactivate={handleDeactivate}
                    onViewActivity={handleViewActivity}
                />
            )}
        </div>
    );
};

export default AgentsManagement;
