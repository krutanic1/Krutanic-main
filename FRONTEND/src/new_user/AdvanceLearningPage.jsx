/**
 * AdvanceLearningPage.jsx
 *
 * A thin wrapper used only by the /advancedashboard/learning route.
 * It imports NewLearning and adds a "Back to Dashboard" header link
 * so the user can return to the new dashboard without the old UserLayout sidebar.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import AdvanceLearning from "../User/AdvanceLearning";
import logo from "../assets/LOGO3.png";

const AdvanceLearningPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
            {/* Slim top-bar with back navigation */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 24px",
                    background: "#fff",
                    borderBottom: "1px solid #f0f0f0",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <img src={logo} alt="Krutanic" style={{ height: 36 }} />
                <span style={{ color: "#d1d5db", fontSize: 18 }}>|</span>
                <button
                    onClick={() => navigate("/advancedashboard/training")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#f15b29",
                        fontWeight: 600,
                        fontSize: 14,
                        padding: "4px 0",
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                    Back to Dashboard
                </button>
            </div>

            {/* Full learning component */}
            <AdvanceLearning />
        </div>
    );
};

export default AdvanceLearningPage;
