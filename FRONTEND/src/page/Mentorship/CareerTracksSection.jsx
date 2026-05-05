import React from 'react';
import { FaLaptopCode, FaChartBar, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const CareerTracksSection = () => {
  const tracks = [
    {
      title: "Technical Track",
      position: "Development Roles",
      icon: <FaLaptopCode />,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
      accent: "#8b5cf6",
      desc: "Master coding, system architecture, and technical problem solving for high-growth dev roles.",
      courses: ["Full Stack", "DevOps", "AI/ML", "Cloud"]
    },
    {
      title: "Analytical Track",
      position: "Data & Strategy Roles",
      icon: <FaChartBar />,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)",
      accent: "#10b981",
      desc: "Harness the power of data to drive business decisions and strategic growth across industries.",
      courses: ["Data Science", "Business Analytics", "Finance"]
    },
    {
      title: "Design Track",
      position: "Creative Roles",
      icon: <FaMobileAlt />,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      accent: "#f97316",
      desc: "Craft beautiful interfaces and intuitive experiences that delight users and solve problems.",
      courses: ["UI/UX Design", "Graphics Design", "Product Design"]
    },
    {
      title: "Security Track",
      position: "Defense Roles",
      icon: <FaShieldAlt />,
      gradient: "linear-gradient(135deg, #ef4444 0%, #0f172a 100%)",
      accent: "#334155",
      desc: "Protect critical infrastructure and digital assets from emerging cyber threats and attacks.",
      courses: ["Cyber Security", "Ethical Hacking", "Forensics"]
    }
  ];

  return (
    <section className="km-ctracks">
      <div className="km-ctracks__header" data-aos="fade-up">
        <div className="km-section-chip">Choose Your Team</div>
        <h2 className="km-section-title">High-Impact <span>Career</span> Tracks</h2>
        <p className="km-section-sub">We offer specialized paths designed to transform you into a professional industry player.</p>
      </div>

      <div className="km-ctracks__grid">
        {tracks.map((track, index) => (
          <div className="km-ctrack-card" key={index} data-aos="zoom-in" data-aos-delay={index * 100} style={{"--ctrack-accent": track.accent}}>
            <div className="km-ctrack-card__icon-wrap" style={{background: track.gradient}}>
              {track.icon}
            </div>
            <h3 className="km-ctrack-card__title">{track.title}</h3>
            <span className="km-ctrack-card__position">{track.position}</span>
            <p className="km-ctrack-card__desc">{track.desc}</p>
            
            <div className="km-ctrack-card__courses">
              {track.courses.map((course, idx) => (
                <span className="km-ctrack-card__course-tag" key={idx}>{course}</span>
              ))}
            </div>
            
            <div className="km-ctrack-card__bg-shape"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareerTracksSection;
