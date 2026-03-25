import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5005/api';

function App() {
  const [senders, setSenders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warmupStatus, setWarmupStatus] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSender, setNewSender] = useState({ user: '', pass: '', label: '' });

  useEffect(() => {
    fetchSenders();
  }, []);

  const handleAddSender = async (e) => {
    e.preventDefault();
    try {
      // Note: In a real app, you'd have a POST /api/senders endpoint
      // For this emergency tool, we'll assume the backend handles it or we'll add it now.
      const res = await fetch(`${API_BASE}/senders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSender)
      });
      const data = await res.json();
      if (data.ok) {
        alert('Sender added!');
        setNewSender({ user: '', pass: '', label: '' });
        setShowAddForm(false);
        fetchSenders();
      }
    } catch (err) {
      alert('Error adding sender.');
    }
  };

  const fetchSenders = async () => {
    try {
      const res = await fetch(`${API_BASE}/senders`);
      const data = await res.json();
      if (data.ok) setSenders(data.senders);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === senders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(senders.map(s => s._id));
    }
  };

  const handleWarmup = async () => {
    if (selectedIds.length === 0) return;
    
    setWarmupStatus('Starting...');
    try {
      const res = await fetch(`${API_BASE}/warmup/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderIds: selectedIds })
      });
      const data = await res.json();
      if (data.ok) {
        setWarmupStatus('In Progress');
        alert(`Started warmup for ${selectedIds.length} senders. Check backend logs for progress.`);
      }
    } catch (err) {
      setWarmupStatus('Error');
      alert('Failed to start warmup.');
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade">
        <div className="logo">Krutanic Warmup</div>
        <div className="status-badge">API: Online</div>
      </header>

      <main className="animate-fade">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem' }}>SMTP Senders Management</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn" 
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : '+ Add Sender'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleWarmup}
                disabled={selectedIds.length === 0 || warmupStatus === 'In Progress'}
              >
                {warmupStatus === 'In Progress' ? 'Warmup Running...' : 'Warm up Import'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddSender} className="animate-fade" style={{ marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    style={{ width: '100%', padding: '8px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                    value={newSender.user}
                    onChange={e => setNewSender({...newSender, user: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Password (App Pass)</label>
                  <input 
                    type="password" 
                    required 
                    style={{ width: '100%', padding: '8px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                    value={newSender.pass}
                    onChange={e => setNewSender({...newSender, pass: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Label (Internal)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sales Team"
                    style={{ width: '100%', padding: '8px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                    value={newSender.label}
                    onChange={e => setNewSender({...newSender, label: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Sender</button>
              </div>
            </form>
          )}

          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading senders from database...</p>
          ) : (
            <>
              <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {selectedIds.length} of {senders.length} selected
              </div>
              <table>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        onChange={selectAll} 
                        checked={senders.length > 0 && selectedIds.length === senders.length} 
                      />
                    </th>
                    <th>Email Address</th>
                    <th>Label</th>
                    <th>Blast Count</th>
                    <th>Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {senders.map(sender => (
                    <tr key={sender._id}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(sender._id)} 
                          onChange={() => toggleSelect(sender._id)} 
                        />
                      </td>
                      <td style={{ fontWeight: '500' }}>{sender.user}</td>
                      <td>{sender.label || '-'}</td>
                      <td>
                        <span className="status-badge working">{sender.blastedCount || 0}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(sender.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
          <h3>Emergency Deliverability Info</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>
            When you click "Warm up Import", the system will cycle through the selected senders and perform the following:
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Send an automated check to seed accounts.</li>
              <li>Rescue mail from Spam folder if found.</li>
              <li>Mark as important to signal positive engagement.</li>
            </ul>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
