import React from "react";
import AdvancedApplyPopup from "../Components/AdvancedApplyPopup";
import { useNavigate } from "react-router-dom";

const AdvanceApplyPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* We reuse the popup component but stripped of its absolute positioning logic or we can just render it directly */}
            <div className="w-full max-w-4xl relative">
                <AdvancedApplyPopup onClose={() => navigate("/Advance")} />
            </div>
            
            {/* Informational background text if needed */}
            <div className="fixed inset-0 -z-10 bg-[#fafafa] flex flex-col items-center justify-center opacity-50">
                <h1 className="text-[15vw] font-black text-slate-200 select-none">KRUTANIC</h1>
            </div>
        </div>
    );
};

export default AdvanceApplyPage;
