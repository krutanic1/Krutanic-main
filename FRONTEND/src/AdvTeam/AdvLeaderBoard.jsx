import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const AdvLeaderBoard = () => {
  const [data, setData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailyLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/api/adv-reports/adv-leaderboard`, {
        params: { date: selectedDate }
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error);
    }
  };

  const fetchMonthlyLeaderboard = async () => {
    try {
      const dateObj = new Date(selectedDate);
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      
      const response = await axios.get(`${API}/api/adv-reports/adv-leaderboard`, {
        params: { month, year }
      });
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Error fetching monthly leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchDailyLeaderboard();
    fetchMonthlyLeaderboard();
  }, [selectedDate]);

  const formatTalkTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const topCallers = [...data].sort((a, b) => b.callCount - a.callCount).slice(0, 10);
  const topSpeakers = [...data].sort((a, b) => b.talkTime - a.talkTime).slice(0, 10);
  const topRevenue = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const topMonthlyCallers = [...monthlyData].sort((a, b) => b.callCount - a.callCount).slice(0, 10);
  const topMonthlySpeakers = [...monthlyData].sort((a, b) => b.talkTime - a.talkTime).slice(0, 10);
  const topMonthlyRevenue = [...monthlyData].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const monthName = new Date(selectedDate).toLocaleString('default', { month: 'long', year: 'numeric' });

  const customStyles = `
    .ent-container {
      padding: 24px 40px;
      margin-left: 280px;
      margin-top: 20px;
      background: #f8fafc;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
    }
    .ent-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    .ent-title {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
    }
    .ent-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
    .ent-filter {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .ent-filter label {
      font-size: 13px;
      font-weight: 500;
      color: #475569;
      margin-right: 12px;
    }
    .ent-filter input {
      border: none;
      outline: none;
      font-size: 14px;
      color: #0f172a;
      background: transparent;
      font-family: inherit;
    }
    .ent-section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin: 32px 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ent-badge {
      background: #e2e8f0;
      color: #334155;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
    }
    .ent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    .ent-panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
    }
    .ent-panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fbfbfc;
      border-radius: 8px 8px 0 0;
    }
    .ent-panel-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #334155;
    }
    .ent-panel-icon {
      color: #64748b;
      font-size: 14px;
    }
    .ent-list {
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .ent-list-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.15s ease;
    }
    .ent-list-item:hover {
      background-color: #f8fafc;
    }
    .ent-list-item:last-child {
      border-bottom: none;
    }
    .ent-rank {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      background: #f1f5f9;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .ent-rank.rank-1 {
      background: #fef08a;
      color: #854d0e;
    }
    .ent-rank.rank-2 {
      background: #e2e8f0;
      color: #334155;
    }
    .ent-rank.rank-3 {
      background: #ffedd5;
      color: #9a3412;
    }
    .ent-name {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      text-transform: capitalize;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ent-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      text-align: right;
    }
    .ent-empty {
      padding: 40px 20px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
  `;

  const renderPanel = (title, iconClass, dataList, dataKey, formatter = (val) => val) => {
    const validData = dataList.filter(u => u[dataKey] > 0);

    return (
      <div className="ent-panel">
        <div className="ent-panel-header">
          <i className={`fa ${iconClass} ent-panel-icon`}></i>
          <h4>{title}</h4>
        </div>
        
        {validData.length === 0 ? (
          <div className="ent-empty">No data to display</div>
        ) : (
          <div className="ent-list">
            {validData.map((user, idx) => (
              <div key={idx} className="ent-list-item">
                <div className={`ent-rank ${idx < 3 ? `rank-${idx + 1}` : ''}`}>
                  {idx + 1}
                </div>
                <div className="ent-name">{user.name}</div>
                <div className="ent-value">{formatter(user[dataKey])}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="ent-container">
        
        <div className="ent-header">
          <div>
            <h1 className="ent-title">Team Leaderboard</h1>
            <p className="ent-subtitle">Performance metrics and rankings for Advance Team members</p>
          </div>
          <div className="ent-filter">
            <label>Date</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* --- DAILY SECTION --- */}
        <h2 className="ent-section-title">
          Daily Overview 
          <span className="ent-badge">{selectedDate}</span>
        </h2>
        
        <div className="ent-grid">
          {renderPanel("Revenue", "fa-line-chart", topRevenue, "revenue", (val) => `₹${val.toLocaleString()}`)}
          {renderPanel("Call Volume", "fa-phone", topCallers, "callCount", (val) => val)}
          {renderPanel("Talk Time", "fa-clock-o", topSpeakers, "talkTime", formatTalkTime)}
        </div>

        {/* --- MONTHLY SECTION --- */}
        <h2 className="ent-section-title">
          Monthly Overview 
          <span className="ent-badge">{monthName}</span>
        </h2>
        
        <div className="ent-grid">
          {renderPanel("Revenue", "fa-line-chart", topMonthlyRevenue, "revenue", (val) => `₹${val.toLocaleString()}`)}
          {renderPanel("Call Volume", "fa-phone", topMonthlyCallers, "callCount", (val) => val)}
          {renderPanel("Talk Time", "fa-clock-o", topMonthlySpeakers, "talkTime", formatTalkTime)}
        </div>

      </div>
    </>
  );
};

export default AdvLeaderBoard;
