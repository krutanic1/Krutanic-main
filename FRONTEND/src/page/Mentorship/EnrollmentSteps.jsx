import React from 'react';
import { FaUserEdit, FaPhoneVolume, FaLaptopCode, FaRocket } from 'react-icons/fa';

const EnrollmentSteps = () => {
  const steps = [
    {
      icon: <FaUserEdit />,
      title: "Submit Application",
      desc: "Fill out your details and choose your preferred specialization track.",
      tag: "Step 01"
    },
    {
      icon: <FaPhoneVolume />,
      title: "Counseling Call",
      desc: "Our career advisors will reach out to discuss your goals and roadmap.",
      tag: "Step 02"
    },
    {
      icon: <FaLaptopCode />,
      title: "Live Training",
      desc: "Start your journey with live industry-expert sessions and capstone projects.",
      tag: "Step 03"
    },
    {
      icon: <FaRocket />,
      title: "Career Launch",
      desc: "Receive certificates, portfolio reviews, and internship/job support.",
      tag: "Step 04"
    }
  ];

  return (
    <section className="km-enroll">
      <div className="km-enroll__header" data-aos="fade-up">
        <div className="km-section-chip">How to Start</div>
        <h2 className="km-section-title">Your <span>Roadmap</span> to Success</h2>
        <p className="km-section-sub">A simple, transparent process to get you from learner to professional.</p>
      </div>

      <div className="km-enroll__grid">
        {steps.map((step, index) => (
          <div className="km-enroll-card" key={index} data-aos="fade-up" data-aos-delay={index * 150}>
            <div className="km-enroll-card__top-line"></div>
            <div className="km-enroll-card__icon-wrap">
              {step.icon}
            </div>
            <span className="km-enroll-card__tag">{step.tag}</span>
            <h3 className="km-enroll-card__title">{step.title}</h3>
            <p className="km-enroll-card__desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnrollmentSteps;
