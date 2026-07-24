import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const StudentAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/student-demographics`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Student Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="si-card">
                    <div className="si-card-title">Top Languages</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data.languages} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                                    {data.languages.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="si-card">
                    <div className="si-card-title">Top Colleges</div>
                    <div className="si-chart-container">
                        <ResponsiveContainer>
                            <BarChart layout="vertical" data={data.colleges}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="_id" type="category" width={150} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics;
