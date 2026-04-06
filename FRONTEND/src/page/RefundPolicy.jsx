import React from "react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Refund Policy</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">Refunds and Cancellations</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          Our programs are delivered through guided mentorship, live sessions, and digital access, so refund eligibility depends on the specific program and the stage of enrollment.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Refund Eligibility</h2>
            <p className="mt-2">Refunds are considered only under the conditions communicated at the time of purchase or enrollment.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Request Window</h2>
            <p className="mt-2">Any refund request should be submitted promptly to our support team with the relevant payment and enrollment details.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Final Decision</h2>
            <p className="mt-2">Approved refunds, if any, will be processed through the original payment method according to the program-specific policy.</p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/" className="rounded-full bg-[#f15b29] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e14f1f]">
            Back to Home
          </Link>
          <Link to="/Terms" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Terms of Service
          </Link>
          <Link to="/Privacy" className="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:border-[#f15b29] hover:text-[#f15b29]">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;