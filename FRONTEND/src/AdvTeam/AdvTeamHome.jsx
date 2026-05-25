import axios from "axios";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import API from "../API";

const AdvTeamHome = () => {
  const [advEnrollments, setAdvEnrollments] = useState([]);
  const [advTeamMember, setAdvTeamMember] = useState([]);
  const [leads, setLeads] = useState([]); // New state for leads
  const [outcomeCounts, setOutcomeCounts] = useState({
    fresh: 0, interested: 0, follow_up: 0, callback_requested: 0,
    no_answer: 0, not_interested: 0, junk: 0, converted: 0, qualified: 0, total: 0
  });
  
  const advTeamName = localStorage.getItem("advTeamName");
  const userId = localStorage.getItem("advTeamId");
  const designation = localStorage.getItem("advTeamDesignation") || "";
  const isLeader = designation.toLowerCase().includes("leader");
  const isSpecialist = designation.toLowerCase().includes("specialist") || designation.toLowerCase().includes("sales") || designation.toLowerCase().includes("inside_sales");
  const apiRole = isSpecialist ? "SR Inside Sales Specialist" : isLeader ? "ADV Leader" : "ADV Manager";

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchDailyLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/api/adv-reports/adv-leaderboard`, {
        params: { date: today.toISOString().split('T')[0] }
      });
      setLeaderboardData(response.data);
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error);
    }
  };

  const fetchOutcomeCounts = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`${API}/api/adv-leads/get-outcome-counts`, {
        params: { role: apiRole, userId, strictlyOwned: true }
      });
      if (res.data) {
        setOutcomeCounts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch outcome counts", err);
    }
  };

  const fetchAdvEnrollments = async () => {
    try {
      const response = await axios.get(`${API}/getadvenrolls`);
      const enrollments = response.data.data || response.data;
      setAdvEnrollments(
        enrollments.filter(
          (item) => item.counselor && item.counselor === advTeamName
        )
      );
    } catch (error) {
      console.error("There was an error fetching advance enrollments:", error);
    }
  };

  const fetchAdvTeamMember = async () => {
    try {
      const response = await axios.get(`${API}/getadvteam`);
      setAdvTeamMember(response.data.filter((item) => item.fullname === advTeamName));
    } catch (error) {
      console.error("There was an error fetching advance team member:", error);
    }
  };

  useEffect(() => {
    fetchAdvTeamMember();
    fetchAdvEnrollments();
    fetchOutcomeCounts();
    fetchDailyLeaderboard();
  }, []);

  const totalRevenue = advEnrollments.reduce((acc, student) => acc + (student.programPrice || 0), 0);
  const bookedRevenue = advEnrollments.reduce((acc, student) => acc + (student.paidAmount || 0), 0);
  
  const creditedRevenue = advEnrollments.reduce((acc, student) => {
    const lastRemark = Array.isArray(student.remark) && student.remark.length > 0
      ? student.remark[student.remark.length - 1]
      : null;
    if (student.status === "fullPaid" || lastRemark === "Half_Cleared") {
      return acc + (student.paidAmount || 0);
    }
    return acc;
  }, 0);

  const pendingRevenue = totalRevenue - creditedRevenue;
  const totalBooked = advEnrollments.filter((s) => s.status === "booked").length;
  const totalFullPaid = advEnrollments.filter((s) => s.status === "fullPaid").length;
  const totalDefault = advEnrollments.filter((s) => s.status === "default").length;

  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (outcomeCounts.converted > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [outcomeCounts.converted]);

  const topCallers = [...leaderboardData].sort((a, b) => b.callCount - a.callCount).slice(0, 5);
  const topSpeakers = [...leaderboardData].sort((a, b) => b.talkTime - a.talkTime).slice(0, 5);
  const topRevenue = [...leaderboardData].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const formatTalkTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const LeadStatCard = ({ label, count, icon, color, bgColor, borderColor, isHuge = false }) => (
    <div style={{ 
      background: bgColor || '#fff', 
      border: `1px solid ${borderColor || '#eee'}`,
      padding: '24px',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: isHuge ? '160px' : '120px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} 
       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</h3>
        <div style={{ color: color, fontSize: '20px' }}>{icon}</div>
      </div>
      <p style={{ margin: '12px 0 4px 0', fontSize: isHuge ? '42px' : '32px', fontWeight: '800', color: color, lineHeight: '1' }}>{count}</p>
      {label === 'Converted' && showConfetti && isHuge && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
           <Confetti width={300} height={160} recycle={false} numberOfPieces={100} gravity={0.2} />
        </div>
      )}
    </div>
  );

  return (
    <div id="BdaPanel" style={{ padding: '30px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div className="welcome-message" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E293B', marginBottom: '8px' }}>Welcome to Advance Dashboard, {advTeamName}! 🎉</h2>
        <p style={{ fontSize: '16px', color: '#64748B' }}>Real-time overview of your pipeline and enrollment performance.</p>
      </div>

      {/* Primary Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <LeadStatCard label="Total Leads" count={outcomeCounts.total} icon="💎" color="#3B82F6" bgColor="#EFF6FF" borderColor="#BFDBFE" isHuge />
        <LeadStatCard label="Converted" count={outcomeCounts.converted} icon="🏆" color="#10B981" bgColor="#ECFDF5" borderColor="#A7F3D0" isHuge />
        <LeadStatCard label="Total Enrollments" count={advEnrollments.length} icon="👨‍🎓" color="#8B5CF6" bgColor="#F5F3FF" borderColor="#DDD6FE" isHuge />
        <div style={{ 
          background: 'linear-gradient(135deg, #1E293B, #0F172A)', 
          padding: '24px', 
          borderRadius: '20px', 
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>Booked Revenue</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: '800' }}>₹{bookedRevenue.toLocaleString()}</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748B' }}>From {totalBooked} bookings</p>
        </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '4px' }}></span>
        Lead Pipeline Breakdown
      </h3>
      
      {/* Detailed Pipeline Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <LeadStatCard label="Fresh Leads" count={outcomeCounts["Fresh Lead"]} icon="🆕" color="#64748B" />
        <LeadStatCard label="Attempting Contact" count={outcomeCounts["Attempting Contact"]} icon="📞" color="#F59E0B" />
        <LeadStatCard label="First Call Connected" count={outcomeCounts["First Call Connected"]} icon="🤝" color="#3B82F6" />
        <LeadStatCard label="Demo Conducted" count={outcomeCounts["Demo Conducted"]} icon="🖥️" color="#8B5CF6" />
        <LeadStatCard label="Closed Won" count={outcomeCounts["Closed Won"]} icon="🏆" color="#10B981" />
        <LeadStatCard label="Closed Lost" count={outcomeCounts["Closed Lost"]} icon="❌" color="#EF4444" />
      </div>

      {/* Funnel Visualization */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid #E2E8F0', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '30px', color: '#1E293B' }}>Conversion Funnel Efficiency</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                  { label: "Fresh Leads", count: outcomeCounts["Fresh Lead"] || 0, color: "#64748B" },
                  { label: "Attempting Contact", count: outcomeCounts["Attempting Contact"] || 0, color: "#F59E0B" },
                  { label: "First Call Connected", count: outcomeCounts["First Call Connected"] || 0, color: "#3B82F6" },
                  { label: "Demo Conducted", count: outcomeCounts["Demo Conducted"] || 0, color: "#8B5CF6" },
                  { label: "Closed Won", count: outcomeCounts["Closed Won"] || 0, color: "#10B981" }
              ].map((stage, idx, arr) => {
                  const total = outcomeCounts.total || 1;
                  const percentage = ((stage.count / total) * 100).toFixed(1);
                  const width = `${Math.max(percentage, 10)}%`;
                  
                  return (
                      <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '180px', fontSize: '13px', fontWeight: '700', color: '#64748B' }}>{stage.label}</div>
                          <div style={{ flex: 1, height: '32px', background: '#F1F5F9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                              <div style={{ 
                                  width: width, 
                                  height: '100%', 
                                  background: `linear-gradient(90deg, ${stage.color}dd, ${stage.color})`,
                                  transition: 'width 1s ease-out',
                                  display: 'flex',
                                  alignItems: 'center',
                                  paddingLeft: '12px',
                                  color: '#fff',
                                  fontSize: '11px',
                                  fontWeight: '800'
                              }}>
                                  {stage.count} ({percentage}%)
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '12px', height: '12px', background: '#8B5CF6', borderRadius: '4px' }}></span>
        Enrollment & Revenue Stats
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: "Booked", count: totalBooked, info: "Booked Payments", color: "#F59E0B", icon: "fa-calendar" },
          { label: "Full Paid", count: totalFullPaid, info: "Completed Payments", color: "#10B981", icon: "fa-check-circle" },
          { label: "Default", count: totalDefault, info: "Default Payments", color: "#EF4444", icon: "fa-exclamation-triangle" },
        ].map(stat => (
          <div key={stat.label} className="state-card" style={{ background: '#fff' }}>
            <div className="state-header" style={{ color: stat.color }}>
              <h3>{stat.label}</h3>
              <i className={`fa ${stat.icon}`}></i>
            </div>
            <p className="status-count" style={{ color: stat.color }}>{stat.count}</p>
            <p className="status-info" style={{ color: '#64748B' }}>{stat.info}</p>
          </div>
        ))}
      </div>

      <div className="revenue-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[
          { label: "Total Revenue", amount: totalRevenue, color: "#1E293B" },
          { label: "Booked Revenue", amount: bookedRevenue, color: "#3B82F6" },
          { label: "Credited Revenue", amount: creditedRevenue, color: "#10B981" },
          { label: "Pending Revenue", amount: pendingRevenue, color: "#EF4444" },
        ].map(rev => (
          <div key={rev.label} className="revenue-card" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase' }}>{rev.label}</h3>
            <p className="revenue-amount" style={{ color: rev.color, fontSize: '28px' }}>₹{rev.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Mini Leaderboard Widget */}
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginTop: '40px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '12px', height: '12px', background: '#F59E0B', borderRadius: '4px' }}></span>
        Today's Top Performers
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Top Revenue */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ color: '#3B82F6', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-money"></i> Top Revenue
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topRevenue.length > 0 && topRevenue[0].revenue > 0 ? (
              topRevenue.filter(u => u.revenue > 0).map((user, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: idx === 0 ? '#EFF6FF' : '#F8FAFC', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>#{idx + 1}</span>
                    <span style={{ fontWeight: '600', color: '#1E293B' }}>{user.name.split(' ')[0]}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#3B82F6' }}>₹{user.revenue.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94A3B8', textAlign: 'center', padding: '10px' }}>No revenue yet today</div>
            )}
          </div>
        </div>

        {/* Top Callers */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ color: '#F15B29', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-phone"></i> Top Callers
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topCallers.length > 0 && topCallers[0].callCount > 0 ? (
              topCallers.filter(u => u.callCount > 0).map((user, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: idx === 0 ? '#FFF7ED' : '#F8FAFC', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>#{idx + 1}</span>
                    <span style={{ fontWeight: '600', color: '#1E293B' }}>{user.name.split(' ')[0]}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#F15B29' }}>{user.callCount} calls</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94A3B8', textAlign: 'center', padding: '10px' }}>No calls yet today</div>
            )}
          </div>
        </div>

        {/* Top Talk Time */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ color: '#10B981', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa fa-microphone"></i> Top Talk Time
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topSpeakers.length > 0 && topSpeakers[0].talkTime > 0 ? (
              topSpeakers.filter(u => u.talkTime > 0).map((user, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: idx === 0 ? '#ECFDF5' : '#F8FAFC', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>#{idx + 1}</span>
                    <span style={{ fontWeight: '600', color: '#1E293B' }}>{user.name.split(' ')[0]}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#10B981' }}>{formatTalkTime(user.talkTime)}</span>
                </div>
              ))
            ) : (
              <div style={{ color: '#94A3B8', textAlign: 'center', padding: '10px' }}>No talk time yet today</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdvTeamHome;
