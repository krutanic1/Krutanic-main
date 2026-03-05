import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadTimeline = ({ leadId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const response = await axios.get(`${API}/api/adv-leads/timeline/${leadId}`);
                setActivities(response.data);
            } catch (err) {
                console.error("Timeline fetch failed");
            } finally {
                setLoading(false);
            }
        };
        if (leadId) fetchTimeline();
    }, [leadId]);

    if (loading) return <p>Loading timeline...</p>;

    return (
        <div className="timeline-container" style={{ padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
            <h2>Interaction History</h2>
            {activities.length === 0 ? <p>No activities yet.</p> : (
                <ul style={{ listStyle: 'none', paddingLeft: '20px', borderLeft: '2px solid #1890ff' }}>
                    {activities.map((act, idx) => (
                        <li key={idx} style={{ marginBottom: '20px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: '#1890ff' }}></span>
                            <div style={{ fontWeight: 'bold' }}>{act.type} - {new Date(act.timestamp).toLocaleString()}</div>
                            <div style={{ color: '#666' }}>{act.description}</div>
                            {act.remark && <div style={{ fontStyle: 'italic', marginTop: '5px' }}>"{act.remark}"</div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LeadTimeline;
