import React from 'react';
import { FaStar } from 'react-icons/fa';

// Import real mentor images
import akashImg from '../../assets/mentors/akash.jpg';
import deepakImg from '../../assets/mentors/deepak.jpg';
import nishithaImg from '../../assets/mentors/nishitha.jpg';
import subraImg from '../../assets/mentors/Subhra.jpg';
import rahulImg from '../../assets/mentors/rahul.jpg';
import rudraImg from '../../assets/mentors/rudra.jpg';
import aashishImg from '../../assets/mentors/aashish.jpg';
import sachinImg from '../../assets/mentors/sachin.jpg';

const MentorShowcase = () => {
  const mentors = [
    { 
      name: "Akash R", 
      domain: "Graphic Design", 
      exp: "5.5+ Yrs", 
      color: "#f15b29", 
      img: akashImg,
      position: "Senior Designer"
    },
    { 
      name: "Deepak Kumar", 
      domain: "Mobile App Dev", 
      exp: "5+ Yrs", 
      color: "#0ea5e9", 
      img: deepakImg,
      position: "App Architect"
    },
    { 
      name: "Nishitha Jha", 
      domain: "Psychology", 
      exp: "7+ Yrs", 
      color: "#ec4899", 
      img: nishithaImg,
      position: "Lead Consultant"
    },
    { 
      name: "Subra Prakash", 
      domain: "Sr. SME Data Science", 
      exp: "7+ Yrs", 
      color: "#10b981", 
      img: subraImg,
      position: "Data Scientist"
    },
    { 
      name: "Rahul Srivastava", 
      domain: "Embedded System", 
      exp: "19+ Yrs", 
      color: "#334155", 
      img: rahulImg,
      position: "Technical Director"
    },
    { 
      name: "Rudra Pratap", 
      domain: "Cyber Security", 
      exp: "6.5+ Yrs", 
      color: "#ef4444", 
      img: rudraImg,
      position: "Security Lead"
    },
    { 
      name: "Dr. Aashish Mishra", 
      domain: "Artificial Intelligence", 
      exp: "17+ Yrs", 
      color: "#8b5cf6", 
      img: aashishImg,
      position: "AI Research Lead"
    },
    { 
      name: "Sachin Kumar", 
      domain: "Full Stack Dev", 
      exp: "6+ Yrs", 
      color: "#f59e0b", 
      img: sachinImg,
      position: "Software Architect"
    }
  ];

  return (
    <section className="km-mentors">
      <div className="km-mentors__header" data-aos="fade-up">
        <div className="km-section-chip">Industry Experts</div>
        <h2 className="km-section-title">Learn from <span>Real</span> Professionals</h2>
        <p className="km-section-sub">Directly interact with mentors who have decades of experience leading global teams.</p>
        
        <div className="km-mentors__trust-badges">
          <span className="km-mentors__trust-badge">EX-GOOGLE</span>
          <span className="km-mentors__trust-badge">EX-MICROSOFT</span>
          <span className="km-mentors__trust-badge">EX-AMAZON</span>
          <span className="km-mentors__trust-badge">EX-ADOBE</span>
        </div>
      </div>

      <div className="km-mentors__grid">
        {mentors.map((mentor, index) => (
          <div className="km-mentor-card" key={index} data-aos="fade-up" data-aos-delay={index * 50} style={{"--mentor-color": mentor.color}}>
            <div className="km-mentor-card__accent-top"></div>
            <div className="km-mentor-card__img-wrap">
              <img src={mentor.img} alt={mentor.name} className="km-mentor-card__img" />
              <div className="km-mentor-card__exp-badge">{mentor.exp} EXP</div>
            </div>
            <h3 className="km-mentor-card__name">{mentor.name}</h3>
            <p className="km-mentor-card__domain">{mentor.domain}</p>
            <p className="km-mentor-card__credibility">{mentor.position}</p>
            <div className="km-mentor-card__stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MentorShowcase;
