import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const RevenueAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/revenue`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Revenue Analytics</h2>
            
            <div className="si-card">
                <div className="si-card-title">Monthly Collections</div>
                <div className="si-chart-container">
                    <ResponsiveContainer>
                        <LineChart data={data.monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="si-card">
                <div className="si-card-title">Revenue by Program</div>
                <div className="si-chart-container" style={{ height: '400px' }}>
                    <ResponsiveContainer>
                        <BarChart data={data.revenueByProgram}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalCollected" name="Collected Amount (₹)" fill="#10b981" />
                            <Bar dataKey="totalRemaining" name="Pending Amount (₹)" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueAnalytics;
