import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../API';
import { BrainCircuit, AlertTriangle } from 'lucide-react';

const AiInsights = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/sales-intelligence/ai-insights`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading AI Insights...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BrainCircuit color="#6366f1" /> AI Insights & Predictions
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="si-card">
                    <div className="si-card-title">High Probability Leads (Likely to Convert)</div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.highQualityLeads.map((lead, idx) => (
                            <li key={idx} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{lead.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{lead.opted_domain} • {lead.stage}</div>
                                </div>
                                <div style={{ color: '#10b981', fontWeight: 'bold' }}>Score: {lead.score}</div>
                            </li>
                        ))}
                        {data.highQualityLeads.length === 0 && <li style={{ color: '#94a3b8' }}>No high probability leads currently.</li>}
                    </ul>
                </div>

                <div className="si-card">
                    <div className="si-card-title" style={{ color: '#ef4444' }}>
                        <AlertTriangle color="#ef4444" size={18} /> Leads at Risk (Needs Immediate Follow-up)
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.needsFollowUp.map((lead, idx) => (
                            <li key={idx} style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{lead.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Assigned to: {lead.owner_name}</div>
                                </div>
                                <div style={{ color: '#ef4444', fontSize: '12px' }}>
                                    Missed: {new Date(lead.next_followup_at).toLocaleDateString()}
                                </div>
                            </li>
                        ))}
                        {data.needsFollowUp.length === 0 && <li style={{ color: '#94a3b8' }}>No leads at risk currently.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AiInsights;
