import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgramAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/revenue`).then(res => {
            setData(res.data.revenueByProgram);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Program Analytics</h2>
            
            <div className="si-card">
                <div className="si-card-title">Admissions by Program</div>
                <div className="si-chart-container">
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="admissions" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="si-card">
                <div className="si-card-title">Program Revenue Table</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px' }}>Program</th>
                            <th style={{ padding: '12px' }}>Admissions</th>
                            <th style={{ padding: '12px' }}>Collected (₹)</th>
                            <th style={{ padding: '12px' }}>Pending (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{row._id}</td>
                                <td style={{ padding: '12px' }}>{row.admissions}</td>
                                <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>₹{row.totalCollected.toLocaleString()}</td>
                                <td style={{ padding: '12px', color: '#ef4444' }}>₹{row.totalRemaining.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramAnalytics;
