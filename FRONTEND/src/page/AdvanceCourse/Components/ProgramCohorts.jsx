import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import ApplyNowButton from './ApplyNowButton';

const ProgramCohorts = ({ courseValue = "Data Science", date = "Upcoming" }) => {
  const displayDate = date.toLowerCase().includes("upcoming") ? "Upcoming" : date;

  const cohorts = [
    {
      section: "Section 1: Mon to Friday",
      date: displayDate,
      time: "19:30 IST – 21:00 IST"
    },
    {
      section: "Section 2: Sat and Sunday",
      date: displayDate,
      time: "19:30 IST – 21:00 IST"
    }
  ];

  return (
    <div style={{ marginTop: '48px', background: '#F8FAFC', border: '1px solid var(--ds-border)', borderRadius: '12px', padding: '32px' }}>
      <style>{`
        .cohort-header {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--ds-text);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cohort-badge {
          background: rgba(15, 118, 110, 0.1);
          color: var(--ds-primary);
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cohort-list {
          display: grid;
          gap: 16px;
        }

        .cohort-card {
          background: #fff;
          border: 1px solid var(--ds-border);
          border-radius: 8px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.3s;
        }

        .cohort-card:hover {
          border-color: var(--ds-primary);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }

        .cohort-section-title {
          font-weight: 800;
          font-size: 16px;
          color: var(--ds-text);
          min-width: 220px;
        }

        .cohort-details {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .cohort-info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ds-text-dim);
          font-size: 15px;
          font-weight: 600;
        }

        .cohort-icon {
          color: var(--ds-primary);
        }

        @media (max-width: 768px) {
          .cohort-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .cohort-details {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="cohort-header">
        Program Cohort
      </div>

      <div className="cohort-list">
        {cohorts.map((cohort, idx) => (
          <div key={idx} className="cohort-card">
            <div className="cohort-section-title">
              {cohort.section}
            </div>
            <div className="cohort-details">
              <div className="cohort-info-item">
                <Calendar size={18} className="cohort-icon" />
                {cohort.date}
              </div>
              <div className="cohort-info-item">
                <Clock size={18} className="cohort-icon" />
                {cohort.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
        <ApplyNowButton courseValue={courseValue} label="Book Now" className="!px-8 !py-3" />
      </div>
    </div>
  );
};

export default ProgramCohorts;
