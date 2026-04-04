import React from "react";

const EnrollMentor = () => {
  const steps = [
    {
      title: "Register with us",
      description:
        "Explore our mentorship tracks and submit your application form for the course you are interested in.",
      icon: "fa-search",
      tag: "Step 1",
    },
    {
      title: "You will get a call",
      description:
        "Our senior executive connects with you to understand your profile, goals, and preferred learning path.",
      icon: "fa-phone",
      tag: "Step 2",
    },
    {
      title: "Provide the details",
      description:
        "Share the required documents and profile details so your enrollment can be processed smoothly.",
      icon: "fa-file-text-o",
      tag: "Step 3",
    },
    {
      title: "Pay course fee",
      description: "Complete the payment and secure your seat to begin your mentorship journey.",
      icon: "fa-credit-card",
      tag: "Step 4",
    },
  ];

  return (
    <section className="container mx-auto" data-aos="fade-up">
      <div className="rounded-[24px] border border-[#e6e9f1] bg-white p-6 md:p-8 lg:p-10 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#f15b29]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#ff9b78]">
            Enrollment Guide
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            How to Enroll with us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5b6475] md:text-base">
            A simple 4-step process designed to get you from application to your first mentorship session quickly.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="group relative rounded-2xl border border-[#e3e7f0] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#f15b29]/55 hover:shadow-[0_10px_20px_rgba(15,23,42,0.08)]"
            >
              <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[#f15b29] via-[#ff8c61] to-transparent opacity-85" />

              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#f15b29]/35 bg-[#f15b29]/14 text-[#ff9b78]">
                  <i className={`fa ${step.icon} text-lg`} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <span className="inline-flex rounded-full border border-[#f15b29]/30 bg-[#f15b29]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ffab89]">
                    {step.tag}
                  </span>

                  <h3 className="mt-2 text-[1.65rem] font-semibold leading-snug text-[#111827]">
                    {index + 1}. {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#4f596d] md:text-[15px]">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnrollMentor;
