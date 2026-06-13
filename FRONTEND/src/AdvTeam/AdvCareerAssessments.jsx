import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const AdvCareerAssessments = ({ isAdmin }) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssessment, setSelectedAssessment] = useState(null);

    const userDesignation = isAdmin ? "admin" : (localStorage.getItem("designation") || "ADV Leader");
    const advUserId = isAdmin ? localStorage.getItem("adminToken") : (localStorage.getItem("advTeamId") || localStorage.getItem("id"));

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await axios.get(`${API}/careerassessment?userId=${advUserId}&role=${userDesignation}`);
                setAssessments(res.data);
            } catch (err) {
                console.error("Failed to fetch assessments");
                toast.error("Failed to fetch assessments");
            } finally {
                setLoading(false);
            }
        };
        fetchAssessments();
    }, []);

    return (
        <div id="create-marketing-team">
            <div className="coursetable" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>
                    Skill Evaluation Tests ({userDesignation})
                </h1>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '40px' }}>Loading assessments...</p>
            ) : (
                <div style={{ overflowX: 'auto', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>#</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>City</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Primary Goal</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Score</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Payment</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Slot Booked</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((a, i) => (
                                <tr key={a._id || i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{i + 1}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#1890ff' }}>{a.fullName}</td>
                                    <td style={{ padding: '12px' }}>{a.email}</td>
                                    <td style={{ padding: '12px' }}>{a.mobileNumber}</td>
                                    <td style={{ padding: '12px' }}>{a.city}</td>
                                    <td style={{ padding: '12px' }}>{a.currentStatus}</td>
                                    <td style={{ padding: '12px' }}>{a.primaryCareerGoal}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <div style={{ 
                                            display: 'inline-block',
                                            padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', 
                                            background: a.confidenceScore >= 7 ? '#f6ffed' : '#f5f5f5', 
                                            color: a.confidenceScore >= 7 ? '#52c41a' : '#595959', 
                                            border: `1px solid ${a.confidenceScore >= 7 ? '#b7eb8f' : '#d9d9d9'}`, 
                                            minWidth: '30px' 
                                        }}>
                                            {a.confidenceScore || 0}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: a.paymentStatus === 'Success' ? '#e6ffed' : '#fff0f6', color: a.paymentStatus === 'Success' ? '#52c41a' : '#eb2f96', fontSize: '12px', fontWeight: 'bold' }}>
                                            {a.paymentStatus === 'Success' ? '₹101 Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                        {a.bookedDate ? `${new Date(a.bookedDate).toLocaleDateString()} ${a.bookedTimeSlot}` : 'Not Booked'}
                                    </td>
                                    <td style={{ padding: '12px' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button 
                                            onClick={() => setSelectedAssessment(a)}
                                            style={{ padding: '6px 12px', background: '#fff', border: '1px solid #1890ff', color: '#1890ff', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseEnter={(e) => { e.target.style.background = '#1890ff'; e.target.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#1890ff'; }}
                                        >
                                            <i className="fa fa-eye"></i> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {assessments.length === 0 && (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No skill evaluation tests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedAssessment && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 2000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
                        width: '600px', maxHeight: '85vh', overflowY: 'auto',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                            <h2 style={{ margin: 0, color: '#1a1a1a', fontSize: '20px' }}>📝 Assessment Details</h2>
                            <button onClick={() => setSelectedAssessment(null)} style={{ border: 'none', background: '#f5f5f5', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {Object.entries(selectedAssessment)
                                .filter(([key]) => !['_id', '__v', 'createdAt'].includes(key))
                                .map(([key, val]) => (
                                <div key={key} style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{val || '—'}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            <button onClick={() => setSelectedAssessment(null)} style={{ padding: '10px 24px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#096dd9'} onMouseLeave={(e) => e.target.style.background = '#1890ff'}>Close Details</button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default AdvCareerAssessments;
