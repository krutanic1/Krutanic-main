import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/sales-funnel`).then(res => {
            const chartData = [
                { stage: 'Total Leads', count: res.data.totalLeads },
                { stage: 'Assigned', count: res.data.assigned },
                { stage: 'Contacted', count: res.data.contacted },
                { stage: 'Interested', count: res.data.interested },
                { stage: 'Demo Scheduled', count: res.data.demoScheduled },
                { stage: 'Booked', count: res.data.booked },
                { stage: 'Paid Full', count: res.data.paidFull }
            ];
            setData(chartData);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading Funnel...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Sales Funnel</h2>
            <div className="si-card">
                <div className="si-card-title">Funnel Progression</div>
                <div className="si-chart-container" style={{ height: '400px' }}>
                    <ResponsiveContainer>
                        <BarChart layout="vertical" data={data}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="stage" type="category" width={150} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
