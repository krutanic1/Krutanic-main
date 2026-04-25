import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Terms of Service</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">Terms and Conditions</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          Welcome to Krutanic! By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
          Please read them carefully.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. General</h2>
            <p className="mt-2">1.1 These Terms apply to all users of our platform, services, and programs.</p>
            <p className="mt-2">1.2 The company reserves the right to update or modify these Terms at any time without prior notice.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Eligibility</h2>
            <p className="mt-2">2.1 Users must meet the minimum age requirement of 16 years or provide parental consent.</p>
            <p className="mt-2">2.2 Enrollment in certain courses or programs may require prerequisite qualifications.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Services</h2>
            <p className="mt-2">3.1 We provide educational programs, training, and resources through our platform and partnerships.</p>
            <p className="mt-2">3.2 Program details, schedules, and fees are subject to change without prior notice.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">4. Payments</h2>
            <p className="mt-2">4.1 Fees must be paid in full before accessing any course or program unless specified otherwise.</p>
            <p className="mt-2">4.2 Fees are non-refundable.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">5. Intellectual Property</h2>
            <p className="mt-2">5.1 All course materials, content, and resources are owned by Krutanic or its licensors.</p>
            <p className="mt-2">5.2 Users may not reproduce, distribute, or share any materials without prior written consent.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">6. User Conduct</h2>
            <p className="mt-2">6.1 Users must not engage in any unlawful, disruptive, or harmful activities on the platform.</p>
            <p className="mt-2">6.2 Breach of this conduct policy may result in suspension or termination of access.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">7. Data Privacy</h2>
            <p className="mt-2">7.1 We are committed to protecting your personal information.</p>
            <p className="mt-2">7.2 Please refer to our Privacy Policy for details on how we collect, use, and store data.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">8. Limitation of Liability</h2>
            <p className="mt-2">8.1 Krutanic is not liable for any direct or indirect damages resulting from the use of our platform or services.</p>
            <p className="mt-2">8.2 We do not guarantee job placements or specific outcomes from any program.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Cancellations and Refunds</h2>
            <p className="mt-2">9.1 Cancellations must be made in writing within the specified refund window.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">10. Dispute Resolution</h2>
            <p className="mt-2">10. The decision of the arbitrator shall be final and binding.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">11. Contact Information</h2>
            <p className="mt-2">For any questions or concerns regarding these Terms, please contact us at support@krutanic.com.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" className="rounded-full bg-[#f15b29] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e14f1f]">
            Back to Home
          </Link>
          <Link to="/Privacy" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Privacy Policy
          </Link>
          <Link to="/RefundPolicy" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
