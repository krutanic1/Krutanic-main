import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const LeadAssignments = () => {
    const [freshCount, setFreshCount] = useState(0);
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
    const [count, setCount] = useState('');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        fetchFreshLeads();
        fetchAgents();
    }, []);

    const fetchFreshLeads = async () => {
        try {
            const res = await axios.get(`${API}/api/adv-leads/fresh-leads-count`);
            setFreshCount(res.data.count || 0);
        } catch (error) {
            console.error("Failed to fetch fresh leads");
        }
    };

    const fetchAgents = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/agents`);
            // Only managers and leaders can receive admin assignments generally
            setManagers(res.data.filter(a => a.role === 'manager' || a.role === 'leader'));
        } catch (error) {
            console.error("Failed to fetch agents");
        }
    };

    const handleAssign = async () => {
        if (!selectedManager) return toast.error("Please select a manager/leader");
        if (!count || count <= 0) return toast.error("Enter a valid number of leads");
        if (count > freshCount) return toast.error(`Only ${freshCount} leads available`);

        setAssigning(true);
        try {
            // Reusing existing admin-bulk-assign logic if available, otherwise would create new one
            // Assuming legacy admin-bulk-assign works with our assigneeRole logic
            const manager = managers.find(m => m._id === selectedManager);

            await axios.post(`${API}/api/adv-leads/admin-bulk-assign`, {
                assigneeId: manager._id,
                assigneeName: manager.name,
                assigneeRole: manager.role === 'manager' ? 'ADV Manager' : 'ADV Leader',
                count: parseInt(count),
                assignerName: localStorage.getItem("adminName") || 'Admin'
            });

            toast.success(`Successfully assigned ${count} leads to ${manager.name}`);
            setCount('');
            setSelectedManager('');
            fetchFreshLeads();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lead assignment failed");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Lead Assignment Tool</h1>
                <p className="text-gray-500 mt-1">Distribute fresh leads to managers and team leaders</p>
            </div>

            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-blue-600 p-8 text-white text-center">
                        <p className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-2">Available for Assignment</p>
                        <h2 className="text-6xl font-black">{freshCount}</h2>
                        <p className="text-blue-100 mt-2">Fresh Leads</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                1. Select Recipient
                            </label>
                            <select
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            >
                                <option value="">-- Choose Manager or Leader --</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                2. Number of Leads
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    placeholder={`Max: ${freshCount}`}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none pr-20"
                                />
                                <button
                                    onClick={() => setCount(String(freshCount))}
                                    className="absolute right-3 top-3 px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAssign}
                            disabled={assigning || !selectedManager || !count}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${assigning || !selectedManager || !count
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {assigning ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    Assigning Leads...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-paper-plane"></i>
                                    Confirm Assignment
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
                    <div className="text-blue-500 text-2xl">
                        <i className="fa fa-info-circle"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900">Pro Tip</h4>
                        <p className="text-sm text-blue-700">Leads assigned to Managers can be redistributed to Team Leaders, who then pass them to Specialists. This ensures a balanced workflow across the organization.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadAssignments;
