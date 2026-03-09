import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import StatCard from './Components/StatCard';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

const AdvAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        activeAgents: 0,
        callsToday: 0,
        conversionsToday: 0
    });
    const [liveStats, setLiveStats] = useState({
        callsInProgress: 0,
        dialerSessions: 0,
        liveFeed: []
    });
    const [loading, setLoading] = useState(true);

    // Mock data for charts
    const chartData = [
        { name: 'Mon', calls: 45, conversions: 5 },
        { name: 'Tue', calls: 52, conversions: 8 },
        { name: 'Wed', calls: 38, conversions: 4 },
        { name: 'Thu', calls: 65, conversions: 12 },
        { name: 'Fri', calls: 48, conversions: 7 },
        { name: 'Sat', calls: 25, conversions: 3 },
        { name: 'Sun', calls: 15, conversions: 1 },
    ];

    const conversionTrend = [
        { week: 'Week 1', rate: 18 },
        { week: 'Week 2', rate: 21 },
        { week: 'Week 3', rate: 24 },
        { week: 'Week 4', rate: 28 },
    ];

    useEffect(() => {
        fetchSystemStats();
        fetchLiveStats();
        // Poll live stats every 10 seconds
        const liveInterval = setInterval(fetchLiveStats, 10000);
        return () => clearInterval(liveInterval);
    }, []);

    const fetchSystemStats = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/system-stats`);
            setStats(res.data);
        } catch (error) {
            toast.error("Failed to load system statistics");
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveStats = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/live-system-stats`);
            setLiveStats(res.data);
        } catch (error) {
            console.error("Live stats sync failed");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Command Center</h1>
                    <p className="text-gray-500 mt-1">Real-time system telemetry and performance metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-green-700 font-bold text-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        System Live
                    </div>
                </div>
            </div>

            {/* Live Monitor Strip (Phase 15) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calls In Progress</p>
                        <h4 className="text-2xl font-black text-gray-800">{liveStats.callsInProgress}</h4>
                    </div>
                    <div className="text-blue-500 text-2xl animate-pulse">
                        <i className="fa fa-phone"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Dialers</p>
                        <h4 className="text-2xl font-black text-gray-800">{liveStats.dialerSessions}</h4>
                    </div>
                    <div className="text-purple-500 text-2xl">
                        <i className="fa fa-refresh fa-spin"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Velocity</p>
                        <h4 className="text-2xl font-black text-gray-800">{stats.callsToday} <span className="text-sm font-normal text-gray-400">calls</span></h4>
                    </div>
                    <div className="text-green-500 text-2xl">
                        <i className="fa fa-bolt"></i>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Leads"
                    value={stats.totalLeads}
                    icon="fa-users"
                    color="blue"
                />
                <StatCard
                    title="Active Agents"
                    value={stats.activeAgents}
                    icon="fa-user-secret"
                    color="purple"
                />
                <StatCard
                    title="Calls Today"
                    value={stats.callsToday}
                    icon="fa-phone"
                    color="orange"
                />
                <StatCard
                    title="Conversions Today"
                    value={stats.conversionsToday}
                    icon="fa-trophy"
                    color="green"
                />
            </div>

            {/* Charts row + Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Volume */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fa fa-bar-chart text-blue-500"></i> Weekly Performance
                    </h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="calls" radius={[6, 6, 0, 0]} fill="#3b82f6" />
                                <Bar dataKey="conversions" radius={[6, 6, 0, 0]} fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <i className="fa fa-dot-circle-o text-red-500"></i> Live Monitor
                        </div>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold uppercase tracking-tighter">Live</span>
                    </h3>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                        {liveStats.liveFeed.length > 0 ? liveStats.liveFeed.map((item, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-md">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <i className="fa fa-phone"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{item.agent}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">calling <span className="font-semibold">{item.lead}</span></p>
                                </div>
                                <div className="text-[10px] font-bold text-green-600 uppercase">Calling</div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 italic py-10">
                                <i className="fa fa-clock-o text-3xl mb-2"></i>
                                <p>Waiting for activity...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvAdminDashboard;
