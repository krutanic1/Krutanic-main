import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const AgentActivity = () => {
    const { agentId } = useParams();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, [agentId]);

    const fetchActivity = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/agent-activity/${agentId}`);
            setActivities(res.data);
        } catch (error) {
            toast.error("Failed to fetch activity logs");
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const getOutcomeStyle = (outcome) => {
        const styles = {
            interested: 'bg-green-100 text-green-700',
            no_answer: 'bg-red-100 text-red-700',
            callback_requested: 'bg-blue-100 text-blue-700',
            converted: 'bg-emerald-100 text-emerald-700 font-bold',
        };
        return styles[outcome] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Agent Activity Audit</h1>
                <p className="text-gray-500 mt-1">Detailed call history and interaction outcomes</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Lead Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Outcome</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Duration</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activities.map((act) => (
                                <tr key={act._id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-800">{act.leadName || 'Unknown Lead'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOutcomeStyle(act.callOutcome)}`}>
                                            {act.callOutcome?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        {formatDuration(act.duration)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {act.callSummary || '—'}
                                    </td>
                                </tr>
                            ))}
                            {activities.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                        No call activity found for this agent.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AgentActivity;
