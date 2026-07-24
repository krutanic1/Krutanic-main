import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const LeadAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/lead-sources`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Lead Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="si-card">
                    <div className="si-card-title">Lead Sources</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data.sources} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                                    {data.sources.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="si-card">
                    <div className="si-card-title">Lead Domains</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <BarChart data={data.domains}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadAnalytics;
