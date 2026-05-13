import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import API from '../API';

const AdvCRMSetup = () => {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [activeTab, setActiveTab] = useState('managers');

    // Form state
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'manager', phone: '' });
    const [teamForm, setTeamForm] = useState({ team_name: '', manager_id: '' });
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [memberToAdd, setMemberToAdd] = useState({ userId: '', role: 'leader' });

    const fetchAll = async () => {
        try {
            const [usersRes, teamsRes] = await Promise.allSettled([
                axios.get(`${API}/api/adv-users/get-all-users`),
                axios.get(`${API}/api/adv-teams/get-all-teams`)
            ]);
            if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
            if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data || []);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ─── Create User ───────────────────────────────────────────────
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/api/adv-users/create-user`, userForm);
            toast.success(`${userForm.role} created successfully!`);
            setUserForm({ name: '', email: '', password: '', role: 'manager', phone: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    // ─── Create Team ───────────────────────────────────────────────
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!teamForm.manager_id) {
            toast.error("Please select a manager");
            return;
        }
        try {
            await axios.post(`${API}/api/adv-teams/create-team`, teamForm);
            toast.success("Team created successfully!");
            setTeamForm({ team_name: '', manager_id: '' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create team");
        }
    };

    // ─── Add member to team ───────────────────────────────────────
    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedTeamId || !memberToAdd.userId) {
            toast.error("Select a team and a member");
            return;
        }
        try {
            await axios.put(`${API}/api/adv-teams/add-member/${selectedTeamId}`, memberToAdd);
            toast.success("Member added to team!");
            setMemberToAdd({ userId: '', role: 'leader' });
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add member");
        }
    };

    const managers = users.filter(u => u.role === 'manager');

    const tabs = [
        { id: 'managers', label: '👥 Create Users' },
        { id: 'teams', label: '🏢 Create Teams' },
        { id: 'members', label: '➕ Add Members to Team' },
        { id: 'overview', label: '📋 Overview' }
    ];

    return (
        <div id="create-marketing-team">
            <Toaster position="top-center" />
            <div className="coursetable">
                <h1>CRM Setup — Managers &amp; Teams</h1>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Setup your CRM hierarchy: Create managers → Create teams → Add leaders &amp; specialists → Assign leads.
                </p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: activeTab === tab.id ? '#1890ff' : '#f0f0f0',
                                color: activeTab === tab.id ? '#fff' : '#333',
                                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab: Create Users ── */}
                {activeTab === 'managers' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3>Create New CRM User</h3>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input
                                placeholder="Full Name *"
                                required
                                value={userForm.name}
                                onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email *"
                                required
                                value={userForm.email}
                                onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                            />
                            <input
                                placeholder="Phone"
                                value={userForm.phone}
                                onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password *"
                                required
                                value={userForm.password}
                                onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                            />
                            <select
                                value={userForm.role}
                                onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                            >
                                <option value="manager">Manager</option>
                                <option value="leader">Leader</option>
                                <option value="sr_inside_sales_specialist">SR Inside Sales Specialist</option>
                                <option value="inside_sales_specialist">Inside Sales Specialist</option>
                            </select>
                            <button type="submit" style={{ padding: '10px', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Create User
                            </button>
                        </form>

                        {users.length > 0 && (
                            <div style={{ marginTop: '25px' }}>
                                <h4>Existing CRM Users ({users.length})</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td>{u.name}</td>
                                                <td>
                                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: u.role === 'manager' ? '#e6f7ff' : u.role === 'leader' ? '#f6ffed' : '#fff7e6', border: '1px solid #91d5ff', fontSize: '12px' }}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>{u.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Create Teams ── */}
                {activeTab === 'teams' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3>Create New Team</h3>
                        {managers.length === 0 ? (
                            <div style={{ padding: '15px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px' }}>
                                ⚠️ No managers found. Please create a manager first from the <strong>Create Users</strong> tab.
                            </div>
                        ) : (
                            <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    placeholder="Team Name (e.g. Team Alpha) *"
                                    required
                                    value={teamForm.team_name}
                                    onChange={e => setTeamForm({ ...teamForm, team_name: e.target.value })}
                                />
                                <select
                                    required
                                    value={teamForm.manager_id}
                                    onChange={e => setTeamForm({ ...teamForm, manager_id: e.target.value })}
                                >
                                    <option value="">Select Manager *</option>
                                    {managers.map(m => (
                                        <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                    ))}
                                </select>
                                <button type="submit" style={{ padding: '10px', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    Create Team
                                </button>
                            </form>
                        )}

                        {teams.length > 0 && (
                            <div style={{ marginTop: '25px' }}>
                                <h4>Existing Teams ({teams.length})</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Team Name</th>
                                            <th>Manager</th>
                                            <th>Leaders</th>
                                            <th>Specialists</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.map(t => (
                                            <tr key={t._id}>
                                                <td><strong>{t.team_name}</strong></td>
                                                <td>{t.manager_id?.name || '—'}</td>
                                                <td>{t.leaders?.length || 0}</td>
                                                <td>{t.specialists?.length || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Add Members ── */}
                {activeTab === 'members' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h3>Add User to a Team</h3>
                        {teams.length === 0 ? (
                            <div style={{ padding: '15px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '8px' }}>
                                ⚠️ No teams found. Please create a team first from the <strong>Create Teams</strong> tab.
                            </div>
                        ) : (
                            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <select required value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
                                    <option value="">Select Team *</option>
                                    {teams.map(t => (
                                        <option key={t._id} value={t._id}>{t.team_name}</option>
                                    ))}
                                </select>
                                <select required value={memberToAdd.userId} onChange={e => setMemberToAdd({ ...memberToAdd, userId: e.target.value })}>
                                    <option value="">Select User *</option>
                                    {users.filter(u => u.role !== 'manager').map(u => (
                                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                                <select value={memberToAdd.role} onChange={e => setMemberToAdd({ ...memberToAdd, role: e.target.value })}>
                                    <option value="leader">Add as Leader</option>
                                    <option value="specialist">Add as Specialist</option>
                                </select>
                                <button type="submit" style={{ padding: '10px', background: '#722ed1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    Add to Team
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* ── Tab: Overview ── */}
                {activeTab === 'overview' && (
                    <div>
                        <h3>CRM Hierarchy Overview</h3>
                        {teams.length === 0 ? (
                            <p style={{ color: '#888' }}>No teams created yet. Start by creating users and teams.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {teams.map(team => (
                                    <div key={team._id} style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h3 style={{ margin: 0 }}>{team.team_name}</h3>
                                        </div>
                                        <p style={{ margin: '5px 0', color: '#1890ff' }}>
                                            👤 Manager: <strong>{team.manager_id?.name || 'Unassigned'}</strong>
                                        </p>
                                        <div style={{ marginTop: '10px' }}>
                                            <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#555' }}>Leaders ({team.leaders?.length || 0}):</p>
                                            {team.leaders && team.leaders.length > 0
                                                ? team.leaders.map(l => <p key={l._id} style={{ margin: '2px 10px', color: '#52c41a' }}>↳ {l.name}</p>)
                                                : <p style={{ margin: '2px 10px', color: '#bbb' }}>None assigned</p>
                                            }
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#555' }}>Specialists ({team.specialists?.length || 0}):</p>
                                            {team.specialists && team.specialists.length > 0
                                                ? team.specialists.map(s => <p key={s._id} style={{ margin: '2px 10px', color: '#fa8c16' }}>↳ {s.name}</p>)
                                                : <p style={{ margin: '2px 10px', color: '#bbb' }}>None assigned</p>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvCRMSetup;
