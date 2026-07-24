import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExecutiveDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API}/api/sales-intelligence/executive`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Executive Data...</div>;
    if (!data) return null;

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Executive Overview</h2>
            <div className="si-kpi-grid">
                <div className="si-kpi-card" style={{ borderColor: '#6366f1' }}>
                    <div className="si-kpi-label">Total Leads</div>
                    <div className="si-kpi-value">{data.totalLeads.toLocaleString()}</div>
                </div>
                <div className="si-kpi-card" style={{ borderColor: '#10b981' }}>
                    <div className="si-kpi-label">Booked Students</div>
                    <div className="si-kpi-value">{data.bookedStudents.toLocaleString()}</div>
                </div>
                <div className="si-kpi-card" style={{ borderColor: '#f59e0b' }}>
                    <div className="si-kpi-label">Conversion %</div>
                    <div className="si-kpi-value">{data.conversionRate}%</div>
                </div>
                <div className="si-kpi-card" style={{ borderColor: '#ef4444' }}>
                    <div className="si-kpi-label">Total Revenue</div>
                    <div className="si-kpi-value">₹{data.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="si-kpi-card" style={{ borderColor: '#8b5cf6' }}>
                    <div className="si-kpi-label">Pending Revenue</div>
                    <div className="si-kpi-value">₹{data.pendingRevenue.toLocaleString()}</div>
                </div>
                <div className="si-kpi-card" style={{ borderColor: '#ec4899' }}>
                    <div className="si-kpi-label">Calls Today</div>
                    <div className="si-kpi-value">{data.callsToday.toLocaleString()}</div>
                </div>
            </div>

            <div className="si-card">
                <div className="si-card-title">Leads Trend (Last 7 Days)</div>
                <div className="si-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.leadsTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="si-card">
                <div className="si-card-title">Revenue Trend (Last 7 Days)</div>
                <div className="si-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;
