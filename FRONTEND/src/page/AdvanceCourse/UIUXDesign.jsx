import React from "react";
import { Link } from "react-router-dom";

const uiuxThumbnail = "/course_thumbnails/ui-ux-design.jpg";

const UIUXDesign = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#111827]">
      <section className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8">
        <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-8 shadow-[0_12px_28px_rgba(15,23,42,0.08)] md:p-12">
          <span className="inline-block rounded-full bg-[#fff1ea] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f15b29]">
            Advanced Program
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
            UI/UX Design
            <span className="block text-[#f15b29]">Advanced Program</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4b5563]">
            Build a strong design foundation with user research, interaction design,
            wireframing, prototyping, and design systems. Learn to ship intuitive
            digital experiences with real-world product thinking.
          </p>

          <img
            src={uiuxThumbnail}
            alt="UI and UX Design"
            className="mt-8 w-full max-w-3xl rounded-2xl border border-[#e5e7eb] object-cover"
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/Mentorship"
              className="rounded-xl bg-[#f15b29] px-5 py-3 font-semibold text-white transition hover:bg-[#d84e22]"
            >
              Enroll Through Mentorship
            </Link>
            <Link
              to="/FeeStructure"
              className="rounded-xl border border-[#111827] px-5 py-3 font-semibold text-[#111827] transition hover:bg-[#111827] hover:text-white"
            >
              View Fee Structure
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UIUXDesign;
