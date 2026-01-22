import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import API from "../API";

const CreateInterview = () => {
    const [interviewers, setInterviewers] = useState([]);
    const [formData, setFormData] = useState({
        interviewName: "",
        interviewerId: "",
        date: "",
        startTime: "",
        endTime: "",
        mode: "Online"
    });

    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        fetchInterviewers();
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await axios.get(`${API}/api/interview/all`);
            setInterviews(res.data);
        } catch (error) {
            console.error("Failed to fetch interviews", error);
        }
    };

    const fetchInterviewers = async () => {
        try {
            const res = await axios.get(`${API}/api/interviewer/all`);
            setInterviewers(res.data);
        } catch (error) {
            console.error("Failed to fetch interviewers", error);
            toast.error("Could not load interviewers");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/api/interview/create-interview`, formData);
            if (res.status === 201) {
                toast.success("Interview Schedule Created!");
                setFormData({
                    interviewName: "",
                    interviewerId: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    mode: "Online"
                });
                fetchInterviews(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Creation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interview schedule?")) return;
        try {
            await axios.delete(`${API}/api/interview/delete-interview/${id}`);
            toast.success("Interview deleted successfully");
            fetchInterviews();
        } catch (error) {
            toast.error("Failed to delete interview");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-6 md:p-10 md:ml-64">
            <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Create Mock Interview Schedule</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Interview Name</label>
                            <input
                                type="text"
                                name="interviewName"
                                placeholder="e.g., Mock Interview A"
                                value={formData.interviewName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Assign Interviewer</label>
                            <select
                                name="interviewerId"
                                value={formData.interviewerId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Interviewer</option>
                                {interviewers.map((int) => (
                                    <option key={int._id} value={int._id}>{int.fullname}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Start Time (Hourly)</label>
                            <select
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Start Time</option>
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const hour = i.toString().padStart(2, '0') + ":00";
                                    return <option key={hour} value={hour}>{hour}</option>;
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">End Time (Hourly)</label>
                            <select
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select End Time</option>
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const hour = i.toString().padStart(2, '0') + ":00";
                                    return <option key={hour} value={hour}>{hour}</option>;
                                })}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Mode</label>
                        <select
                            name="mode"
                            value={formData.mode}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Create Interview Schedule
                    </button>
                </form>

                {/* Schedule List Table */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6 border-t pt-6">
                        <h3 className="text-2xl font-bold text-gray-800">Scheduled Interviews</h3>
                        <button onClick={fetchInterviews} className="text-sm font-medium text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                            <i className="fa fa-refresh"></i> Refresh List
                        </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full bg-white text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Interviewer</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Mode</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {interviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500 italic">No interviews scheduled yet.</td>
                                    </tr>
                                ) : (
                                    interviews.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.interviewName}</td>
                                            <td className="px-6 py-4">{item.interviewer?.fullname || "Unknown"}</td>
                                            <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">{item.startTime} - {item.endTime}</td>
                                            <td className="px-6 py-4">{item.mode}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete Interview"
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInterview;
