import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({ totalLeads: 0, freshLeads: 0, convertedLeads: 0, totalCallsToday: 0 });
    const [funnel, setFunnel] = useState({ total: 0, assigned: 0, contacted: 0, followups: 0, converted: 0 });
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, funnelRes, boardRes] = await Promise.allSettled([
                axios.get(`${API}/api/adv-reports/admin-global-stats`),
                axios.get(`${API}/api/adv-reports/funnel`),
                axios.get(`${API}/api/adv-reports/leaderboard`)
            ]);

            if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
            if (funnelRes.status === 'fulfilled') setFunnel(funnelRes.value.data);
            if (boardRes.status === 'fulfilled') setLeaderboard(boardRes.value.data || []);
        } catch (err) {
            toast.error("Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateWidth = (val) => {
        if (!funnel.total || funnel.total === 0) return '5%';
        const pct = Math.max(5, (val / funnel.total) * 100);
        return `${pct}%`;
    };

    if (loading) return (
        <div id="create-marketing-team">
            <div className="coursetable"><p>Loading analytics...</p></div>
        </div>
    );

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />
            <div className="coursetable">
                <h1>ADV Analytics Dashboard</h1>

                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ padding: '20px', background: '#fff', borderLeft: '5px solid #1890ff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Total Leads</p>
                        <h2 style={{ margin: '5px 0 0' }}>{stats.totalLeads}</h2>
                    </div>
                    <div style={{ padding: '20px', background: '#fff', borderLeft: '5px solid #faad14', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Fresh Leads</p>
                        <h2 style={{ margin: '5px 0 0' }}>{stats.freshLeads}</h2>
                    </div>
                    <div style={{ padding: '20px', background: '#fff', borderLeft: '5px solid #52c41a', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Conversions</p>
                        <h2 style={{ margin: '5px 0 0' }}>{stats.convertedLeads}</h2>
                    </div>
                    <div style={{ padding: '20px', background: '#fff', borderLeft: '5px solid #eb2f96', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                        <p style={{ margin: 0, color: '#888' }}>Calls Today</p>
                        <h2 style={{ margin: '5px 0 0' }}>{stats.totalCallsToday}</h2>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Funnel */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <h3>Conversion Funnel</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                            {[
                                { label: 'Total Leads', value: funnel.total, color: '#1890ff' },
                                { label: 'Assigned', value: funnel.assigned, color: '#40a9ff' },
                                { label: 'Contacted', value: funnel.contacted, color: '#69c0ff' },
                                { label: 'Follow-ups', value: funnel.followups, color: '#91d5ff' },
                                { label: 'Converted ✅', value: funnel.converted, color: '#52c41a' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '110px', fontSize: '13px', color: '#555', flexShrink: 0 }}>{item.label}</div>
                                    <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '4px', height: '28px', overflow: 'hidden' }}>
                                        <div style={{ width: calculateWidth(item.value), background: item.color, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '8px', color: '#fff', fontSize: '13px', fontWeight: 'bold', transition: 'width 0.5s ease' }}>
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <h3>🏆 Top Specialists (Conversions)</h3>
                        {leaderboard.length === 0 ? (
                            <p style={{ color: '#888' }}>No conversion data yet.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Conversions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.conversions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
