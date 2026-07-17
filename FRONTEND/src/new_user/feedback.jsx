import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../API";
import { useNavigate } from "react-router-dom";

function Feedback() {
    const navigate = useNavigate();
    const [feedbackText, setFeedbackText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId");
            const userEmail = localStorage.getItem("userEmail");
            
            if (!userId || !userEmail) {
                toast.error("User not found. Please log in again.");
                return;
            }

            const res = await axios.post(`${API}/feedback/post`, {
                userId,
                userEmail,
                feedback: feedbackText
            });
            toast.success("Feedback submitted successfully");
            setFeedbackText("");
            navigate(-1);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div className="nd-guide-overlay">
            <div className="nd-confirm-modal">
                <h3 className="nd-confirm-title">Feedback</h3>
                <form onSubmit={handleSubmit}>
                    <label className="nd-day-label-main">Feedback</label>
                    <textarea
                        className="nd-day-textarea"
                        placeholder="Enter your feedback..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <div className="nd-confirm-actions">
                        <button type="button" className="nd-confirm-cancel" onClick={() => {
                            setFeedbackText("");
                            navigate(-1);
                        }}>Cancel</button>
                        <button type="submit" className="nd-confirm-lock">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Feedback;