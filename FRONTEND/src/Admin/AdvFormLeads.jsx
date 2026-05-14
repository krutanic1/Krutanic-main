import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const AdvFormLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    useEffect(() => {
        fetchLeads();
    }, [page]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-leads/get-adv-form-leads?page=${page}&limit=30`);
            if (res.data.success) {
                setLeads(res.data.leads);
                setTotalPages(res.data.totalPages);
                setTotalLeads(res.data.total);
            }
        } catch (error) {
            toast.error("Failed to fetch leads");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCRM = async (leadId) => {
        try {
            const res = await axios.post(`${API}/api/adv-leads/add-form-lead-to-crm`, { leadId });
            if (res.data.success) {
                toast.success(res.data.message);
                setLeads(prevLeads => prevLeads.map(l => 
                    String(l._id) === String(leadId) ? { ...l, isAddedToCRM: true } : l
                ));
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "";
            if (errorMsg.includes("already exists") || errorMsg.includes("already in the CRM")) {
                toast.success("Lead already exists in CRM. Marking as added.");
                setLeads(prevLeads => prevLeads.map(l => 
                    String(l._id) === String(leadId) ? { ...l, isAddedToCRM: true } : l
                ));
            } else {
                toast.error(errorMsg || "Failed to add lead to CRM");
            }
            console.error(error);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px' }}>
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Advanced Enrollment Leads</h1>
                    <p className="text-gray-500 mt-1">Total Leads: <span className="font-bold text-indigo-600">{totalLeads}</span></p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="flex items-center px-4 font-medium text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name & Email</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Domain & Goal</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Commitment</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Preferred Time</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-10 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fa fa-refresh fa-spin text-2xl text-indigo-500"></i>
                                            <p className="text-gray-400 italic">Fetching enrollment data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : leads.length > 0 ? (
                                (() => {
                                    const grouped = leads.reduce((acc, lead) => {
                                        const d = new Date(lead.created_at);
                                        const dateKey = d.toLocaleDateString("en-GB");
                                        if (!acc[dateKey]) acc[dateKey] = [];
                                        acc[dateKey].push(lead);
                                        return acc;
                                    }, {});

                                    return Object.keys(grouped).sort((a, b) => {
                                        const dateA = new Date(a.split('/').reverse().join('-'));
                                        const dateB = new Date(b.split('/').reverse().join('-'));
                                        return dateB - dateA;
                                    }).map(date => (
                                        <React.Fragment key={date}>
                                            <tr className="bg-gray-50/80">
                                                <td colSpan="7" className="px-6 py-3 text-xs font-black text-indigo-600 uppercase tracking-widest border-y border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fa fa-calendar-o"></i>
                                                        {date}
                                                    </div>
                                                </td>
                                            </tr>
                                            {grouped[date].map((lead) => (
                                                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900">{lead.fullName}</div>
                                                        <div className="text-xs text-gray-500">{lead.email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm font-medium text-gray-700">{lead.contactNumber}</div>
                                                        <div className="text-xs text-green-600 font-bold">WA: {lead.whatsappNumber}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block font-bold mb-1">
                                                            {lead.domain}
                                                        </div>
                                                        <div className="text-xs text-gray-600 line-clamp-1">{lead.primaryGoal}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-xs font-bold text-gray-800">{lead.commitmentLevel}</div>
                                                        <div className={`text-[10px] uppercase font-black ${lead.readyToInvest === 'Yes, I\'m ready' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                            Invest: {lead.readyToInvest}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm font-bold text-gray-700">{lead.connectTime}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase">Lang: {lead.preferredLanguages?.join(', ')}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {new Date(lead.created_at).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">
                                                            {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <button 
                                                            onClick={() => !lead.isAddedToCRM && handleAddToCRM(lead._id)}
                                                            disabled={lead.isAddedToCRM}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5 ${
                                                                lead.isAddedToCRM 
                                                                ? 'bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200' 
                                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                            }`}
                                                        >
                                                            <i className={`fa ${lead.isAddedToCRM ? 'fa-check-circle' : 'fa-user-plus'}`}></i>
                                                            {lead.isAddedToCRM ? 'Added to CRM' : 'Add to CRM'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ));
                                })()
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-20 text-center text-gray-400 italic">
                                        <i className="fa fa-folder-open-o text-3xl mb-2"></i>
                                        <p>No enrollment leads found in the database.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdvFormLeads;
