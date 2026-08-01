import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import MentorshipForm from '../MentorshipForm';
import './MentorshipPremium.css';

const MentorshipHero = ({ onOpenForm }) => {
  return (
    <section className="pm-hero">
      <div className="pm-hero-container">
        <div className="pm-hero-content" data-aos="fade-right">
          <div className="pm-hero-eyebrow">Premium Career Accelerator</div>
          <h1 className="pm-hero-title">
            Choose the mentorship path that shapes your <span className="pm-text-gradient">next profession.</span>
          </h1>
          <p className="pm-hero-subtitle">
            Structured, mentor-led pathways in engineering, AI, design, and infrastructure for learners building serious careers.
          </p>
          
          <div className="pm-hero-actions">
            <button className="pm-btn-primary" onClick={onOpenForm}>
              Explore Pathways <FaArrowRight className="pm-btn-icon" />
            </button>
            <button className="pm-btn-secondary" onClick={onOpenForm}>
              Speak to an Advisor
            </button>
          </div>

          <div className="pm-hero-trust">
            <div className="pm-trust-item">
              <span className="pm-trust-value">10k+</span>
              <span className="pm-trust-label">Active Learners</span>
            </div>
            <div className="pm-trust-divider"></div>
            <div className="pm-trust-item">
              <span className="pm-trust-value">500+</span>
              <span className="pm-trust-label">Hiring Brands</span>
            </div>
            <div className="pm-trust-divider"></div>
            <div className="pm-trust-item">
              <span className="pm-trust-value">100%</span>
              <span className="pm-trust-label">Outcome Focused</span>
            </div>
          </div>
        </div>

        <div className="pm-hero-visual" data-aos="fade-left">
          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <MentorshipForm inlineMode={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipHero;
