import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Components
import MentorshipHero from './Mentorship/MentorshipHero';
import PartnerLogos from './Mentorship/PartnerLogos';
import SpecializationsSection from './Mentorship/SpecializationsSection';
import PopularCoursesSection from './Mentorship/PopularCoursesSection';
import CareerTracksSection from './Mentorship/CareerTracksSection';
import CredentialSection from './Mentorship/CredentialSection';
import MentorShowcase from './Mentorship/MentorShowcase';
import EnrollmentSteps from './Mentorship/EnrollmentSteps';
import PricingSection from './Mentorship/PricingSection';
import FAQSection from './Mentorship/FAQSection';
import FinalCTASection from './Mentorship/FinalCTASection';
import MentorshipForm from './MentorshipForm';

const Mentorship = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
    window.scrollTo(0, 0);

    // Auto-trigger popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div className="km-page">
      <Helmet>
        <title>Premium Mentorship | Krutanic - 1:1 Career Acceleration</title>
        <meta name="description" content="Join Krutanic's premium mentorship programs. Learn from industry experts, build real-world projects, and accelerate your career path with 1:1 guidance." />
        <link rel="canonical" href="https://www.krutanic.com/Mentorship" />
      </Helmet>

      {/* Enrollment Form Popup */}
      {showPopup && <MentorshipForm isPopup={true} onClose={() => setShowPopup(false)} />}

      {/* Main Page Layout */}
      <main>
        <MentorshipHero onOpenForm={togglePopup} />
        <PartnerLogos />
        <SpecializationsSection />
        <PopularCoursesSection />
        <CareerTracksSection />
        <CredentialSection />
        <MentorShowcase />
        <EnrollmentSteps />
        <PricingSection />
        <FAQSection />
        <FinalCTASection onOpenForm={togglePopup} />
      </main>

      {/* Floating WhatsApp for Mentorship */}
      <a
        href="https://api.whatsapp.com/send?phone=919380736449&text=Hello%20Krutanic%20Team,%20I'm%20interested%20in%20the%20Mentorship%20Program."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 100,
          background: '#25D366',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '30px',
          boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className="fa fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default Mentorship;
