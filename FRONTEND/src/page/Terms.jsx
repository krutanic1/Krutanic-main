import React from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Terms of Service</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">Terms and Conditions</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          These Terms govern your use of Krutanic services, programs, and website content. By accessing our platform, you agree to follow all applicable rules, payment terms, and enrollment requirements.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Program Access</h2>
            <p className="mt-2">Access to courses and mentorship is provided based on the program you enroll in and the information you submit.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">2. User Responsibilities</h2>
            <p className="mt-2">You agree to provide accurate details, use the platform lawfully, and avoid any misuse of our services or content.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Changes to Terms</h2>
            <p className="mt-2">We may update these terms when needed. Continued use of the website means you accept the updated version.</p>
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