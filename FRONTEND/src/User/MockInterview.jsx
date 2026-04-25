import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import API from "../API";
import AIMockInterview from "./AIMockInterview"; // Import the AI component

const MockInterview = () => {
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' or 'ai'
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName"); // Ensure this is stored in localStorage on login

  useEffect(() => {
    if (activeTab === "schedule") {
      fetchInterviews();
    }
  }, [activeTab]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/interview/available-interviews`);
      setInterviews(res.data);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
      toast.error("Could not load available interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (interviewId, slotTime) => {
    if (!userId) {
      toast.error("Please login to book");
      return;
    }

    // Optimistic check (though backend handles race condition)
    if (!window.confirm(`Book slot at ${slotTime}?`)) return;

    try {
      const res = await axios.post(`${API}/api/interview/book-slot`, {
        interviewId,
        slotTime,
        studentId: userId,
        studentName: userName || "Student" // Fallback name
      });

      if (res.status === 200) {
        toast.success("Slot booked successfully!");
        fetchInterviews(); // Refresh to show locked slot
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      fetchInterviews(); // Refresh to sync state
    }
  };

  const handleCancelSlot = async (interviewId, slotTime) => {
    if (!window.confirm(`Are you sure you want to cancel your booking at ${slotTime}?`)) return;

    try {
      const res = await axios.post(`${API}/api/interview/cancel-slot`, {
        interviewId,
        slotTime,
        studentId: userId
      });

      if (res.status === 200) {
        toast.success("Booking cancelled successfully! You can now reschedule.");
        fetchInterviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Toaster position="top-center" />

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === "schedule"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
        >
          Schedule Live Interview
        </button>
        {/* <button
          onClick={() => setActiveTab("ai")}
          className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === "ai"
            ? "bg-purple-600 text-white shadow-lg"
            : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
        >
          Practice with AI
        </button> */}
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl">
        {activeTab === "ai" ? (
          <AIMockInterview />
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Available Mock Interviews</h2>

            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : interviews.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                No upcoming interviews available. Please check back later.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {(() => {
                  // Check if user has any booked slot across all interviews
                  const bookedInterview = interviews.find(interview =>
                    interview.slots.some(s => s.studentId === userId)
                  );

                  // If booked, show ONLY that interview. Else show all.
                  const displayedInterviews = bookedInterview ? [bookedInterview] : interviews;

                  return displayedInterviews.map((interview) => (
                    <div key={interview._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{interview.interviewName}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><i className="fa fa-user"></i> {interview.interviewer?.fullname}</span>
                            <span className="flex items-center gap-1"><i className="fa fa-calendar"></i> {new Date(interview.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><i className="fa fa-clock-o"></i> {interview.startTime} - {interview.endTime}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${interview.mode === 'Online' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {interview.mode}
                          </span>
                          {interview.slots.find(s => s.studentId === userId && s.meetingLink) && (
                            <a
                              href={interview.slots.find(s => s.studentId === userId && s.meetingLink).meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-green-700 transition animate-pulse"
                            >
                              Join Meeting <i className="fa fa-external-link ml-1"></i>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50">
                        <h4 className="font-semibold text-gray-700 mb-3">Available Slots</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {interview.slots.map((slot, idx) => {
                            const isMyBooking = slot.studentId === userId;

                            // If user has a booking (bookedInterview is true), hide other slots or disable them?
                            // Requirement: "he should not see the other intervier slot"
                            // Logic: If bookedInterview is set, displayedInterviews only contains that interview.
                            // Within that interview, should we hide unbooked slots?
                            // Let's assume we just show the booked slot to be very strict, or at least disable others.
                            // If I am booked in this interview, I might want to reschedule (cancel then book another).
                            // So showing others is useful for rescheduling context, but maybe "not see" means
                            // "don't distract me with options". 
                            // Let's just render the booked slot if strictly "not see". 
                            // But wait, if I want to cancel, I need to see my booked slot.
                            // If I cancel, I revert to seeing everything.
                            // If I am booked, seeing other slots in the SAME interview is okay?
                            // The prompt says "once the user slected the slot he should not see the other intervier slot" (singular/plural ambiguous).
                            // "other intervier slot" -> slots of other interviewers? Or other slots of safe interviewer?
                            // Given "displayedInterviews = [bookedInterview]", we hid other interviewers.
                            // Inside this interview, maybe we should just highlight the booked one. 
                            // I'll keep the slot list but perhaps filter it?
                            // "he should not see the other intervier slot" -> likely means "other slots".

                            if (bookedInterview && !isMyBooking) return null; // Hide non-booked slots if booked

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (isMyBooking) {
                                    handleCancelSlot(interview._id, slot.time);
                                  } else if (!slot.isBooked) {
                                    handleBookSlot(interview._id, slot.time);
                                  }
                                }}
                                disabled={slot.isBooked && !isMyBooking}
                                className={`py-2 px-1 rounded text-sm font-medium transition-all text-center
                                 ${isMyBooking
                                    ? "bg-red-500 text-white hover:bg-red-600 ring-2 ring-red-300"
                                    : slot.isBooked
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md"
                                  }
                               `}
                              >
                                {slot.time}
                                {isMyBooking && <span className="block text-[10px] uppercase mt-0.5">Cancel</span>}
                                {slot.isBooked && !isMyBooking && <span className="block text-[10px] uppercase mt-0.5">Booked</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
