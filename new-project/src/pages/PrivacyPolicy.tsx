import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8 max-w-4xl">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Legal</p>
          <h1 className="text-4xl lg:text-5xl text-primary mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-2xl text-primary mb-3">How We Handle Your Information</h2>
              <p>
                At Dikshannt, we value your privacy and are committed to protecting your personal information. This
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                website and services. By accessing or using our website, you consent to the practices described in this
                policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Information We Collect</h3>
              <p>
                <span className="font-semibold text-on-surface">Personal Information:</span> We may collect personal
                information, such as your name, email address, contact details, and other identifiers when you register
                for an account, apply for courses, or use our services.
              </p>
              <p className="mt-2">
                <span className="font-semibold text-on-surface">Usage Data:</span> We collect information about your
                interactions with our website, including your IP address, browser type, pages visited, and the date and
                time of your visits.
              </p>
              <p className="mt-2">
                <span className="font-semibold text-on-surface">Payment Information:</span> If you make payments for
                our services, we may collect payment card details or other financial information to process transactions.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">How We Use Your Information</h3>
              <p>
                <span className="font-semibold text-on-surface">Provide Services:</span> We use your information to
                provide, maintain, and improve our services, including course registration, placement services, and
                customer support.
              </p>
              <p className="mt-2">
                <span className="font-semibold text-on-surface">Communications:</span> We may use your email address to
                send you important updates, newsletters, and promotional materials. You can opt-out of marketing
                communications at any time.
              </p>
              <p className="mt-2">
                <span className="font-semibold text-on-surface">Analytics:</span> We use data analytics to analyze
                website usage patterns, improve our content and services, and customize your experience.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Information Sharing</h3>
              <p className="mb-2">We may share your information with third parties in the following circumstances:</p>
              <p>
                <span className="font-semibold text-on-surface">Service Providers:</span> We may disclose your
                information to trusted third-party service providers who assist us in operating our website and
                providing our services.
              </p>
              <p className="mt-2">
                <span className="font-semibold text-on-surface">Legal Compliance:</span> We may share your information
                to comply with legal obligations, respond to legal requests, or protect our rights, privacy, safety, or
                property.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Security</h3>
              <p>
                We employ reasonable security measures to protect your personal information. However, no data
                transmission over the internet or storage system is completely secure, and we cannot guarantee the
                absolute security of your data.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Your Choices</h3>
              <p>
                You can review and update your personal information by logging into your account. You can opt-out of
                receiving marketing communications from us. You can disable cookies in your browser settings, but this
                may affect website functionality.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Children's Privacy</h3>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect or solicit
                personal information from children. If you believe a child has provided us with personal information,
                please contact us, and we will take appropriate steps to remove the information.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy to reflect changes to our practices or for other operational, legal,
                or regulatory reasons. We will notify you of any material changes by posting the revised policy on our
                website.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Contact Us</h3>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at{' '}
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
