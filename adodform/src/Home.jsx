import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import EnrollmentForm from './EnrollmentForm';
import {
  HeroSection,
  AlertBanner,
  PartnersSection,
  ComparisonSection,
  RoadmapSection,
  ProgramPerksSection,
  GuaranteeSection,
  ReviewsSection,
  FAQSection,
  PlacementModal
} from './LandingComponents';

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="adv-landing">
      <Toaster position="top-center" reverseOrder={false} />
      <HeroSection onShowModal={() => setShowModal(true)} />
      <AlertBanner />
      <ProgramPerksSection />
      <RoadmapSection />
      <PartnersSection />
      <ReviewsSection />
      <EnrollmentForm />
      <ComparisonSection />
      <GuaranteeSection onShowModal={() => setShowModal(true)} />
      <FAQSection />

      {showModal && <PlacementModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
