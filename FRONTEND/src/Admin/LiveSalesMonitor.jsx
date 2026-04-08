import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import { Toaster, toast } from 'react-hot-toast';

const LiveSalesMonitor = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveStatus = async () => {
        try {
            const res = await axios.get(`${API}/api/activity/live-status`);
            setAgents(res.data);
        } catch (error) {
            console.error("Failed to fetch live status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveStatus();
        const interval = setInterval(fetchLiveStatus, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const getStatus = (lastActiveAt) => {
        const diff = Date.now() - new Date(lastActiveAt).getTime();
        if (diff < 60000) return { label: 'Online', class: 'bg-emerald-500', pulse: true };
        if (diff < 180000) return { label: 'Away', class: 'bg-amber-500', pulse: false };
        return { label: 'Idle', class: 'bg-slate-400', pulse: false };
    };

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen" style={{ marginLeft: '265px' }}>
            <Toaster />
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-[#1e293b]">Live Sales Ops</h1>
                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Monitoring Live
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm italic">Real-time screen activity and presence monitoring</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-emerald-500 border-t-transparent"></div>
                        <p className="mt-4 text-slate-500 font-medium">Connecting to live feed...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent) => {
                            const status = getStatus(agent.lastActiveAt);
                            return (
                                <div key={agent._id} className="group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-emerald-100 overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${status.class} text-white shadow-sm ring-2 ring-white`}>
                                            {status.pulse && (
                                                <span className="flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-white opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                                </span>
                                            )}
                                            {status.label}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 shadow-inner">
                                            {agent.fullname.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{agent.fullname}</h3>
                                            <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">{agent.designation}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-0.5">Active Time Today</span>
                                                <span className="text-xl font-black text-slate-700 font-mono tracking-tight">{formatTime(agent.todayActiveTime)}</span>
                                            </div>
                                            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200">
                                                ⏱️
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1">Current Screen</span>
                                            <div className="bg-white border border-slate-100 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm group-hover:border-emerald-100 transition-all">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                <span className="text-xs font-semibold text-slate-600 truncate">{agent.currentScreen}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-medium italic">Last pulse: {new Date(agent.lastActiveAt).toLocaleTimeString()}</span>
                                        <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            Open Trail <i className="fa fa-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {agents.length === 0 && !loading && (
                    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-5xl mb-4 grayscale opacity-40">💤</div>
                        <h3 className="text-xl font-bold text-slate-600">No active sessions detected</h3>
                        <p className="text-slate-400 text-sm max-w-xs text-center mt-2">All sr sales executives are currently offline or inactive.</p>
                    </div>
                )}
            </div>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=JetBrains+Mono:wght@500&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                h1, h2, h3, .font-bold {
                    letter-spacing: -0.025em;
                }
                
                .font-mono {
                    font-family: 'JetBrains Mono', monospace;
                }
            `}</style>
        </div>
    );
};

export default LiveSalesMonitor;
