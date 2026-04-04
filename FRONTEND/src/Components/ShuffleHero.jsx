import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import heroImage from '../../krutanic/images/publicspeech2.jpg'

const ShuffleHero = () => {
  useEffect(() => {}, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#f7f2ef] px-4 py-14 md:px-8 md:py-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');`}</style>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

      <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] relative z-10">
        <div className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d8c8] bg-[#fff5ee] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#be4b20] shadow-sm">
            <FaGraduationCap className="text-[14px]" />
            Best Learning Platform
          </div>

          <h1 className="max-w-[10ch] text-[3.25rem] leading-[0.95] tracking-[-0.04em] text-[#101828] md:text-[4.2rem] lg:text-[5.4rem]" style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700 }}>
            Transform your passion into <span className="text-[#f15b29]">Building a Future in Tech.</span>
          </h1>

          <p className="max-w-[680px] text-[16px] leading-[1.72] text-[#4b5563] md:text-[18px]">
            At KRUTANIC, we engineer your potential into a powerful career. Our immersive digital programs deliver the exact tools you need to dominate the competitive tech landscape.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/Advance" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f15b29] px-8 py-4 font-semibold text-white shadow-[0_14px_32px_rgba(241,91,41,0.26)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(241,91,41,0.36)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em]">Explore Programs</span>
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid w-full max-w-[760px] gap-3 pt-2 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#efe0d8] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
              <div className="text-[13px] uppercase tracking-[0.18em] text-[#9ca3af]">Programs</div>
              <div className="mt-1 text-[28px] font-extrabold leading-none text-[#111827]">8+</div>
            </div>
            <div className="rounded-[18px] border border-[#efe0d8] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
              <div className="text-[13px] uppercase tracking-[0.18em] text-[#9ca3af]">Mentors</div>
              <div className="mt-1 text-[28px] font-extrabold leading-none text-[#111827]">170+</div>
            </div>
            <div className="rounded-[18px] border border-[#efe0d8] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.04)]">
              <div className="text-[13px] uppercase tracking-[0.18em] text-[#9ca3af]">Hiring Partners</div>
              <div className="mt-1 text-[28px] font-extrabold leading-none text-[#111827]">250+</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute -inset-6 rounded-[44px] bg-[radial-gradient(circle_at_20%_15%,rgba(241,91,41,0.18),transparent_34%),radial-gradient(circle_at_80%_85%,rgba(59,130,246,0.12),transparent_30%)] blur-2xl" />

          <div className="relative rounded-[38px] border border-white/80 bg-white/80 p-3 shadow-[0_24px_64px_rgba(17,24,39,0.14)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[28px] border border-[#e9ddd4] bg-[#fffdfb] p-3">
              <img
                src={heroImage}
                alt="Professionals collaborating in a modern learning environment"
                className="h-[480px] w-full rounded-[22px] object-cover md:h-[560px]"
              />
            </div>

            <div className="absolute -bottom-6 left-6 max-w-[320px] rounded-[22px] border border-[#efe0d8] bg-white px-5 py-4 shadow-[0_16px_36px_rgba(17,24,39,0.12)]">
              <div className="text-[14px] font-semibold text-[#111827]">Outcome Focused</div>
              <p className="mt-1 text-[15px] leading-6 text-[#4b5563]">
                Build job-ready skills with a curriculum designed for real industry outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShuffleHero;