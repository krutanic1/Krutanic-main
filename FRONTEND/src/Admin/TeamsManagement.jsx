import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API';
import toast, { Toaster } from 'react-hot-toast';

const TeamsManagement = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get(`${API}/api/admin/teams`);
            setTeams(res.data);
        } catch (error) {
            toast.error("Failed to load team structures");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{ marginLeft: '265px', overflowX: 'hidden' }}>
            <Toaster />
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Team Hierarchies</h1>
                <p className="text-gray-500 mt-1">Visualize organizational structure and reporting lines</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {teams.map((team) => (
                        <div key={team._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                                <h2 className="text-xl font-bold text-gray-800">{team.team_name}</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    {team.specialists?.length || 0} Specialists
                                </span>
                            </div>

                            <div className="space-y-6">
                                {/* Manager */}
                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                                        <i className="fa fa-user-secret"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Manager</p>
                                        <p className="font-bold text-gray-800">{team.manager_id?.name || 'Unassigned'}</p>
                                    </div>
                                </div>

                                <div className="ml-6 border-l-2 border-gray-100 pl-6 space-y-4">
                                    {/* Leaders */}
                                    {team.leaders?.map(leader => (
                                        <div key={leader._id} className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xs">
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase">Team Leader</p>
                                                    <p className="text-sm font-bold text-gray-700">{leader.name}</p>
                                                </div>
                                            </div>

                                            {/* Specialists under this leader - Mock logic or real association if added to schema */}
                                            <div className="ml-4 border-l-2 border-dashed border-gray-100 pl-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {team.specialists?.map(spec => (
                                                    <div key={spec._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                                        <i className="fa fa-user text-gray-400"></i>
                                                        <span>{spec.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {(!team.leaders || team.leaders.length === 0) && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {team.specialists?.map(spec => (
                                                <div key={spec._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                                    <i className="fa fa-user text-gray-400"></i>
                                                    <span>{spec.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && (
                        <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <i className="fa fa-sitemap text-5xl mb-4"></i>
                            <p className="text-lg">No teams defined in the system.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamsManagement;
