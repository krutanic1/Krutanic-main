import React from 'react';
import { FaChevronRight, FaWhatsapp } from 'react-icons/fa';

const FinalCTASection = ({ onOpenForm }) => {
  return (
    <section className="km-final-cta" data-aos="zoom-in">
      <div className="km-final-cta__content">
        <h2 className="km-final-cta__title">Ready to Transform Your Professional Path?</h2>
        <p className="km-final-cta__sub">Join 10,000+ students already accelerating their careers with Krutanic. Don't let your dream career wait any longer.</p>
        
        <div className="km-final-cta__actions">
          <button className="km-btn-primary km-btn-primary--large" onClick={onOpenForm}>
            Book Free Counseling <FaChevronRight style={{marginLeft: '12px'}} />
          </button>
          <a 
            href="https://api.whatsapp.com/send?phone=919380736449" 
            target="_blank" 
            rel="noreferrer"
            className="km-btn-secondary km-btn-secondary--wa"
            style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}
          >
            <FaWhatsapp style={{marginRight: '12px', fontSize: '1.5rem'}} /> Contact Support
          </a>
        </div>
        
        <p className="km-final-cta__note">Free consultation • No obligation • Career roadmap included</p>
      </div>

      <div className="km-final-cta__blob km-final-cta__blob--1"></div>
      <div className="km-final-cta__blob km-final-cta__blob--2"></div>
    </section>
  );
};

export default FinalCTASection;
