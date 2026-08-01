import React from 'react';
import { FaBuilding, FaMoneyBillWave, FaUserCheck, FaChevronRight } from 'react-icons/fa';
import './PartnerLogos.css'; // Though we will append to MentorshipPremium.css, keeping original import if there were any old styles

// Import prominent logos
import amazon from '../../assets/company logo/amazon.png.png';
import accenture from '../../assets/company logo/Accenture-logo.png';
import deloitte from '../../assets/company logo/Deloitte_Logo.png';
import ey from '../../assets/company logo/Ey buildings.svg';
import hsbc from '../../assets/company logo/HSBC_Logo_2018.png';
import sony from '../../assets/company logo/Sony_logo.svg.png';
import wipro from '../../assets/company logo/Wipro_Primary_Logo_Color_RGB.svg';
import tcs from '../../assets/company logo/tcs.png';
import pwc from '../../assets/company logo/pwc.png';
import musigma from '../../assets/company logo/mu sigma.png';

const PartnerLogos = () => {
  const curatedPartners = [
    { name: "Amazon", logo: amazon },
    { name: "Deloitte", logo: deloitte },
    { name: "EY", logo: ey },
    { name: "HSBC", logo: hsbc },
    { name: "Sony", logo: sony },
    { name: "Wipro", logo: wipro }
  ];
  
  return (
    <section className="pm-trust-section">
      <div className="pm-trust-container">
        
        {/* Top Split Layout */}
        <div className="pm-trust-top">
          
          {/* Left: Copy & Urgency */}
          <div className="pm-trust-content">
            <h2 className="pm-trust-headline">Where focused mentorship turns into real hiring outcomes.</h2>
            <p className="pm-trust-subheadline">Built for serious learners. Backed by real career momentum.</p>
            <div className="pm-trust-fomo">
              <span className="pm-fomo-pulse"></span>
              Next cohort applications are being reviewed in limited batches.
            </div>
          </div>

          {/* Right: Curated Logo Grid */}
          <div className="pm-trust-logos-grid">
            {curatedPartners.map((partner, index) => (
              <div key={index} className="pm-trust-logo-box">
                <img src={partner.logo} alt={partner.name} className="pm-trust-logo-img" />
              </div>
            ))}
          </div>

        </div>

        {/* Bottom: Premium Outcome Blocks */}
        <div className="pm-trust-metrics">
          <div className="pm-trust-metric-card">
            <div className="pm-metric-icon"><FaBuilding /></div>
            <div className="pm-metric-info">
              <h4>500+ Hiring Partners</h4>
              <p>Top global companies actively recruiting from our cohorts.</p>
            </div>
          </div>
          <div className="pm-trust-metric-card">
            <div className="pm-metric-icon"><FaMoneyBillWave /></div>
            <div className="pm-metric-info">
              <h4>12 LPA Average Package</h4>
              <p>Consistent, high-value outcomes for dedicated learners.</p>
            </div>
          </div>
          <div className="pm-trust-metric-card">
            <div className="pm-metric-icon"><FaUserCheck /></div>
            <div className="pm-metric-info">
              <h4>Guaranteed Interview Prep</h4>
              <p>End-to-end support until you land the right role.</p>
            </div>
          </div>
        </div>

        {/* Footer Micro-CTA */}
        <div className="pm-trust-cta-row">
          <p className="pm-trust-micro-cta">Apply before the next review window closes <FaChevronRight className="pm-trust-cta-icon" /></p>
        </div>

      </div>
    </section>
  );
};

export default PartnerLogos;
