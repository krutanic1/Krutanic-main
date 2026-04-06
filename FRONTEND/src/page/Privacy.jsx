import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Privacy Policy</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">How We Handle Your Information</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          We collect only the information needed to support your inquiry, enrollment, and communication with our team. Your data is used to provide services, contact you about programs, and improve the experience.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p className="mt-2">This may include your name, email address, phone number, program interest, and related form submissions.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">2. How We Use It</h2>
            <p className="mt-2">We use your information to respond to queries, send updates, and manage course or callback requests.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Data Protection</h2>
            <p className="mt-2">We take reasonable steps to protect your data and do not sell your personal information to third parties.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" className="rounded-full bg-[#f15b29] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e14f1f]">
            Back to Home
          </Link>
          <Link to="/Terms" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Terms of Service
          </Link>
          <Link to="/RefundPolicy" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;