import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [cycleStatus, setCycleStatus] = useState(null);

  useEffect(() => {
    fetchAccounts();
    fetchCycleStatus();
    const interval = setInterval(() => {
      if (showLogs) fetchLogs();
      fetchCycleStatus();
      fetchAccounts();
    }, 5000);
    return () => clearInterval(interval);
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

  const fetchCycleStatus = async () => {
    try {
      const res = await axios.get('/api/warmup/status');
      setCycleStatus(res.data);
    } catch (err) {
      console.error('Error fetching status:', err);
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
      fetchCycleStatus();
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setStarting(false);
    }
  };

  const stopWarmup = async () => {
    if (!window.confirm('Are you sure you want to stop the current warmup cycle?')) return;
    setStopping(true);
    try {
      const res = await axios.post('/api/warmup/stop');
      setMessage(`Stopped: ${res.data.deletedCount} pending jobs cancelled.`);
      fetchAccounts();
      fetchCycleStatus();
    } catch (err) {
      setMessage(`Error stopping: ${err.message}`);
    } finally {
      setStopping(false);
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

  const formatTimeRemaining = () => {
    if (!cycleStatus?.startedAt) return null;
    const start = new Date(cycleStatus.startedAt).getTime();
    const now = new Date(cycleStatus.serverTime).getTime();
    const diff = now - start;
    const total = 24 * 60 * 60 * 1000;
    const remaining = total - diff;

    if (remaining <= 0) return 'Cycle Complete (Pending Next)';
    
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${h}h ${m}m ${s}s remaining`;
  };

  const getProgress = () => {
    if (!cycleStatus || cycleStatus.totalJobsToday === 0) return 0;
    return Math.round((cycleStatus.finishedJobs / cycleStatus.totalJobsToday) * 100);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>SmartWarmup Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {cycleStatus?.startedAt && (
            <div className="timer-display">
              <span className="timer-label">24h Cycle Progress:</span>
              <span className="timer-value">{formatTimeRemaining()} ({getProgress()}%)</span>
            </div>
          )}
          <button className="btn" style={{ background: '#2c3e50' }} onClick={() => setShowLogs(!showLogs)}>
            {showLogs ? 'Hide Logs' : 'View Activity Terminal'}
          </button>
          {cycleStatus?.pendingJobs > 0 && (
            <button className="btn" style={{ background: '#c0392b' }} onClick={stopWarmup} disabled={stopping}>
              {stopping ? 'Stopping...' : 'Stop Cycle'}
            </button>
          )}
          <button className="btn" style={{ background: '#e67e22' }} onClick={async () => {
            const res = await axios.get('/api/cron/process-warmup');
            setMessage(`Processor: ${res.data.processed} jobs handled.`);
            fetchAccounts();
            if (showLogs) fetchLogs();
          }}>
            Manual Process
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
            disabled={starting || accounts.length < 2 || cycleStatus?.pendingJobs > 0}
            style={{ background: cycleStatus?.pendingJobs > 0 ? '#555' : '#27ae60' }}
          >
            {starting ? 'Starting...' : cycleStatus?.pendingJobs > 0 ? 'Cycle Running' : 'Start 24h Cycle'}
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
                {log.error && <span className="log-error"> {log.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '6px', 
          background: message.startsWith('Error') || message.startsWith('Stopped') ? '#c0392b' : '#27ae60',
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
          <h3>Active Warmup</h3>
          <p>{accounts.filter(a => a.warmup?.enabled).length}</p>
        </div>
        <div className="stat-card" style={{ borderBottom: '4px solid #27ae60' }}>
          <h3>Emails Sent (Today)</h3>
          <p>{accounts.reduce((sum, a) => sum + (a.warmup?.sentToday || 0), 0)}</p>
        </div>
        <div className="stat-card" style={{ borderBottom: '4px solid #c0392b' }}>
          <h3>Limit Reached</h3>
          <p>{accounts.filter(a => (a.warmup?.sentToday || 0) >= (a.warmup?.dailyLimit || 50)).length}</p>
        </div>
      </div>

      <div className="table-container">
        <h2>Warmup Accounts Status</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Account (User)</th>
                <th>Status</th>
                <th>Daily Limit</th>
                <th>Used Today</th>
                <th>Progress</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => {
                const used = acc.warmup?.sentToday || 0;
                const limit = acc.warmup?.dailyLimit || 50;
                const percentage = Math.min(100, Math.round((used / limit) * 100));
                
                return (
                  <tr key={acc._id} style={{ opacity: acc.warmup?.enabled === false ? 0.6 : 1 }}>
                    <td>{acc.user}</td>
                    <td>
                      <button 
                        onClick={() => toggleWarmup(acc._id)}
                        className={`status-badge ${acc.warmup?.enabled !== false ? 'status-active' : 'status-inactive'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        {acc.warmup?.enabled !== false ? 'Warmup ON' : 'Paused'}
                      </button>
                    </td>
                    <td>{limit}</td>
                    <td style={{ color: used >= limit ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                      {used}
                    </td>
                    <td>
                      <div style={{ width: '100px', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', background: used >= limit ? '#e74c3c' : '#27ae60' }}></div>
                      </div>
                    </td>
                    <td>{new Date(acc.warmup?.warmupStartDate || acc.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
