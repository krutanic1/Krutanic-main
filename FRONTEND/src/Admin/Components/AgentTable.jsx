import React from 'react';

const AgentTable = ({ agents, onDeactivate, onViewActivity }) => {
    const getStatusStyle = (status) => {
        return status === 'Active'
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200';
    };

    const getRoleLabel = (role) => {
        const roles = {
            admin: 'Administrator',
            manager: 'Manager',
            leader: 'Team Leader',
            sr_inside_sales_specialist: 'Sr. Specialist'
        };
        return roles[role] || role;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Agent Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Calls</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Connected</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Conversions</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {agents.map((agent) => (
                        <tr key={agent._id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{agent.name}</span>
                                    <span className="text-xs text-gray-500">{agent.email}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {getRoleLabel(agent.role)}
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-gray-700">
                                {agent.stats?.totalCalls || 0}
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-blue-600">
                                {agent.stats?.connected || 0}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-green-600">
                                {agent.stats?.converted || 0}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(agent.status)}`}>
                                    {agent.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onViewActivity(agent._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="View Activity"
                                    >
                                        <i className="fa fa-history"></i>
                                    </button>
                                    <button
                                        onClick={() => onDeactivate(agent._id)}
                                        className={`p-2 rounded-lg transition-colors ${agent.status === 'Active' ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                                        title={agent.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    >
                                        <i className={`fa ${agent.status === 'Active' ? 'fa-user-times' : 'fa-user-plus'}`}></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentTable;
