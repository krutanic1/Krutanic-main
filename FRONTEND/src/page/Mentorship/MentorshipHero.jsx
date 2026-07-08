import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaPlay, FaRegFileAlt, FaChevronRight } from 'react-icons/fa';
import heroImg from '../../assets/mentorship_hero.png';

const MentorshipHero = ({ onOpenForm }) => {
  return (
    <section className="km-hero">
      <div className="km-hero__container">
        <div className="km-hero__content" data-aos="fade-right">
          <h1 className="km-hero__headline">
            Accelerate Your <span className="km-hero__headline-accent">Tech Career</span> with 1:1 Mentorship
          </h1>
          <p className="km-hero__sub">
            Master high-demand skills through live industry sessions, real-world capstone projects, and direct guidance from expert mentors.
          </p>
          <div className="km-hero__ctas">
            <button className="km-btn-primary" onClick={onOpenForm}>
              Apply for Mentorship <FaChevronRight style={{marginLeft: '10px'}} />
            </button>
          </div>
          <div className="km-hero__stats">
            <div className="km-hero__stat">
              <div className="km-hero__stat-icon">🎓</div>
              <div>
                <strong>10k+</strong>
                <span>Active Learners</span>
              </div>
            </div>
            <div className="km-hero__stat">
              <div className="km-hero__stat-icon">🤝</div>
              <div>
                <strong>500+</strong>
                <span>Hiring Partners</span>
              </div>
            </div>
            <div className="km-hero__stat">
              <div className="km-hero__stat-icon">🚀</div>
              <div>
                <strong>100%</strong>
                <span>Placement Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="km-hero__visual" data-aos="fade-left">
          <div style={{ position: 'relative', width: '180%', left: '-40%' }}>
            <DotLottieReact
              src="https://lottie.host/817ffd17-da62-4ac8-a9df-498070d0bc20/rftXYj1bK0.lottie"
              loop
              autoplay
              className="km-hero__img"
              renderConfig={{ devicePixelRatio: window.devicePixelRatio }}
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          
          <div className="km-hero__badge km-hero__badge--top">
            <div className="km-hero__badge-icon"><FaPlay /></div>
            <div>
              <p style={{margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#0f172a'}}>Live Sessions</p>
              <p style={{margin: 0, fontSize: '0.75rem', color: '#64748b'}}>Interact with Experts</p>
            </div>
          </div>

          <div className="km-hero__badge km-hero__badge--bottom">
            <div className="km-hero__badge-icon" style={{color: '#0ea5e9'}}><FaRegFileAlt /></div>
            <div>
              <p style={{margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#0f172a'}}>Real Projects</p>
              <p style={{margin: 0, fontSize: '0.75rem', color: '#64748b'}}>Build Your Portfolio</p>
            </div>
          </div>

          <div className="km-hero__blob km-hero__blob--1"></div>
          <div className="km-hero__blob km-hero__blob--2"></div>
        </div>
      </div>
    </section>
  );
};

export default MentorshipHero;
