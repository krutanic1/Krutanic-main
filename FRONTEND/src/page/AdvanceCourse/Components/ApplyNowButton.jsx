import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AdvancedApplyPopup from "../../../Components/AdvancedApplyPopup";

/**
 * ApplyNowButton
 * Triggers the premium AdvancedApplyPopup modal without navigating away.
 */
const ApplyNowButton = ({ courseValue }) => {
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
        className="bg-[#f15b29] border text-white font-semibold px-6 py-2 hover:rounded-xl ease-linear duration-600 hover:text-black rounded-sm transition-all"
      >
        Enroll Now
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
