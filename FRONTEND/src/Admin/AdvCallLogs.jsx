import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const AdvCallLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [playingUrl, setPlayingUrl] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-reports/all-activities?page=${page}&limit=30`);
            setLogs(res.data.logs);
            setTotalPages(res.data.pages);
            setTotalLogs(res.data.total);
        } catch (error) {
            toast.error("Failed to fetch call activities");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOutcomeColor = (outcome) => {
        const s = (outcome || "").toLowerCase();
        if (s.includes('converted') || s.includes('booked') || s.includes('won')) return 'bg-green-100 text-green-700';
        if (s.includes('interested') || s.includes('connected')) return 'bg-blue-100 text-blue-700';
        if (s.includes('no_answer') || s.includes('rnr') || s.includes('busy') || s.includes('switched') || s.includes('not_reachable')) return 'bg-red-100 text-red-700';
        if (s.includes('junk') || s.includes('wrong') || s.includes('not_interested') || s.includes('lost')) return 'bg-gray-100 text-gray-700';
        if (s.includes('follow_up') || s.includes('callback')) return 'bg-purple-100 text-purple-700';
        return 'bg-orange-100 text-orange-700';
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', paddingBottom: playingUrl ? '120px' : '32px' }}>
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Call Activity Logs</h1>
                    <p className="text-gray-500 mt-1">Full interaction history across all leads ({totalLogs} records)</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            <i className="fa fa-chevron-left mr-2"></i> Previous
                        </button>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            Next <i className="fa fa-chevron-right ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Lead Details</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Team & Agent</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Outcome</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Duration</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Recording</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">Summary & Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="7" className="px-6 py-8 h-20 bg-gray-50"></td>
                                    </tr>
                                ))
                            ) : logs.length > 0 ? logs.map((log) => (
                                <tr key={log._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-900">{formatDate(log.createdAt).split(',')[0]}</div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase mt-1">{formatDate(log.createdAt).split(',')[1]}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-900">{log.leadId?.full_name || 'Deleted Lead'}</div>
                                        <div className="text-xs text-blue-600 font-bold mt-1 tracking-tighter">
                                            <i className="fa fa-phone mr-1"></i> {log.leadId?.phone_number || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-black text-purple-600 uppercase tracking-tighter mb-1">
                                            {log.teamId?.team_name || log.specialistId?.team_id?.team_name || 'No Team'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-600">
                                                {(log.specialistName || log.specialistId?.name || 'A').charAt(0)}
                                            </div>
                                            <div className="text-xs font-bold text-gray-700">{log.specialistName || log.specialistId?.name || 'Unknown Agent'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight w-fit ${getOutcomeColor(log.callOutcome || log.disposition)}`}>
                                                {(log.callOutcome || log.disposition || 'N/A').replace('_', ' ')}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                                {log.stage || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-gray-900">
                                            {Math.floor((log.duration || 0) / 60)}m {(log.duration || 0) % 60}s
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase mt-1">Talk Time</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {log.recordingUrl ? (
                                            <button 
                                                onClick={() => setPlayingUrl(log.recordingUrl)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${playingUrl === log.recordingUrl ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                                title="Play Recording"
                                            >
                                                <i className={`fa ${playingUrl === log.recordingUrl ? 'fa-volume-up animate-pulse' : 'fa-play'} text-xs`}></i>
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Audio</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xs">
                                            <div className="text-xs font-bold text-gray-800 line-clamp-2">{log.summary || 'No summary'}</div>
                                            {log.remark && (
                                                <div className="text-[10px] text-gray-400 mt-2 bg-gray-50 p-2 rounded-lg border-l-2 border-gray-200 italic font-medium">
                                                    "{log.remark}"
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-medium">
                                        <i className="fa fa-database text-4xl mb-4 block opacity-20"></i>
                                        No call activities found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing {logs.length} of {totalLogs} interactions
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            <i className="fa fa-chevron-left"></i>
                        </button>
                        <div className="flex items-center gap-1 px-4 text-sm font-black text-gray-900">
                             {page} <span className="text-gray-300 mx-1">/</span> {totalPages}
                        </div>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-all font-bold text-gray-700"
                        >
                            <i className="fa fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Inline Audio Player Overlay */}
            {playingUrl && (
                <div className="fixed bottom-0 left-[265px] right-0 bg-gray-900/95 backdrop-blur-md p-6 border-t border-gray-800 flex items-center gap-8 shadow-2xl z-[1000] animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setPlayingUrl(null)}
                            className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                            <i className="fa fa-times"></i>
                        </button>
                        <div className="text-white">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Now Playing</p>
                            <p className="text-sm font-bold truncate max-w-[200px]">Call Recording</p>
                        </div>
                    </div>
                    <div className="flex-1 max-w-2xl">
                        <audio 
                            src={playingUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-10 invert brightness-200 opacity-90"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvCallLogs;
