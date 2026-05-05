import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

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
  const partners = [
    { name: "Amazon", logo: amazon },
    { name: "Accenture", logo: accenture },
    { name: "Deloitte", logo: deloitte },
    { name: "EY", logo: ey },
    { name: "HSBC", logo: hsbc },
    { name: "Sony", logo: sony },
    { name: "Wipro", logo: wipro },
    { name: "TCS", logo: tcs },
    { name: "PwC", logo: pwc },
    { name: "Mu Sigma", logo: musigma }
  ];
  
  return (
    <section className="km-partners">
      <div className="km-container">
        <p className="km-partners__label">Our Alumni Work At Top Global Companies</p>
        
        <div className="km-partners__marquee-wrap">
          <div className="km-partners__marquee">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="km-partners__logo-box">
                <img src={partner.logo} alt={partner.name} className="km-partners__logo" />
              </div>
            ))}
          </div>
        </div>

        <div className="km-partners__trust-row">
          <div className="km-partners__trust-item">
            <FaCheckCircle className="km-partners__trust-icon" />
            500+ Hiring Partners
          </div>
          <div className="km-partners__trust-item">
            <FaCheckCircle className="km-partners__trust-icon" />
            12 LPA Average Package
          </div>
          <div className="km-partners__trust-item">
            <FaCheckCircle className="km-partners__trust-icon" />
            Guaranteed Interview Prep
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
