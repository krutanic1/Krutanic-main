import React from 'react';
import { FaDownload, FaShareAlt, FaAward, FaIdCard, FaProjectDiagram } from 'react-icons/fa';
import certInternship from '../../assets/certificates/c/internship.jpg';
import certTraining from '../../assets/certificates/c/training.jpg';

const CredentialSection = () => {
  return (
    <section className="km-creds">
      <div className="km-creds__container">
        <div className="km-creds__left">
          <div className="km-section-chip">Certifications</div>
          <h2 className="km-section-title">Credentials That <span>Matter</span></h2>
          <p className="km-creds__sub">Validate your hard work with dual certifications that are recognized by top hiring partners and industry leaders.</p>
          
          <div className="km-creds__highlights">
            <div className="km-creds__highlight">
              <div className="km-creds__highlight-icon"><FaAward /></div>
              <div>
                <h4>Verified Training</h4>
                <p>Certification of technical mastery in your chosen domain.</p>
              </div>
            </div>
            <div className="km-creds__highlight">
              <div className="km-creds__highlight-icon"><FaIdCard /></div>
              <div>
                <h4>Work Experience</h4>
                <p>Official internship certificate for your real-world contributions.</p>
              </div>
            </div>
            <div className="km-creds__highlight">
              <div className="km-creds__highlight-icon"><FaProjectDiagram /></div>
              <div>
                <h4>Project Verified</h4>
                <p>Portfolio-ready validation for your capstone project work.</p>
              </div>
            </div>
          </div>

          <div className="km-creds__stats">
            <div className="km-creds__stat">
              <strong>12k+</strong>
              <span>Verified Profiles</span>
            </div>
            <div className="km-creds__stat">
              <strong>500+</strong>
              <span>Colleges Impacted</span>
            </div>
          </div>
          <p className="km-creds__note">*All certificates include unique QR codes for instant recruiter verification.</p>
        </div>

        <div className="km-creds__right">
          <div className="km-cert-card">
            <img src={certTraining} alt="Training Certificate" className="km-cert-card__img" />
            <div className="km-cert-card__footer">
              <span>Training Certificate</span>
              <div className="km-cert-card__actions">
                <a href={certTraining} target="_blank" rel="noreferrer"><FaDownload /></a>
                <a href="#"><FaShareAlt /></a>
              </div>
            </div>
          </div>

          <div className="km-cert-card">
            <img src={certInternship} alt="Internship Certificate" className="km-cert-card__img" />
            <div className="km-cert-card__footer">
              <span>Experience Certificate</span>
              <div className="km-cert-card__actions">
                <a href={certInternship} target="_blank" rel="noreferrer"><FaDownload /></a>
                <a href="#"><FaShareAlt /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialSection;
