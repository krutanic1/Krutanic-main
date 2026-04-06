import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    Cell, PieChart, Pie, LineChart, Line, Area, AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Database, Target, PhoneCall, Info, Users, X, ChevronRight, Award, DollarSign, AlertCircle, BarChart2, Filter, RotateCw } from 'lucide-react';
import API from '../API';

// ────────────── CALL OUTCOME CONFIG ──────────────
const OUTCOMES = [
    { key: 'fresh',              label: 'Fresh',             icon: 'fiber_new',       color: '#64748B', bg: '#f1f5f9' },
    { key: 'interested',         label: 'Interested',        icon: 'check_circle',    color: '#10B981', bg: '#ecfdf5' },
    { key: 'follow_up',          label: 'Follow Up',         icon: 'call',            color: '#3B82F6', bg: '#eff6ff' },
    { key: 'callback_requested', label: 'Callback',          icon: 'history',         color: '#8B5CF6', bg: '#f5f3ff' },
    { key: 'no_answer',          label: 'No Answer',         icon: 'phone_disabled',  color: '#F59E0B', bg: '#fffbeb' },
    { key: 'not_interested',     label: 'Not Interested',    icon: 'cancel',          color: '#EF4444', bg: '#fef2f2' },
    { key: 'junk',               label: 'Junk',              icon: 'delete',          color: '#94A3B8', bg: '#f8fafc' },
    { key: 'converted',          label: 'Converted',         icon: 'stars',           color: '#EC4899', bg: '#fdf4ff' },
    { key: 'unused',             label: 'Unused',            icon: 'block',           color: '#CBD5E1', bg: '#f8fafc' },
];

const AdminAnalytics = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState({ totalLeads: 0, freshLeads: 0, convertedLeads: 0, totalCallsToday: 0 });
    const [compStats, setCompStats] = useState({ summary: { total: 0, converted: 0, junk: 0 }, growth: { total: 0, converted: 0, junk: 0 }, domainBreakdown: [], sourceBreakdown: [] });
    const [funnel, setFunnel] = useState({ total: 0, assigned: 0, contacted: 0, followups: 0, converted: 0 });
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    // Team Analysis State
    const [teamData, setTeamData] = useState({ managers: [], leaders: [], specialists: [] });
    const [teamLoading, setTeamLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [memberMonthly, setMemberMonthly] = useState([]);
    const [memberLoading, setMemberLoading] = useState(false);
    const [activeRoleTab, setActiveRoleTab] = useState('specialists');
    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const drawerRef = useRef(null);

    // Outcome logs
    const [selectedOutcome, setSelectedOutcome] = useState(null);
    const [outcomeLogs, setOutcomeLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [sourceFilter, setSourceFilter] = useState('');
    const [uniqueSources, setUniqueSources] = useState([]);
    const [logsPage, setLogsPage] = useState(1);
    const [totalLogsPages, setTotalLogsPages] = useState(1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, funnelRes, boardRes, compRes] = await Promise.allSettled([
                axios.get(`${API}/api/adv-reports/admin-global-stats`),
                axios.get(`${API}/api/adv-reports/funnel`),
                axios.get(`${API}/api/adv-reports/leaderboard`),
                axios.get(`${API}/api/adv-reports/comprehensive-stats?month=${selectedMonth}&year=${selectedYear}`)
            ]);
            if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
            if (funnelRes.status === 'fulfilled') setFunnel(funnelRes.value.data);
            if (boardRes.status === 'fulfilled') setLeaderboard(boardRes.value.data || []);
            if (compRes.status === 'fulfilled') setCompStats(compRes.value.data);
        } catch (err) {
            toast.error("Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamAnalysis = async () => {
        setTeamLoading(true);
        try {
            const res = await axios.get(`${API}/api/adv-reports/team-analysis?month=${selectedMonth}&year=${selectedYear}`);
            setTeamData(res.data || { managers: [], leaders: [], specialists: [] });
        } catch {
            toast.error("Failed to fetch team analysis");
        } finally {
            setTeamLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchTeamAnalysis();
    }, [selectedMonth, selectedYear]);

    // Close drawer on outside click
    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setDrawerOpen(false);
            }
        };
        if (drawerOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [drawerOpen]);

    const fetchOutcomeLogs = async (member, outcome, source = '', page = 1) => {
        // If clicking same outcome with no source filter and on page 1, toggle close
        if (selectedOutcome === outcome && source === sourceFilter && source === '' && page === 1) {
            setSelectedOutcome(null);
            setOutcomeLogs([]);
            setSourceFilter('');
            setLogsPage(1);
            return;
        }

        setSelectedOutcome(outcome);
        setSourceFilter(source);
        setLogsPage(page);
        setLogsLoading(true);

        try {
            const res = await axios.get(
                `${API}/api/adv-reports/member-outcome-logs?memberId=${member._id}&outcome=${outcome}&month=${selectedMonth}&year=${selectedYear}${source ? `&source=${encodeURIComponent(source)}` : ''}&page=${page}&limit=20`
            );
            const logs = res.data?.logs || [];
            setOutcomeLogs(logs);
            setTotalLogsPages(res.data?.pages || 1);

            // Extract unique raw source values (as stored in DB) for filter dropdown
            if (source === '' && page === 1) {
                const rawSources = [...new Set(
                    logs.map(l => l.sourceRaw || l.source?.replace(/\s+/g, '_').toLowerCase()).filter(Boolean)
                )].sort();
                setUniqueSources(rawSources);
            }
        } catch {
            toast.error('Failed to load call logs');
        } finally {
            setLogsLoading(false);
        }
    };

    const handleMarkDialed = async (leadId) => {
        if (!window.confirm("Are you sure you want to reset this lead to 'Dialed'? This will delete its current outcome and logs.")) return;
        
        try {
            await axios.put(`${API}/api/adv-leads/make-dialed/${leadId}`);
            toast.success("Lead reset to Dialed status");
            // Re-fetch only the logs for the current outcome to reflect changes
            fetchOutcomeLogs(selectedMember, selectedOutcome, sourceFilter);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset lead");
        }
    };

    const openMemberDrawer = async (member) => {
        setSelectedMember(member);
        setDrawerOpen(true);
        setMemberMonthly([]);
        setMemberLoading(true);
        setSelectedOutcome(null);
        setOutcomeLogs([]);
        try {
            const res = await axios.get(`${API}/api/adv-reports/member-monthly?memberId=${member._id}&year=${selectedYear}`);
            setMemberMonthly(res.data || []);
        } catch {
            toast.error("Failed to fetch member trend");
        } finally {
            setMemberLoading(false);
        }
    };

    const calculateWidth = (val) => {
        if (!funnel.total || funnel.total === 0) return '5%';
        const pct = Math.max(5, (val / funnel.total) * 100);
        return `${pct}%`;
    };

    const fmt = (n) => (n || 0).toLocaleString('en-IN');
    const fmtRs = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    const StatusIndicator = ({ value }) => (
        <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: '600',
            color: value >= 0 ? '#10B981' : '#EF4444',
            background: value >= 0 ? '#ecfdf5' : '#fef2f2',
            padding: '2px 8px', borderRadius: '12px', marginTop: '5px'
        }}>
            {value >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(value)}%
        </span>
    );

    // Filter members by search
    const getFilteredMembers = () => {
        const list = teamData[activeRoleTab] || [];
        if (!teamSearchQuery.trim()) return list;
        const q = teamSearchQuery.toLowerCase();
        return list.filter(m => 
            (m.name || '').toLowerCase().includes(q) ||
            (m.team || '').toLowerCase().includes(q)
        );
    };

    // Rank badge
    const RankBadge = ({ idx }) => {
        if (idx === 0) return <span style={{ fontSize: '20px' }}>🥇</span>;
        if (idx === 1) return <span style={{ fontSize: '20px' }}>🥈</span>;
        if (idx === 2) return <span style={{ fontSize: '20px' }}>🥉</span>;
        return <span style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', minWidth: '24px', textAlign: 'center' }}>#{idx + 1}</span>;
    };

    // ── Custom Tooltip for recharts ──
    const RevenueTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{ background: '#1e293b', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', minWidth: '160px' }}>
                <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{label}</p>
                {payload.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: p.color, fontSize: '13px', fontWeight: '700' }}>
                        <span>{p.name}</span>
                        <span>₹{(p.value || 0).toLocaleString('en-IN')}</span>
                    </div>
                ))}
            </div>
        );
    };

    const LeadTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div style={{ background: '#1e293b', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{label}</p>
                {payload.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', color: p.color, fontSize: '13px', fontWeight: '700' }}>
                        <span>{p.name}</span>
                        <span>{p.value || 0}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return (
        <div id="create-marketing-team" className="admin-content-wrap">
            <div className="coursetable" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div className="loader">Loading analytics...</div>
            </div>
        </div>
    );

    const roleTabs = [
        { key: 'specialists', label: 'SR Specialists', icon: 'support_agent', count: teamData.specialists?.length || 0 },
        { key: 'leaders',     label: 'Team Leaders',   icon: 'manage_accounts', count: teamData.leaders?.length || 0 },
        { key: 'managers',    label: 'Managers',        icon: 'admin_panel_settings', count: teamData.managers?.length || 0 },
    ];

    const filteredMembers = getFilteredMembers();

    return (
        <div id="create-marketing-team" className="admin-content-wrap">
            <Toaster position="top-center" />
            
            {/* Header with Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Admin Insights Dashboard</h1>
                    <p style={{ margin: '5px 0 0', color: '#666' }}>Performance analysis and lead breakdown</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#fff', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Calendar size={18} color="#1890ff" />
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}>
                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: '600', cursor: 'pointer' }}>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {[
                    { label: 'Total Leads', value: compStats.summary.total, growth: compStats.growth.total, icon: <Database color="#1890ff" />, color: '#1890ff' },
                    { label: 'Conversions', value: compStats.summary.converted, growth: compStats.growth.converted, icon: <Target color="#52c41a" />, color: '#52c41a' },
                    { label: 'Junk Leads', value: compStats.summary.junk, growth: compStats.growth.junk, icon: <Info color="#ff4d4f" />, color: '#ff4d4f' },
                    { label: 'Calls Today', value: stats.totalCallsToday, icon: <PhoneCall color="#eb2f96" />, color: '#eb2f96' }
                ].map((kpi, i) => (
                    <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderBottom: `4px solid ${kpi.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#888', fontWeight: '500' }}>{kpi.label}</span>
                            {kpi.icon}
                        </div>
                        <h2 style={{ fontSize: '28px', margin: '5px 0' }}>{(kpi.value || 0).toLocaleString()}</h2>
                        {kpi.growth !== undefined && <StatusIndicator value={kpi.growth} />}
                    </div>
                ))}
            </div>

            {/* Analytics Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px', marginBottom: '30px' }}>
                {/* Domain Analysis - FULL WIDTH & HORIZONTAL */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BarChart2 size={20} color="#6366f1" /> Analysis by Domain — {months[selectedMonth-1]} {selectedYear}
                    </h3>
                    <div style={{ height: Math.max(400, (compStats.domainBreakdown?.length || 0) * 35) + 'px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                layout="vertical" 
                                data={compStats.domainBreakdown} 
                                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis 
                                    dataKey="domain" 
                                    type="category" 
                                    width={140} 
                                    stroke="#64748b" 
                                    fontSize={11} 
                                    fontWeight="600"
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="total" fill="#1890ff" name="Total Leads" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="converted" fill="#52c41a" name="Converted" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="junk" fill="#ff4d4f" name="Junk" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Analysis - Keep as second chart */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px' }}>Analysis by Source</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={compStats.sourceBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="source" />
                                <YAxis />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                                <Legend />
                                <Bar dataKey="total" fill="#6366f1" name="Total Leads" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '25px', marginBottom: '40px' }}>
                {/* Funnel */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px' }}>Conversion Funnel Efficiency</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { label: 'Total Leads', value: funnel.total, color: '#1890ff' },
                            { label: 'Assigned', value: funnel.assigned, color: '#40a9ff' },
                            { label: 'Contacted', value: funnel.contacted, color: '#69c0ff' },
                            { label: 'Follow-ups', value: funnel.followups, color: '#91d5ff' },
                            { label: 'Converted ✅', value: funnel.converted, color: '#52c41a' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '130px', fontSize: '14px', color: '#666', fontWeight: '500' }}>{item.label}</div>
                                <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '6px', height: '32px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ width: calculateWidth(item.value), background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '12px', color: '#fff', fontSize: '13px', fontWeight: '700', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                        {item.value}
                                    </div>
                                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#999' }}>
                                        {funnel.total > 0 ? ((item.value / funnel.total) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px' }}>🏆 Performance Leaderboard</h3>
                    {leaderboard.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>No data for current filters.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
                                        <th style={{ padding: '12px 8px', color: '#888', fontWeight: '600' }}>Rank</th>
                                        <th style={{ padding: '12px 8px', color: '#888', fontWeight: '600' }}>Specialist</th>
                                        <th style={{ padding: '12px 8px', color: '#888', fontWeight: '600', textAlign: 'right' }}>Conv.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.slice(0, 5).map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                            <td style={{ padding: '12px 8px' }}>
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span style={{ marginLeft: '8px', color: '#999' }}>{idx + 1}</span>}
                                            </td>
                                            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{item.name}</td>
                                            <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700', color: '#52c41a' }}>{item.conversions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TEAM ANALYSIS SECTION                                   */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div style={{ marginTop: '10px' }}>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={24} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>Team Analysis</h2>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                                Click any member to view drill-down analytics & revenue
                            </p>
                        </div>
                    </div>
                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', minWidth: '260px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#94a3b8' }}>search</span>
                        <input
                            value={teamSearchQuery}
                            onChange={e => setTeamSearchQuery(e.target.value)}
                            placeholder="Search team members..."
                            style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: '500', color: '#1e293b', background: 'transparent', width: '100%' }}
                        />
                    </div>
                </div>

                {/* Role Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', width: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    {roleTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveRoleTab(tab.key)}
                            style={{
                                padding: '10px 20px', borderRadius: '10px', border: 'none',
                                background: activeRoleTab === tab.key ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                                color: activeRoleTab === tab.key ? '#fff' : '#64748b',
                                fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: activeRoleTab === tab.key ? '0 4px 12px rgba(99,102,241,0.35)' : 'none'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
                            {tab.label}
                            <span style={{
                                padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                                background: activeRoleTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                                color: activeRoleTab === tab.key ? '#fff' : '#6366f1'
                            }}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Members Grid */}
                {teamLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'center', color: '#64748b' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '40px', animation: 'spin 1.5s linear infinite', display: 'block', marginBottom: '12px', color: '#6366f1' }}>sync</span>
                            <p style={{ fontWeight: '600' }}>Loading team data...</p>
                        </div>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }}>group_off</span>
                        <p style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>
                            {teamSearchQuery ? `No members match "${teamSearchQuery}"` : 'No members in this category'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
                        {filteredMembers.map((member, idx) => {
                            const convRate = member.totalLeads > 0
                                ? ((member.converted / member.totalLeads) * 100).toFixed(1)
                                : '0.0';
                            return (
                                <div
                                    key={member._id}
                                    onClick={() => openMemberDrawer(member)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.15)';
                                        e.currentTarget.style.borderColor = '#a5b4fc';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                >
                                    {/* Rank accent */}
                                    {idx < 3 && (
                                        <div style={{ position: 'absolute', top: '0', right: '0', width: '0', height: '0', borderStyle: 'solid', borderWidth: '0 40px 40px 0', borderColor: `transparent ${idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#cd7c2f'} transparent transparent` }} />
                                    )}

                                    {/* Member Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, ${['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'][idx % 6]}, ${['#a855f7','#34d399','#fbbf24','#f87171','#a78bfa','#f472b6'][idx % 6]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                                            {(member.name || '?')[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <RankBadge idx={idx} />
                                                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</h3>
                                            </div>
                                            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                                                {member.designation} • <span style={{ color: '#6366f1', fontWeight: '600' }}>{member.team}</span>
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#6366f1' }}>{fmt(member.totalLeads)}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Total Leads</div>
                                        </div>
                                    </div>

                                    {/* Outcome Chips Row */}
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                        {OUTCOMES.map(o => (
                                            <div key={o.key} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: o.bg, borderRadius: '8px', border: `1px solid ${o.color}20` }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '13px', color: o.color }}>
                                                    {o.icon}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: '700', color: o.color }}>
                                                    {fmt(member[o.key] || 0)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Revenue & Conversion Footer */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>{fmtRs(member.totalRevenue)}</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Rev.</div>
                                        </div>
                                        <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#f59e0b' }}>{fmtRs(member.pendingRevenue)}</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#6366f1' }}>{convRate}%</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Conv. Rate</div>
                                        </div>
                                    </div>

                                    {/* View Details Hint */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '12px', color: '#a5b4fc', fontSize: '12px', fontWeight: '600' }}>
                                        <span>View full analytics</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SIDE DRAWER — MEMBER DRILL-DOWN                         */}
            {/* ═══════════════════════════════════════════════════════ */}

            {/* Overlay */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}
                />
            )}

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                style={{
                    position: 'fixed', top: 0, right: 0, height: '100vh', width: 'min(680px, 95vw)',
                    background: '#fff', zIndex: 1001,
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column', overflowY: 'auto'
                }}
            >
                {selectedMember && (
                    <>
                        {/* Drawer Header */}
                        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', border: '2px solid rgba(255,255,255,0.3)' }}>
                                        {(selectedMember.name || '?')[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>{selectedMember.name}</h2>
                                        <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '13px', fontWeight: '500' }}>
                                            {selectedMember.designation} · {selectedMember.team}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.2s' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Revenue Summary in header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: 'Total Revenue', value: fmtRs(selectedMember.totalRevenue), icon: <DollarSign size={16} />, },
                                    { label: 'Pending', value: fmtRs(selectedMember.pendingRevenue), icon: <AlertCircle size={16} />, },
                                    { label: 'Total Leads', value: fmt(selectedMember.totalLeads), icon: <BarChart2 size={16} />, },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.85, marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>
                                            {s.icon} {s.label}
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '800' }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Drawer Body */}
                        <div style={{ padding: '24px 28px', flex: 1 }}>
                            {/* All 9 Outcome Breakdown */}
                            <div style={{ marginBottom: '28px' }}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Award size={18} color="#6366f1" /> Lead Outcome Breakdown
                                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Click any card to see call logs</span>
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {OUTCOMES.map(o => {
                                        const val = selectedMember[o.key] || 0;
                                        const pct = selectedMember.totalLeads > 0 ? ((val / selectedMember.totalLeads) * 100).toFixed(1) : '0.0';
                                        const isActive = selectedOutcome === o.key;
                                        return (
                                            <div
                                                key={o.key}
                                                onClick={() => {
                                                    setSourceFilter(''); // Reset filter when switching outcomes
                                                    fetchOutcomeLogs(selectedMember, o.key);
                                                }}
                                                style={{
                                                    background: isActive ? o.color : o.bg,
                                                    borderRadius: '12px', padding: '12px 14px',
                                                    border: `2px solid ${isActive ? o.color : o.color + '20'}`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    transform: isActive ? 'translateY(-2px)' : 'none',
                                                    boxShadow: isActive ? `0 6px 16px ${o.color}35` : 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isActive ? '#fff' : o.color }}>{o.icon}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: isActive ? '#fff' : o.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{o.label}</span>
                                                </div>
                                                <div style={{ fontSize: '22px', fontWeight: '800', color: isActive ? '#fff' : o.color, lineHeight: 1 }}>{fmt(val)}</div>
                                                <div style={{ marginTop: '8px', height: '3px', background: isActive ? 'rgba(255,255,255,0.3)' : `${o.color}20`, borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: isActive ? '#fff' : o.color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                                                </div>
                                                <div style={{ fontSize: '11px', color: isActive ? 'rgba(255,255,255,0.8)' : '#94a3b8', fontWeight: '600', marginTop: '4px' }}>{pct}% of total</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ── Call Logs Panel ── */}
                                {selectedOutcome && (
                                    <div style={{ marginTop: '20px', borderRadius: '16px', border: `1px solid ${OUTCOMES.find(o => o.key === selectedOutcome)?.color}30`, overflow: 'hidden', animation: 'fadeIn 0.25s ease' }}>
                                        {/* Panel Header */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: `${OUTCOMES.find(o => o.key === selectedOutcome)?.color}10`, borderBottom: `1px solid ${OUTCOMES.find(o => o.key === selectedOutcome)?.color}20` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: OUTCOMES.find(o => o.key === selectedOutcome)?.color }}>
                                                    {OUTCOMES.find(o => o.key === selectedOutcome)?.icon}
                                                </span>
                                                <span style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>
                                                    {OUTCOMES.find(o => o.key === selectedOutcome)?.label} Leads
                                                </span>
                                                {!logsLoading && (
                                                    <span style={{ background: OUTCOMES.find(o => o.key === selectedOutcome)?.color, color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                                                        {outcomeLogs.length} records
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {/* Source Filter Dropdown */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                                    <Filter size={14} color="#64748b" />
                                                    <select 
                                                        value={sourceFilter}
                                                        onChange={(e) => fetchOutcomeLogs(selectedMember, selectedOutcome, e.target.value)}
                                                        style={{ border: 'none', background: 'transparent', fontSize: '12px', fontWeight: '600', color: '#475569', outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="">All Sources</option>
                                                        {uniqueSources.map(s => (
                                                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <button onClick={() => { setSelectedOutcome(null); setOutcomeLogs([]); setSourceFilter(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', display: 'flex', alignItems: 'center', padding: '4px' }}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Logs Body */}
                                        {logsLoading ? (
                                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#6366f1', animation: 'spin 1.5s linear infinite' }}>sync</span>
                                                <p style={{ marginTop: '10px', color: '#64748b', fontSize: '13px' }}>Fetching call logs...</p>
                                            </div>
                                        ) : outcomeLogs.length === 0 ? (
                                            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>inbox</span>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>No call logs found for this outcome</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                                        <thead>
                                                            <tr style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1 }}>
                                                                {['#', 'Lead Name', 'Phone', 'Source', 'Domain', 'Date', 'Summary', 'Action'].map(h => (
                                                                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '700', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {outcomeLogs.map((log, i) => (
                                                                <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                                                    onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                                                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontWeight: '700', fontSize: '12px' }}>{(logsPage - 1) * 20 + i + 1}</td>
                                                                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>{log.name}</td>
                                                                    <td style={{ padding: '10px 12px', color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>
                                                                        {log.phone ? log.phone.slice(0, -4) + '••••' : '—'}
                                                                    </td>
                                                                    <td style={{ padding: '10px 12px' }}>
                                                                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', fontSize: '11px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
                                                                            {log.source || '—'}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ padding: '10px 12px', color: '#6366f1', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' }}>{log.domain}</td>
                                                                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                                        {log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                                                                    </td>
                                                                    <td style={{ padding: '10px 12px', color: '#475569', fontSize: '13px', minWidth: '180px', lineHeight: '1.5' }}>
                                                                        {log.summary || '—'}
                                                                    </td>
                                                                    <td style={{ padding: '10px 12px' }}>
                                                                        <button
                                                                            onClick={() => handleMarkDialed(log._id)}
                                                                            style={{
                                                                                padding: '6px 14px',
                                                                                borderRadius: '8px',
                                                                                border: 'none',
                                                                                background: '#8b5cf6',
                                                                                color: '#fff',
                                                                                fontSize: '11px',
                                                                                fontWeight: '700',
                                                                                cursor: 'pointer',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '6px',
                                                                                boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
                                                                            }}
                                                                        >
                                                                            <RotateCw size={12} /> Dialed
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* Pagination Controls */}
                                                {totalLogsPages > 1 && (
                                                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                                            Page <span style={{ color: '#1e293b' }}>{logsPage}</span> of {totalLogsPages}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button 
                                                                disabled={logsPage === 1 || logsLoading}
                                                                onClick={() => fetchOutcomeLogs(selectedMember, selectedOutcome, sourceFilter, logsPage - 1)}
                                                                style={{
                                                                    padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0',
                                                                    background: logsPage === 1 ? '#f1f5f9' : '#fff',
                                                                    color: logsPage === 1 ? '#94a3b8' : '#475569',
                                                                    fontSize: '12px', fontWeight: '700', cursor: logsPage === 1 ? 'not-allowed' : 'pointer',
                                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                                }}
                                                            >
                                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span> Previous
                                                            </button>
                                                            <button 
                                                                disabled={logsPage >= totalLogsPages || logsLoading}
                                                                onClick={() => fetchOutcomeLogs(selectedMember, selectedOutcome, sourceFilter, logsPage + 1)}
                                                                style={{
                                                                    padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0',
                                                                    background: logsPage >= totalLogsPages ? '#f1f5f9' : '#fff',
                                                                    color: logsPage >= totalLogsPages ? '#94a3b8' : '#475569',
                                                                    fontSize: '12px', fontWeight: '700', cursor: logsPage >= totalLogsPages ? 'not-allowed' : 'pointer',
                                                                    display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'center'
                                                                }}
                                                            >
                                                                Next <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Monthly Trend Charts */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BarChart2 size={18} color="#6366f1" /> Monthly Lead Trend — {selectedYear}
                                </h3>
                                {memberLoading ? (
                                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#6366f1', animation: 'spin 1.5s linear infinite' }}>sync</span>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ height: '220px', marginBottom: '20px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={memberMonthly} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                                    <Tooltip content={<LeadTooltip />} />
                                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                                                    <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="interested" name="Interested" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="not_interested" name="Not Interested" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="junk" name="Junk" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Revenue Trend */}
                                        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <DollarSign size={18} color="#10b981" /> Monthly Revenue Trend
                                        </h3>
                                        <div style={{ height: '200px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={memberMonthly} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                    <defs>
                                                        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="gradPend" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                                                    <Tooltip content={<RevenueTooltip />} />
                                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#gradRev)" />
                                                    <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} fill="url(#gradPend)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
            `}</style>
        </div>
    );
};

export default AdminAnalytics;
