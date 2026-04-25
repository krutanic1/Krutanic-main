import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-16 text-gray-800">
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f15b29]">Privacy Policy</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">How We Handle Your Information</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          At Krutanic, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use our website and services. By accessing or using our website,
          you consent to the practices described in this policy.
        </p>

        <div className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
          <section>
            <h2 className="text-lg font-bold text-gray-900">Information We Collect</h2>
            <p className="mt-2"><strong>Personal Information:</strong> We may collect personal information, such as your name, email address, contact details, and other identifiers when you register for an account, apply for courses, or use our services.</p>
            <p className="mt-2"><strong>Usage Data:</strong> We collect information about your interactions with our website, including your IP address, browser type, pages visited, and the date and time of your visits.</p>
            <p className="mt-2"><strong>Payment Information:</strong> If you make payments for our services, we may collect payment card details or other financial information to process transactions.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">How We Use Your Information</h2>
            <p className="mt-2"><strong>Provide Services:</strong> We use your information to provide, maintain, and improve our services, including course registration, placement services, and customer support.</p>
            <p className="mt-2"><strong>Communications:</strong> We may use your email address to send you important updates, newsletters, and promotional materials. You can opt-out of marketing communications at any time.</p>
            <p className="mt-2"><strong>Analytics:</strong> We use data analytics to analyze website usage patterns, improve our content and services, and customize your experience.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Information Sharing</h2>
            <p className="mt-2">We may share your information with third parties in the following circumstances:</p>
            <p className="mt-2"><strong>Service Providers:</strong> We may disclose your information to trusted third-party service providers who assist us in operating our website and providing our services.</p>
            <p className="mt-2"><strong>Legal Compliance:</strong> We may share your information to comply with legal obligations, respond to legal requests, or protect our rights, privacy, safety, or property.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Security</h2>
            <p className="mt-2">We employ reasonable security measures to protect your personal information. However, no data transmission over the internet or storage system is completely secure, and we cannot guarantee the absolute security of your data.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Your Choices</h2>
            <p className="mt-2">You can review and update your personal information by logging into your account. You can opt-out of receiving marketing communications from us. You can disable cookies in your browser settings, but this may affect website functionality.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Children's Privacy</h2>
            <p className="mt-2">Our services are not intended for children under the age of 13. We do not knowingly collect or solicit personal information from children. If you believe a child has provided us with personal information, please contact us, and we will take appropriate steps to remove the information.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Changes to This Privacy Policy</h2>
            <p className="mt-2">We may update this Privacy Policy to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the revised policy on our website.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900">Contact Us</h2>
            <p className="mt-2">If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@krutanic.com.</p>
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
