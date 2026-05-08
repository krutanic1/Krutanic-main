import React, { useState } from "react";
import ApplyNowButton from "./ApplyNowButton";
import AdvancedApplyPopup from "../../../Components/AdvancedApplyPopup";

/**
 * CourseInfoStrip
 * A premium information and CTA strip that sits below the Hero banner.
 */
const CourseInfoStrip = ({ 
  accent = "#00d2ff", 
  courseValue = "",
  learningFormat = "Online Program",
  duration = "8 Months",
  emi = "4000/month*",
  brochureLink = "#"
}) => {
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
      <style>{`
        .cis-wrap {
          width: 100%;
          max-width: 1320px;
          margin: 16px auto 48px;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .cis-cta-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          align-items: center;
        }

        /* Overriding ApplyNowButton for premium feel */
        .cis-cta-row button {
          border-radius: 6px !important;
          padding: 12px 36px !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #f15b29 0%, #ff8c42 100%) !important;
          border: none !important;
          color: #fff !important;
          box-shadow: 0 4px 15px rgba(241, 91, 41, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .cis-cta-row button.cis-btn-outline {
          padding: 12px 32px !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          background: #fff !important;
          border: 1px solid #d1d5db !important;
          color: #1f2937 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
          white-space: nowrap !important;
        }

        .cis-cta-row button.cis-btn-outline:hover {
          border-color: #9ca3af !important;
          background: #f9fafb !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.08) !important;
          filter: brightness(1) !important;
        }

        .cis-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-bottom: 3.5px solid ${accent};
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 28px 10px;
          text-align: center;
        }

        .cis-item {
          border-right: 1px solid #eee;
          padding: 0 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cis-item:last-child {
          border-right: none;
        }

        .cis-label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .cis-value {
          display: block;
          font-size: 16px;
          font-weight: 800;
          color: #111827;
          line-height: 1.3;
        }

        @media (max-width: 1024px) {
          .cis-card {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .cis-item:nth-child(3) { border-right: none; }
        }

        @media (max-width: 768px) {
          .cis-wrap { margin-top: 20px; }
          .cis-cta-row { flex-direction: column; }
          .cis-card {
            grid-template-columns: 1fr 1fr;
          }
          .cis-item { border-right: none !important; border-bottom: 1px solid #f0f0f0; padding-bottom: 16px; }
          .cis-item:last-child { border-bottom: none; }
        }
      `}</style>

      <div className="cis-wrap">
        <div className="cis-cta-row">
          <ApplyNowButton courseValue={courseValue} />
          <button 
            type="button"
            onClick={() => setShowPopup(true)}
            className="cis-btn-outline"
          >
            Download Brochure
          </button>
        </div>

        <div className="cis-card">
          <div className="cis-item">
            <span className="cis-label">Learning Format</span>
            <span className="cis-value">{learningFormat}</span>
          </div>
          <div className="cis-item">
            <span className="cis-label">Live Classes</span>
            <span className="cis-value">{duration}</span>
          </div>
          <div className="cis-item">
            <span className="cis-label">100%</span>
            <span className="cis-value">Job Opportunities<br/>Guaranteed*</span>
          </div>
          <div className="cis-item">
            <span className="cis-label">Program</span>
            <span className="cis-value">Multiple<br/>Certifications</span>
          </div>
          <div className="cis-item">
            <span className="cis-label">Assured</span>
            <span className="cis-value">15 Interview oppurtunities Guaranteed</span>
          </div>
        </div>
      </div>

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

export default CourseInfoStrip;
