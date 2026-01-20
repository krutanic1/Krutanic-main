import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../API";

const InterviewerDashboard = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const interviewerName = localStorage.getItem("interviewerName");
    const interviewerId = localStorage.getItem("interviewerId");

    useEffect(() => {
        if (!localStorage.getItem("interviewerToken")) {
            navigate("/interviewer-login");
        } else {
            fetchInterviews();
        }
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await axios.get(`${API}/api/interviewer/interviewer-dashboard/${interviewerId}`);
            setInterviews(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("interviewerToken");
        localStorage.removeItem("interviewerId");
        localStorage.removeItem("interviewerName");
        navigate("/interviewer-login");
    };

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [meetingLink, setMeetingLink] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const openLinkModal = (interviewId, slot) => {
        setSelectedSlot({ interviewId, slot });
        setMeetingLink(slot.meetingLink || "");
        setModalVisible(true);
    };

    const handleSendLink = async () => {
        if (!meetingLink) {
            toast.error("Please enter a meeting link");
            return;
        }
        try {
            await axios.post(`${API}/api/interview/update-meeting-link`, {
                interviewId: selectedSlot.interviewId,
                slotTime: selectedSlot.slot.time,
                meetingLink
            });
            toast.success("Meeting link sent successfully!");
            setModalVisible(false);
            fetchInterviews(); // Refresh to update local state
        } catch (error) {
            toast.error("Failed to send link");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans relative">
            <Toaster position="top-center" />
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Interviewer Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {interviewerName}</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Assigned Interviews</h2>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : interviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No interviews assigned yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviews.map((interview) => (
                            <div key={interview._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                <div className="bg-blue-600 p-4">
                                    <h3 className="text-white font-bold text-lg">{interview.interviewName}</h3>
                                    <p className="text-blue-100 text-sm">{new Date(interview.date).toDateString()}</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-700 mb-2"><strong>Time:</strong> {interview.startTime} - {interview.endTime}</p>
                                    <p className="text-gray-700 mb-4"><strong>Mode:</strong> <span className={`px-2 py-0.5 rounded text-xs font-bold ${interview.mode === 'Online' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{interview.mode}</span></p>

                                    <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Scheduled Slots</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {interview.slots.map((slot, idx) => (
                                            <div key={idx} className={`p-2 rounded text-sm flex justify-between items-center ${slot.isBooked ? 'bg-blue-50 border border-blue-100' : 'bg-gray-100 text-gray-500'}`}>
                                                <span className="font-medium">{slot.time}</span>
                                                {slot.isBooked ? (
                                                    <div className="text-right">
                                                        <button
                                                            onClick={() => openLinkModal(interview._id, slot)}
                                                            className="font-bold text-blue-800 hover:underline cursor-pointer flex flex-col items-end"
                                                            title="Click to send meeting link"
                                                        >
                                                            <span>{slot.studentName || "Student"}</span>
                                                            <span className="text-xs text-blue-600 font-normal">
                                                                {slot.meetingLink ? "Link Sent ✓" : "Send Link"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="italic text-xs">Available</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Link Sending Modal */}
            {modalVisible && selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-xl font-bold mb-4">Send Meeting Link</h3>
                        <p className="mb-2 text-gray-700"><strong>Student:</strong> {selectedSlot.slot.studentName}</p>
                        <p className="mb-4 text-gray-700"><strong>Time:</strong> {selectedSlot.slot.time}</p>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-4"
                            placeholder="https://meet.google.com/..."
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setModalVisible(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                            <button onClick={handleSendLink} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send Link</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewerDashboard;
