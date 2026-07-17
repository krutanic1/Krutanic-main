import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../API";
import toast from "react-hot-toast";

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get(`${API}/feedback/get`);
            // Sorting feedback by creation date, newest first if createdAt exists
            const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setFeedbacks(sorted);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            toast.error("Failed to fetch feedbacks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="p-6 h-screen overflow-y-auto bg-gray-50 ml-[270px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Feedback</h1>
                    <p className="text-gray-500 mt-1">View feedback submitted by students from the LMS.</p>
                </div>
                <button
                    onClick={fetchFeedbacks}
                    className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((fb, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 rounded-full h-10 w-10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
                                        {fb.userEmail ? fb.userEmail.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold text-gray-900 truncate" title={fb.userEmail}>
                                            {fb.userEmail || "Anonymous"}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate" title={fb.userId}>
                                            ID: {fb.userId || "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100 shadow-sm">
                                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "New"}
                                    </span>
                                    {fb.createdAt && (
                                        <div className="text-[10px] text-gray-400 mt-1 mr-1">
                                            {new Date(fb.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 mt-2">
                                <div className="bg-gray-50 p-5 rounded-lg h-full border border-gray-100 relative shadow-inner">
                                    <span className="material-symbols-outlined absolute top-2 right-2 text-gray-300 rotate-180 opacity-40" style={{ fontSize: '32px' }}>
                                        format_quote
                                    </span>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap relative z-10 leading-relaxed font-medium">
                                        {fb.feedback && fb.feedback.length > 0 ? fb.feedback[0] : "No feedback content"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-gray-400">rate_review</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Feedback Yet</h3>
                    <p className="text-gray-500">When students submit feedback through the LMS, it will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default AdminFeedback;
