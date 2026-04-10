import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <Header scrolled={true} />

      <section className="pt-32 pb-20 bg-surface">
        <div className="container mx-auto px-8 max-w-4xl">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline mb-4">Legal</p>
          <h1 className="text-4xl lg:text-5xl text-primary mb-8">Refund Policy</h1>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-2xl text-primary mb-3">No Refund Policy</h2>
              <p>
                By enrolling in any of our educational programs, you acknowledge and agree that all fees, tuition, and
                payments made towards the program are strictly non-refundable under any circumstances. This policy
                applies regardless of withdrawal, cancellation, non-completion, dismissal, or any other reason. By
                making payment, you confirm that you have read, understood, and accepted this non-refundable policy.
              </p>
            </section>

            <section>
              <h3 className="text-xl text-primary mb-3">Policy Details</h3>

              <p>
                <span className="font-semibold text-on-surface">1. Non-Refundable Payments</span>
              </p>
              <p className="mt-1">
                All fees and payments made towards any of our educational programs are non-refundable under any
                circumstances.
              </p>

              <p className="mt-4">
                <span className="font-semibold text-on-surface">2. Program Access</span>
              </p>
              <p className="mt-1">
                Once payment is confirmed, participants will receive access to all course materials and resources. This
                constitutes the completion of our obligation to provide the purchased service.
              </p>

              <p className="mt-4">
                <span className="font-semibold text-on-surface">3. Exceptions</span>
              </p>
              <p className="mt-1">
                Refunds are not provided except in cases where the company is unable to deliver the agreed service due
                to unforeseen circumstances.
              </p>

              <p className="mt-4">
                <span className="font-semibold text-on-surface">4. Commitment to Quality</span>
              </p>
              <p className="mt-1">
                We are dedicated to offering programs that meet the highest educational standards. If you encounter any
                issues or require support, please contact us at{' '}
                <a href="mailto:support@dikshannt.com" className="text-primary underline underline-offset-4 hover:opacity-80">
                  support@dikshannt.com
                </a>
                , and we will be happy to assist you.
              </p>
            </section>

            <section>
              <p>
                By enrolling in our programs, you acknowledge and accept the terms of this No Refund Policy.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
