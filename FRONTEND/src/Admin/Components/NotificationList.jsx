import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API}/api/adv-notifications/${userId}`);
            setNotifications(response.data);
        } catch (err) {
            console.error("Failed to fetch notifications");
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API}/api/adv-notifications/read/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error("Failed to mark as read");
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [userId]);

    return (
        <div className="notification-panel" style={{ position: 'absolute', right: '20px', top: '70px', background: '#fff', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Notifications</div>
            {notifications.length === 0 ? <p style={{ padding: '20px', textAlign: 'center' }}>No new notifications</p> : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {notifications.map(n => (
                        <li key={n._id} onClick={() => markAsRead(n._id)} style={{ padding: '15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer', background: n.isRead ? '#fff' : '#f0faff' }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{n.title}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div>
                            <div style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>{new Date(n.createdAt).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;
