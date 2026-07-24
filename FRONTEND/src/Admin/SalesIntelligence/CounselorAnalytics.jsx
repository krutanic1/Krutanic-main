import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CounselorAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/counselor-leaderboard`).then(res => {
            setData(res.data.leaderboard);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Counselor Performance</h2>
            <div className="si-card">
                <div className="si-card-title">Top Converting Counselors</div>
                <div className="si-chart-container" style={{ height: '400px' }}>
                    <ResponsiveContainer>
                        <BarChart data={data.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="assignedLeads" fill="#6366f1" name="Assigned Leads" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="closedWon" fill="#10b981" name="Closed Won" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="si-card">
                <div className="si-card-title">Counselor Leaderboard</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px' }}>Rank</th>
                            <th style={{ padding: '12px' }}>Counselor</th>
                            <th style={{ padding: '12px' }}>Assigned Leads</th>
                            <th style={{ padding: '12px' }}>Conversions</th>
                            <th style={{ padding: '12px' }}>Conversion %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{idx + 1}</td>
                                <td style={{ padding: '12px' }}>{row._id}</td>
                                <td style={{ padding: '12px' }}>{row.assignedLeads}</td>
                                <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{row.closedWon}</td>
                                <td style={{ padding: '12px' }}>
                                    {row.assignedLeads > 0 ? ((row.closedWon / row.assignedLeads) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CounselorAnalytics;
