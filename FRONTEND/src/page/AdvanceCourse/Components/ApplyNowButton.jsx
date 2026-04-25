import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AdvancedApplyPopup from "../../../Components/AdvancedApplyPopup";

/**
 * ApplyNowButton
 * Triggers the premium AdvancedApplyPopup modal without navigating away.
 */
const ApplyNowButton = ({ courseValue, className = "", label = "Enroll Now" }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleEnrollClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="inline-block">
      <button
        data-aos="fade-up"
        onClick={handleEnrollClick}
        className={`bg-gradient-to-b from-[#8f52ff] to-[#6f31f6] text-white font-bold px-10 py-3.5 rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20 ${className}`}
      >
        {label}
      </button>

      {showPopup && (
        <AdvancedApplyPopup 
          onClose={() => setShowPopup(false)} 
          initialDomain={courseValue}
        />
      )}
    </div>
  );
};

export default ApplyNowButton;
