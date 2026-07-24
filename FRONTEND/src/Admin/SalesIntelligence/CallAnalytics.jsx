import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CallAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/call-analytics`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Call Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="si-card">
                    <div className="si-card-title">Call Outcomes</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data.outcomes} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                                    {data.outcomes.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="si-card">
                    <div className="si-card-title">Call Volume by Hour</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <BarChart data={data.callsByHour}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" tickFormatter={(tick) => {
                                    const hour = parseInt(tick);
                                    if (hour === 0) return '12 AM';
                                    if (hour < 12) return `${hour} AM`;
                                    if (hour === 12) return '12 PM';
                                    return `${hour - 12} PM`;
                                }} />
                                <YAxis />
                                <Tooltip labelFormatter={(label) => {
                                    const hour = parseInt(label);
                                    if (hour === 0) return '12 AM';
                                    if (hour < 12) return `${hour} AM`;
                                    if (hour === 12) return '12 PM';
                                    return `${hour - 12} PM`;
                                }} />
                                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallAnalytics;
