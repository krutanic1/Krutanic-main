import React from 'react';
import { Users, UserCheck, FileText, PieChart, Briefcase } from 'lucide-react';
import DownloadBrochureButton from '../page/AdvanceCourse/Components/DownloadBrochureButton';

const defaultSupportItems = [
  { title: "Group Mentoring & Networking", icon: <Users size={20} /> },
  { title: "1:1 Interview Prep & Mock Rounds", icon: <UserCheck size={20} /> },
  { title: "AI-Driven Resume & LinkedIn Optimization", icon: <FileText size={20} /> },
  { title: "Portfolio & Dashboard Review Sessions", icon: <PieChart size={20} /> },
  { title: "Referral Access to Hiring Partners", icon: <Briefcase size={20} /> }
];

const CareerSupport = ({ 
  courseValue = "Data Analytics", 
  brochureLink,
  supportItems = defaultSupportItems
}) => {
  return (
    <section className="career-support-section" style={{ padding: '100px 0', background: '#fff' }}>
      <style>{`
        .cs-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: stretch;
        }
        
        .cs-left-card {
          background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
          border-radius: 16px;
          padding: 48px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .cs-left-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }

        .cs-label {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #93C5FD;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .cs-heading {
          font-size: 36px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          z-index: 2;
        }

        .cs-subheading {
          font-size: 16px;
          line-height: 1.6;
          color: #BFDBFE;
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        }

        .cs-cta-wrapper {
          position: relative;
          z-index: 2;
          width: fit-content;
        }

        .cs-cta-wrapper button {
          background: #fff !important;
          color: #1E3A8A !important;
          border: none !important;
          padding: 14px 28px !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          transition: 0.3s !important;
        }

        .cs-cta-wrapper button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
        }

        .cs-right-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: center;
        }

        .cs-list-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 24px;
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }

        .cs-list-item:hover {
          border-color: #3B82F6;
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.08);
          transform: translateY(-2px);
        }

        .cs-item-icon {
          background: #EFF6FF;
          color: #2563EB;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cs-item-title {
          font-weight: 700;
          font-size: 16px;
          color: #0F172A;
        }

        @media (max-width: 992px) {
          .cs-container {
            grid-template-columns: 1fr;
          }
          .cs-heading {
            font-size: 28px;
          }
          .cs-left-card {
            padding: 32px;
          }
        }
      `}</style>

      <div className="shell" style={{ width: '100%', maxWidth: '1210px', margin: '0 auto', padding: '0 24px' }}>
        <div className="cs-container">
          {/* Left Side */}
          <div className="cs-left-card">
            <div className="cs-label">Career Support</div>
            <h2 className="cs-heading">Power Your Career With Structured Job Support</h2>
            <p className="cs-subheading">
              We help freshers, working professionals, and career switchers seamlessly transition into high-growth tech and business roles. Receive end-to-end guidance from expert profile polishing to targeted interview preparation, ensuring you stand out to top employers.
            </p>
            <div className="cs-cta-wrapper">
              <DownloadBrochureButton 
                 courseValue={courseValue} 
                 brochureLink={brochureLink} 
                 label="Download Career Brochure"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="cs-right-list">
            {supportItems.map((item, idx) => (
              <div key={idx} className="cs-list-item">
                <div className="cs-item-icon">
                  {item.icon}
                </div>
                <div className="cs-item-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSupport;
