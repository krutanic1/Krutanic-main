import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchAccounts();
    if (showLogs) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000); // Auto-refresh logs
      return () => clearInterval(interval);
    }
  }, [showLogs]);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('/api/accounts');
      setAccounts(res.data.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/logs');
      setLogs(res.data.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const startWarmup = async () => {
    setStarting(true);
    setMessage('');
    try {
      const res = await axios.post('/api/warmup/start');
      setMessage(`Success: ${res.data.message}`);
      fetchAccounts();
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setStarting(false);
    }
  };

  const toggleWarmup = async (id) => {
    try {
      await axios.post(`/api/accounts/${id}/toggle-warmup`);
      fetchAccounts();
    } catch (err) {
      console.error('Error toggling warmup:', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>SmartWarmup Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: '#2c3e50' }} onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? 'Hide Logs' : 'View Activity Terminal'}
          </button>
          <button className="btn" style={{ background: '#e67e22' }} onClick={async () => {
            const res = await axios.get('/api/cron/process-warmup');
            setMessage(`Processor: ${res.data.processed} jobs handled.`);
            fetchAccounts();
            if (showLogs) fetchLogs();
          }}>
            Process Jobs
          </button>
          <button className="btn" style={{ background: '#8e44ad' }} onClick={async () => {
            const res = await axios.get('/api/cron/check-replies');
            setMessage(`IMAP: ${res.data.repliesSent} replies sent.`);
            if (showLogs) fetchLogs();
          }}>
            Check Replies
          </button>
          <button 
            className="btn" 
            onClick={startWarmup} 
            disabled={starting || accounts.length < 2}
          >
            {starting ? 'Starting...' : 'Start 24h Warmup Cycle'}
          </button>
        </div>
      </div>

      {showLogs && (
        <div className="terminal">
          <div className="terminal-header">Activity Logs (Last 50 Jobs)</div>
          <div className="terminal-content">
            {logs.length === 0 && <p>No recent activity found.</p>}
            {logs.map(log => (
              <div key={log._id} className="log-entry">
                <span className="log-time">[{new Date(log.completedAt).toLocaleTimeString()}]</span>
                <span className={`log-status ${log.status}`}> {log.status.toUpperCase()} </span>
                <span className="log-msg"> {log.sender} ➝ {log.recipient}</span>
                {log.error && <span className="log-error"> Error: {log.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '6px', 
          background: message.startsWith('Error') ? '#c0392b' : '#27ae60',
          marginBottom: '1rem' 
        }}>
          {message}
        </div>
      )}

      <div className="stats">
        <div className="stat-card">
          <h3>Total Accounts</h3>
          <p>{accounts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Warmup Enabled</h3>
          <p>{accounts.filter(a => a.warmup?.enabled).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sent (Today)</h3>
          <p>{accounts.reduce((sum, a) => sum + (a.warmup?.sentToday || 0), 0)}</p>
        </div>
      </div>

      <div className="table-container">
        <h2>Warmup Accounts</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account (User)</th>
                <th>Status</th>
                <th>Daily Limit</th>
                <th>Sent Today</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc._id}>
                  <td>{acc.user}</td>
                  <td>
                    <button 
                      onClick={() => toggleWarmup(acc._id)}
                      className={`status-badge ${acc.warmup?.enabled !== false ? 'status-active' : 'status-inactive'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {acc.warmup?.enabled !== false ? 'Warmup ON' : 'Off'}
                    </button>
                  </td>
                  <td>{acc.warmup?.dailyLimit || 50}</td>
                  <td>{acc.warmup?.sentToday || 0}</td>
                  <td>{new Date(acc.warmup?.warmupStartDate || acc.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No accounts found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
