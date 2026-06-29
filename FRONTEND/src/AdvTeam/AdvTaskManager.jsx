import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, AlertCircle, Calendar, Plus, Filter, MoreVertical, X, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import AdvLeadCallModal from "./AdvLeadCallModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdvTaskManager = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [filter, setFilter] = useState({ status: "", date: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [callModalLead, setCallModalLead] = useState(null);
    
    // Auth Token
    const getAuthHeaders = () => {
        const token = localStorage.getItem("advTeamToken") || localStorage.getItem("adminToken") || localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };
    
    const advTeamId = localStorage.getItem("advTeamId");

    useEffect(() => {
        const designation = localStorage.getItem("advTeamDesignation") || "";
        setIsManager(["manager", "admin", "leader", "adv manager", "adv leader"].some(role => designation.toLowerCase().includes(role)));
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, dashRes] = await Promise.all([
                axios.get(`${API_URL}/api/adv-tasks`, {
                    headers: getAuthHeaders(),
                    params: { ...filter, counsellor_id: !isManager ? advTeamId : undefined, team_id: isManager ? localStorage.getItem("advTeamId") : undefined } // Adjust for actual needs
                }),
                axios.get(`${API_URL}/api/adv-tasks/dashboard/counsellor?counsellor_id=${advTeamId}`, {
                    headers: getAuthHeaders()
                })
            ]);
            setTasks(tasksRes.data.data);
            setDashboard(dashRes.data.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            toast.error("Failed to load task data");
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/api/adv-tasks/${id}`, { status }, { headers: getAuthHeaders() });
            toast.success("Task updated successfully");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update task");
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'High': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusColor = (status, dueDate, dueTime) => {
        if (status === 'Completed') return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (status === 'Missed') return 'text-red-400 bg-red-400/10 border-red-400/20';
        
        const now = new Date();
        const dueDateTime = new Date(dueDate);
        if (dueTime) {
            const [hrs, mins] = dueTime.split(":");
            dueDateTime.setHours(parseInt(hrs), parseInt(mins), 0, 0);
        }
        
        if (now > dueDateTime) return 'text-red-500 bg-red-500/10 border-red-500/20'; // Overdue
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    return (
        <div id="BdaPanel" className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
            <div className="max-w-7xl mx-auto p-6 space-y-8 mt-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                            Daily Task Management
                        </h1>
                        <p className="text-slate-400 mt-1">Track and manage your lead follow-ups efficiently.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)]"
                    >
                        <Plus className="w-5 h-5" /> Create Task
                    </button>
                </div>

                {/* Dashboard Metrics */}
                {dashboard && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <MetricCard title="Total Assigned" value={dashboard.tasksCreatedToday} icon={<Calendar />} color="blue" />
                        <MetricCard title="Completed" value={dashboard.tasksCompletedToday} icon={<CheckCircle2 />} color="green" />
                        <MetricCard title="Pending" value={dashboard.pendingTasks} icon={<Clock />} color="yellow" />
                        <MetricCard title="Due Today" value={dashboard.dueTodayTasks} icon={<Calendar />} color="indigo" />
                        <MetricCard title="Overdue" value={dashboard.overdueTasks} icon={<AlertCircle />} color="red" />
                        <MetricCard title="Completion Rate" value={dashboard.completionRate} icon={<CheckCircle2 />} color="purple" />
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 bg-[#1E293B] p-4 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Filter className="w-5 h-5" />
                        <span className="font-medium">Filters:</span>
                    </div>
                    <select 
                        className="bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <input 
                        type="date"
                        className="bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                        value={filter.date}
                        onChange={(e) => setFilter({...filter, date: e.target.value})}
                    />
                    {(filter.status || filter.date) && (
                        <button 
                            onClick={() => setFilter({ status: "", date: "" })}
                            className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Task List */}
                <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center p-12 text-slate-400 flex flex-col items-center">
                            <CheckCircle2 className="w-12 h-12 mb-3 text-slate-600" />
                            <p className="text-lg">No tasks found for the current filters.</p>
                            <p className="text-sm">You are all caught up!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800/50 border-b border-slate-700">
                                        <th className="p-4 font-semibold text-slate-300 text-sm">Lead Details</th>
                                        <th className="p-4 font-semibold text-slate-300 text-sm">Task Type</th>
                                        <th className="p-4 font-semibold text-slate-300 text-sm">Due Date & Time</th>
                                        <th className="p-4 font-semibold text-slate-300 text-sm">Priority</th>
                                        <th className="p-4 font-semibold text-slate-300 text-sm">Status</th>
                                        <th className="p-4 font-semibold text-slate-300 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {tasks.map((task) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                key={task._id} 
                                                className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                                onClick={() => setCallModalLead({ id: task.lead_id, name: task.lead_name })}
                                            >
                                                <td className="p-4">
                                                    <p className="font-medium text-slate-200">{task.lead_name}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{task.student_mobile}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-slate-700 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-600">
                                                        {task.task_type}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-300">
                                                    {new Date(task.due_date).toLocaleDateString()} <span className="text-slate-400 ml-1">at {task.due_time}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 w-max ${getStatusColor(task.status, task.due_date, task.due_time)}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {task.status !== 'Completed' ? (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(task._id, 'Completed')}
                                                            className="text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-medium text-slate-500 italic">Completed</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Creation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <TaskModal 
                        onClose={() => setIsModalOpen(false)} 
                        onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
                    />
                )}
            </AnimatePresence>

            <AdvLeadCallModal
                isOpen={!!callModalLead}
                onClose={() => setCallModalLead(null)}
                onSuccess={() => { setCallModalLead(null); fetchData(); }}
                leadId={callModalLead?.id}
                leadName={callModalLead?.name}
            />
        </div>
    );
};

const MetricCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
        green: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
        yellow: "from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/20",
        indigo: "from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/20",
        red: "from-red-500/20 to-red-600/10 text-red-400 border-red-500/20",
        purple: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-4 flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-300">{title}</p>
                <div className="p-1.5 bg-[#0F172A]/50 rounded-lg backdrop-blur-sm">
                    {React.cloneElement(icon, { className: "w-4 h-4" })}
                </div>
            </div>
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
    );
};

const TaskModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        lead_id: "",
        task_type: "First Call",
        priority: "Medium",
        due_date: "",
        due_time: "",
        remarks: ""
    });
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch leads for the dropdown
        const fetchLeads = async () => {
            try {
                const userId = localStorage.getItem("advTeamId");
                const token = localStorage.getItem("advTeamToken") || localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/api/adv-leads/get-adv-leads?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeads(res.data.leads || res.data || []);
            } catch (error) {
                toast.error("Failed to load leads for task creation");
            }
        };
        fetchLeads();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("advTeamToken") || localStorage.getItem("token");
            await axios.post(`${API_URL}/api/adv-tasks`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Task created successfully");
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating task");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700 p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-100">Create New Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Select Lead</label>
                        <select 
                            required
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.lead_id}
                            onChange={(e) => setFormData({...formData, lead_id: e.target.value})}
                        >
                            <option value="">-- Choose Lead --</option>
                            {leads.slice(0, 100).map(lead => (
                                <option key={lead._id} value={lead._id}>{lead.full_name || lead.owner_name} ({lead.phone_number})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Task Type</label>
                            <select 
                                required
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.task_type}
                                onChange={(e) => setFormData({...formData, task_type: e.target.value})}
                            >
                                <option>First Call</option>
                                <option>Follow-up Call</option>
                                <option>WhatsApp Follow-up</option>
                                <option>Demo Scheduled</option>
                                <option>Fee Discussion</option>
                                <option>Document Collection</option>
                                <option>Callback</option>
                                <option>Admission Follow-up</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                            <select 
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            >
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                            <input 
                                type="date" required
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                value={formData.due_date}
                                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Due Time</label>
                            <input 
                                type="time" required
                                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none [color-scheme:dark]"
                                value={formData.due_time}
                                onChange={(e) => setFormData({...formData, due_time: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Remarks (Optional)</label>
                        <textarea 
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows="2"
                            placeholder="Add notes about this task..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Create Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdvTaskManager;
