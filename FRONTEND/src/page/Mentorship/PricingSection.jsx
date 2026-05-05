import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="km-pricing-cta-wrap" id="mentorship">
      <div className="km-container">
        <div className="mentorship-pricing-cta" data-aos="zoom-in">
          <div className="km-section-chip km-section-chip--light">Pricing Details</div>
          <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Investment for Your Career Growth</h2>
          <p style={{ maxWidth: '750px', margin: '0 auto 2.5rem', opacity: 0.9, lineHeight: 1.7, color: '#fff' }}>
            Choose from our flexible learning tracks designed to fit your schedule and career aspirations. 
            All programs include 1:1 mentorship, real-world projects, and industry-recognized certification.
          </p>
          
          <div className="km-pricing-features" style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '2.5rem', flexWrap: 'wrap', color: '#fff' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCheckCircle /> 0% EMI Options</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCheckCircle /> Scholarship Support</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCheckCircle /> Lifetime Portal Access</span>
          </div>

          <button 
            className="mentorship-primary-btn" 
            onClick={() => navigate('/FeeStructure')}
            style={{ 
              background: '#fff', 
              color: '#f15b29', 
              padding: '16px 40px', 
              fontSize: '1.1rem',
              margin: '0 auto',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Explore Pricing Plans <FaArrowRight style={{ marginLeft: '12px' }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
