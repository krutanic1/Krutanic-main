import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8 max-w-4xl">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Legal</p>
          <h1 className="text-4xl lg:text-5xl text-primary mb-4">Terms of Service</h1>
          <h2 className="text-2xl text-primary mb-8">Terms and Conditions</h2>

          <p className="text-on-surface-variant leading-relaxed mb-8">
            Welcome to Dikshannt! By accessing or using our services, you agree to comply with and be bound by the
            following terms and conditions. Please read them carefully.
          </p>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h3 className="text-xl text-primary mb-3">1. General</h3>
              <p>1.1 These Terms apply to all users of our platform, services, and programs.</p>
              <p className="mt-2">1.2 The company reserves the right to update or modify these Terms at any time without prior notice.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">2. Eligibility</h3>
              <p>2.1 Users must meet the minimum age requirement of 16 years or provide parental consent.</p>
              <p className="mt-2">2.2 Enrollment in certain courses or programs may require prerequisite qualifications.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">3. Services</h3>
              <p>3.1 We provide educational programs, training, and resources through our platform and partnerships.</p>
              <p className="mt-2">3.2 Program details, schedules, and fees are subject to change without prior notice.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">4. Payments</h3>
              <p>4.1 Fees must be paid in full before accessing any course or program unless specified otherwise.</p>
              <p className="mt-2">4.2 Fees are non-refundable.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">5. Intellectual Property</h3>
              <p>5.1 All course materials, content, and resources are owned by Dikshannt or its licensors.</p>
              <p className="mt-2">5.2 Users may not reproduce, distribute, or share any materials without prior written consent.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">6. User Conduct</h3>
              <p>6.1 Users must not engage in any unlawful, disruptive, or harmful activities on the platform.</p>
              <p className="mt-2">6.2 Breach of this conduct policy may result in suspension or termination of access.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">7. Data Privacy</h3>
              <p>7.1 We are committed to protecting your personal information.</p>
              <p className="mt-2">7.2 Please refer to our Privacy Policy for details on how we collect, use, and store data.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">8. Limitation of Liability</h3>
              <p>8.1 Dikshannt is not liable for any direct or indirect damages resulting from the use of our platform or services.</p>
              <p className="mt-2">8.2 We do not guarantee job placements or specific outcomes from any program.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">9. Cancellations and Refunds</h3>
              <p>9.1 Cancellations must be made in writing within the specified refund window.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">10. Dispute Resolution</h3>
              <p>10. The decision of the arbitrator shall be final and binding.</p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">11. Contact Information</h3>
              <p>
                For any questions or concerns regarding these Terms, please contact us at{' '}
                <a href="mailto:support@dikshannt.com" className="text-primary underline underline-offset-4 hover:opacity-80">
                  support@dikshannt.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
