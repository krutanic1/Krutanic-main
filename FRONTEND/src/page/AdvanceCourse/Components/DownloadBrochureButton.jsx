import React, { useState } from "react";
import AdvancedApplyPopup from "../../../Components/AdvancedApplyPopup";

const DownloadBrochureButton = ({ courseValue, brochureLink, className = "btn-sec", label = "Full Syllabus" }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDownloadSuccess = () => {
    const link = document.createElement("a");
    link.href = brochureLink;
    link.download = `${courseValue} Brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setShowPopup(true)} 
        className={className}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </button>

      {showPopup && (
        <AdvancedApplyPopup
          onClose={() => setShowPopup(false)}
          initialDomain={courseValue}
          onSuccess={handleDownloadSuccess}
          popupType="brochure"
        />
      )}
    </>
  );
};

export default DownloadBrochureButton;
