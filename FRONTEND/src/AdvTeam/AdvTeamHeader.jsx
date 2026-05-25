import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO3.png";
import axios from "axios";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
import UserActivityTracker from "../Components/UserActivityTracker";

const AdvTeamHeader = () => {
  const [isMobileVisible, setisMobileVisible] = useState(true);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const advTeamName = localStorage.getItem("advTeamName");
  const advTeamId = localStorage.getItem("advTeamId");
  const [advTeamData, setAdvTeamData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(true);
  const [activeReminder, setActiveReminder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyStats, setDailyStats] = useState({ 
    callCount: 0, 
    talkTime: 0, 
    targets: { callTarget: 0, talkTimeTarget: 0 },
    leaderboard: { leadingCaller: null, leadingSpeaker: null }
  });
  const dropdownRef = useRef(null);

  const toggleVisibility = () => {
    setisMobileVisible((prevState) => !prevState);
  };

  const handleLogout = () => {
    toast.success("Logged Out", {
      style: {
        border: "1px solid #f15b29",
        padding: "16px",
        color: "#ffffff",
        background: "#1d1e20",
      },
      iconTheme: {
        primary: "#f15b29",
        secondary: "#ffffff",
      },
    });
    setTimeout(() => {
      localStorage.removeItem("advTeamId");
      localStorage.removeItem("advTeamName");
      localStorage.removeItem("advTeamToken");
      localStorage.removeItem("advTeamSessionStartTime");

      navigate("/AdvTeamLogin");
    }, 1500);
  };

  const checkSession = () => {
    const sessionStartTime = localStorage.getItem("advTeamSessionStartTime");
    if (sessionStartTime) {
      const currentTime = new Date().getTime();
      const expirationTime = 10 * 60 * 60 * 1000; // 10 hours
      if (currentTime - sessionStartTime > expirationTime) {
        toast.error("Session Time Out");
        localStorage.removeItem("advTeamId");
        localStorage.removeItem("advTeamName");
        localStorage.removeItem("advTeamToken");
        localStorage.removeItem("advTeamSessionStartTime");

        navigate("/AdvTeamLogin");
      }
    } else {
      navigate("/AdvTeamLogin");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchAdvTeamData = async () => {
    if (!advTeamId) {
      console.log("Advance Team user not logged in");
      return;
    }
    try {
      const response = await axios.get(`${API}/getadvteam`, { params: { advTeamId } });
      setAdvTeamData(response.data);
    } catch (err) {
      console.log("Failed to fetch advance team data");
    }
  };

  const fetchNotifications = async () => {
    if (!advTeamId) return;
    try {
      const res = await axios.get(`${API}/api/adv-leads/get-my-notifications`, { params: { userId: advTeamId } });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.length);
        
        // Find the most recent demo reminder
        const demoReminder = res.data.notifications.find(n => n.type === "demo_reminder");
        if (demoReminder) {
          setActiveReminder(demoReminder);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.post(`${API}/api/adv-leads/mark-notification-read`, { notificationId: id });
      setNotifications(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (activeReminder?._id === id) setActiveReminder(null);
    } catch (err) {
      console.error("Failed to mark notification read");
    }
  };

  const fetchDailyStats = async () => {
    if (!advTeamId) return;
    try {
      const res = await axios.get(`${API}/api/adv-reports/daily-targets/${advTeamId}`, {
        params: { date: selectedDate }
      });
      setDailyStats(res.data);
    } catch (err) {
      console.error("Failed to fetch daily stats");
    }
  };

  const formatTalkTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAdvTeamData();
    fetchNotifications();
    fetchDailyStats();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchDailyStats();
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [advTeamId, selectedDate]);

  return (
    <div id="TeamHeader">
      <UserActivityTracker userId={advTeamId} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Futuristic Ultra-Premium Stats Section */}
        {dailyStats.targets.callTarget > 0 && (
          <>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .glass-card-futuristic {
                background: rgba(15, 23, 42, 0.9) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
              }
              .glow-orange { filter: drop-shadow(0 0 8px rgba(241, 91, 41, 0.4)); }
              .glow-green { filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4)); }
              .stat-value-neon {
                background: linear-gradient(90deg, #fff, #94a3b8, #fff);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmer 4s linear infinite;
              }
            `}</style>

            <div className="daily-stats-glass glass-card-futuristic" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '6px 24px',
              borderRadius: '24px',
              margin: '0 20px',
              position: 'relative',
              overflow: 'visible',
              backdropFilter: 'blur(20px)',
            }}>
              {/* Top Highlight line */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(241, 91, 41, 0.3), transparent)'
              }}></div>

              <div className="date-picker-wrapper" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                paddingRight: '20px', borderRight: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'rgba(241, 91, 41, 0.1)',
                  border: '1px solid rgba(241, 91, 41, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className="fa fa-calendar-o" style={{ color: '#F15B29', fontSize: '14px' }}></i>
                </div>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    border: 'none', background: 'transparent', fontSize: '13px',
                    fontWeight: '700', color: '#CBD5E1', outline: 'none', cursor: 'pointer',
                    letterSpacing: '0.5px'
                  }}
                />
              </div>

              {/* Circular Call Stats */}
              <div className="stat-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '42px', height: '42px' }}>
                    <circle cx="21" cy="21" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="21" cy="21" r="18" fill="none" stroke="#F15B29" strokeWidth="3" 
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(dailyStats.callCount / dailyStats.targets.callTarget, 1))}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                      className="glow-orange"
                    />
                  </svg>
                  <i className="fa fa-phone" style={{ color: '#F15B29', fontSize: '13px', zIndex: 1 }}></i>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Call Vol</div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }} className="stat-value-neon">
                      {dailyStats.callCount}<span style={{ color: '#475569', fontSize: '10px', marginLeft: '3px' }}>/ {dailyStats.targets.callTarget}</span>
                    </div>
                  </div>
                  {dailyStats.leaderboard?.leadingCaller && (
                    <div style={{ 
                      padding: '4px 10px', borderRadius: '12px', background: 'rgba(241, 91, 41, 0.1)',
                      border: '1px solid rgba(241, 91, 41, 0.2)', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <i className="fa fa-trophy" style={{ color: '#F15B29', fontSize: '11px' }}></i>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#F15B29', textTransform: 'capitalize' }}>
                        {dailyStats.leaderboard.leadingCaller.name.split(' ')[0]} <span style={{ opacity: 0.7 }}>({dailyStats.leaderboard.leadingCaller.count})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }}></div>

              {/* Circular Talk Time Stats */}
              <div className="stat-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ position: 'absolute', transform: 'rotate(-90deg)', width: '42px', height: '42px' }}>
                    <circle cx="21" cy="21" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="21" cy="21" r="18" fill="none" stroke="#10B981" strokeWidth="3" 
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(dailyStats.talkTime / dailyStats.targets.talkTimeTarget, 1))}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.2s ease-in-out' }}
                      className="glow-green"
                    />
                  </svg>
                  <i className="fa fa-microphone" style={{ color: '#10B981', fontSize: '13px', zIndex: 1 }}></i>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '9px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Active Talk</div>
                    <div style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }} className="stat-value-neon">
                      {formatTalkTime(dailyStats.talkTime)}<span style={{ color: '#475569', fontSize: '10px', marginLeft: '3px' }}>/ {dailyStats.targets.talkTimeTarget / 3600}h</span>
                    </div>
                  </div>
                  {dailyStats.leaderboard?.leadingSpeaker && (
                    <div style={{ 
                      padding: '4px 10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <i className="fa fa-bolt" style={{ color: '#10B981', fontSize: '11px' }}></i>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', textTransform: 'capitalize' }}>
                        {dailyStats.leaderboard.leadingSpeaker.name.split(' ')[0]} <span style={{ opacity: 0.7 }}>({formatTalkTime(dailyStats.leaderboard.leadingSpeaker.talkTime)})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '20px' }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
                padding: '8px', borderRadius: '50%', backgroundColor: '#f3f4f6', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              <i className="fa fa-bell" style={{ fontSize: '20px', color: '#374151' }}></i>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  backgroundColor: '#f15b29', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '11px', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div style={{
                position: 'absolute', top: '45px', right: '0', width: '320px',
                backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                zIndex: 1000, border: '1px solid #e5e7eb', overflow: 'hidden',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Notifications</h4>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{unreadCount} Unread</span>
                  <button 
                    onClick={() => setShowNotificationDropdown(false)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280',
                      padding: '4px 8px', borderRadius: '50%', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    &times;
                  </button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n._id}
                        onClick={() => markNotificationRead(n._id)}
                        style={{ 
                          padding: '14px 16px', borderBottom: '1px solid #f9fafb', cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            backgroundColor: n.type === 'lead_assigned' ? '#ecfdf5' : '#fff7ed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            <i className={`fa ${n.type === 'lead_assigned' ? 'fa-user-plus' : 'fa-info-circle'}`} 
                               style={{ color: n.type === 'lead_assigned' ? '#059669' : '#f15b29', fontSize: '16px' }}></i>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#111827' }}>{n.title}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>{n.message}</p>
                            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                      <i className="fa fa-bell-slash" style={{ fontSize: '24px', color: '#d1d5db', marginBottom: '12px' }}></i>
                      <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div ref={mobileMenuRef}>
            {/* <span onClick={toggleVisibility}>☰</span> */}
          </div>
        </div>

        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      {isMobileVisible && (
        <div className="sidebar" style={{ width: "280px" }}>
          <div className="detail">
            {advTeamData ? (
              <>
                <h2>{advTeamData.fullname}</h2>
                <h3>{advTeamData.email}</h3>
                <h2>{advTeamData.designation}</h2>
                <h3>{advTeamData.team}</h3>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Link to="/advteam/home">
            <i className="fa fa-dashboard"></i> Home
          </Link>
          <Link to="/advteam/leaderboard">
            <i className="fa fa-trophy"></i> LeaderBoard
          </Link>
          {["LEADER", "MANAGER"].includes(advTeamData?.designation) && (
            <>
              <Link to="/advteam/assigntarget">
                <i className="fa fa-bullseye"></i> Assign Target
              </Link>
            </>
          )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER" ||
            advTeamData?.designation === "SR Inside Sales Specialist" ||
            advTeamData?.designation === "Inside Sales Specialist" ||
            advTeamData?.designation === "inside_sales_specialist") && (
              <Link to="/advteam/my-leads">
                <i className="fa fa-list-alt"></i> My Leads
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER" ||
            advTeamData?.designation === "SR Inside Sales Specialist" ||
            advTeamData?.designation === "Inside Sales Specialist" ||
            advTeamData?.designation === "inside_sales_specialist") && (
              <Link to="/advteam/leads-book">
                <i className="fa fa-book"></i> Leads Book
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER") && (
              <Link to="/advteam/lead-management">
                <i className="fa fa-tasks"></i> Lead Management
              </Link>
            )}
          {(advTeamData?.designation === "ADV Manager" ||
            advTeamData?.designation === "MANAGER" ||
            advTeamData?.designation === "ADV Leader" ||
            advTeamData?.designation === "LEADER") && (
              <Link to="/advteam/record">
                <i className="fa fa-history"></i> Call Record
              </Link>
            )}
          {/* <Link to="/advteam/onboarding">
            <i className="fa fa-edit"></i> OnBoarding Form
          </Link> */}
          <Link to="/advteam/booked">
            <i className="fa fa-calendar-o"></i> Booked Payment
          </Link>
          <Link to="/advteam/fullpaid">
            <i className="fa fa-calendar-check-o"></i> Full Payment
          </Link>
          <Link to="/advteam/default">
            <i className="fa fa-calendar-times-o"></i> Default Payment
          </Link>
          <Link to="/advteam/adduser">
            <i className="fa fa-book"></i> Add Name/Email
          </Link>
          {/* <Link to="/advteam/reference">
            <i className="fa fa-bell"></i> Your Reference
          </Link> */}
          {["LEADER", "MANAGER", "ADV Leader", "ADV Manager"].includes(advTeamData?.designation) && (
            <>
              <Link to="/advteam/teamdetail">
                <i className="fa fa-users"></i> Team
              </Link>
              <Link to="/advteam/team-login">
                <i className="fa fa-sign-in"></i> Team Login
              </Link>
            </>
          )}
          {advTeamData?.designation === "MANAGER" &&
            advTeamData?.Access === true && (
              <Link to="/advteam/addteam">
                <i className="fa fa-user"></i> Add Team
              </Link>
            )}
          <Link to="/advteam/revenue">
            <i className="fa fa-money"></i> Revenue
          </Link>
          <button onClick={handleLogout}>
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      )}

      {/* Demo Reminder Popup */}
      {activeReminder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
            textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '4px solid #F15B29',
            animation: 'pulser 2s infinite'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>{activeReminder.title}</h2>
            <p style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>{activeReminder.message}</p>
            <button
              onClick={() => markNotificationRead(activeReminder._id)}
              style={{
                width: '100%', padding: '14px', background: '#F15B29', color: '#fff',
                border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Acknowledged
            </button>
          </div>
          <style>{`
            @keyframes pulser {
              0% { transform: scale(1); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AdvTeamHeader;
