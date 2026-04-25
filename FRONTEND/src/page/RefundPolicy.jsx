import React from "react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Refund Policy</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">No Refund Policy</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          By enrolling in any of our educational programs, you acknowledge and agree that all fees, tuition, and payments made towards the
          program are strictly non-refundable under any circumstances. This policy applies regardless of withdrawal, cancellation,
          non-completion, dismissal, or any other reason. By making payment, you confirm that you have read, understood, and accepted this
          non-refundable policy.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">Policy Details</h2>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Non-Refundable Payments</h2>
            <p className="mt-2">All fees and payments made towards any of our educational programs are non-refundable under any circumstances.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Program Access</h2>
            <p className="mt-2">Once payment is confirmed, participants will receive access to all course materials and resources. This constitutes the completion of our obligation to provide the purchased service.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Exceptions</h2>
            <p className="mt-2">Refunds are not provided except in cases where the company is unable to deliver the agreed service due to unforeseen circumstances.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">4. Commitment to Quality</h2>
            <p className="mt-2">We are dedicated to offering programs that meet the highest educational standards. If you encounter any issues or require support, please contact us at support@krutanic.com, and we will be happy to assist you.</p>
          </section>
          <section>
            <p className="mt-2">By enrolling in our programs, you acknowledge and accept the terms of this No Refund Policy.</p>
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
