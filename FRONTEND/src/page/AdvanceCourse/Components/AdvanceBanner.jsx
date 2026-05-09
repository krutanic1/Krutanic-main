import React from "react";
import bannerImg from "../../../assets/advance_offer_banner.png";

const AdvanceBanner = () => {
  return (
    <section className="advance-banner-section" style={{ padding: "40px 0", background: "#fff" }}>
      <div className="shell" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
          <img 
            src={bannerImg} 
            alt="Special Offer Banner" 
            style={{ 
              width: "100%", 
              height: "auto", 
              display: "block",
              objectFit: "cover"
            }} 
          />
        </div>
      </div>
    </section>
  );
};

export default AdvanceBanner;
