import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import heroImage from '../../krutanic/images/publicspeech2.jpg' // Adjust to your path

const ShuffleHero = () => {
  useEffect(() => {}, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#f7f2ef] px-4 py-10 md:px-8 md:py-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');`}</style>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

      {/* Main Grid Container */}
      <div className="mx-auto grid max-w-[1360px] items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] relative z-10">
        
        {/* Left Content Area */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          
          {/* Badge */}
          <div className="self-start inline-flex items-center gap-2 rounded-full border border-[#f2d8c8] bg-[#fff5ee] px-4 py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-[#be4b20] shadow-sm">
            <FaGraduationCap className="text-[14px]" />
            Best Learning Platform
          </div>

          {/* HEADLINE - Fixed line height and added a specific gap to prevent overlapping */}
          <h1 className="text-[3rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[5.5rem] xl:text-[6.2rem] leading-[1.1] md:leading-[1.05] tracking-[-0.04em] text-[#101828] w-full m-0 p-0 text-left" style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
            <span className="block font-bold text-[#112340] text-left">Transform</span>
            <span className="block font-normal text-[#112340] opacity-90 text-left">your passion into</span>
            {/* Added pt-3 md:pt-4 here to explicitly push this line down and stop the overlapping */}
            <span className="block font-bold text-[#e85d34] text-left pt-3 md:pt-4">Building a</span>
            <span className="block font-bold text-[#e85d34] text-left mt-1 md:mt-2">Future in Tech.</span>
          </h1>

          {/* PARAGRAPH */}
          <p className="max-w-[580px] text-[15px] leading-[1.6] md:leading-[1.8] text-[#4b5563] md:text-[16px] text-left m-0 p-0">
            At KRUTANIC, we engineer your potential into a powerful career. Our immersive digital programs deliver the exact tools you need to dominate the competitive tech landscape.
          </p>

          <div className="w-full pt-2 md:w-auto self-start">
            <Link to="/Advance" className="group flex w-full md:inline-flex items-center justify-center gap-3 rounded-full bg-[#f15b29] px-9 py-[18px] md:py-4 font-semibold text-white shadow-[0_20px_40px_rgba(241,91,41,0.28)] transition duration-300 hover:-translate-y-1 hover:brightness-110">
              <span className="text-[13px] md:text-[11px] font-bold uppercase tracking-[0.22em]">Explore Programs</span>
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid w-full max-w-[680px] grid-cols-3 gap-2 sm:gap-4 pt-2">
            <div className="rounded-[16px] md:rounded-[20px] border border-[#efe0d8] bg-white px-3 py-4 md:px-6 md:py-5 shadow-[0_12px_28px_rgba(17,24,39,0.04)] flex flex-col items-center justify-center text-center">
              <div className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#9ca3af]">Programs</div>
              <div className="mt-1 text-[22px] md:text-[32px] font-black leading-none text-[#111827]">8+</div>
            </div>
            <div className="rounded-[16px] md:rounded-[20px] border border-[#efe0d8] bg-white px-3 py-4 md:px-6 md:py-5 shadow-[0_12px_28px_rgba(17,24,39,0.04)] flex flex-col items-center justify-center text-center">
              <div className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#9ca3af]">Mentors</div>
              <div className="mt-1 text-[22px] md:text-[32px] font-black leading-none text-[#111827]">170+</div>
            </div>
            <div className="rounded-[16px] md:rounded-[20px] border border-[#efe0d8] bg-white px-3 py-4 md:px-6 md:py-5 shadow-[0_12px_28px_rgba(17,24,39,0.04)] flex flex-col items-center justify-center text-center">
              <div className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#9ca3af]">Hiring<br className="block md:hidden"/> Partners</div>
              <div className="mt-1 text-[22px] md:text-[32px] font-black leading-none text-[#111827]">250+</div>
            </div>
          </div>

        </div>

        {/* Right Image Area */}
        <div className="relative mx-auto w-full max-w-[620px] mt-8 lg:mt-0">
          <div className="absolute -inset-6 rounded-[44px] bg-[radial-gradient(circle_at_20%_15%,rgba(241,91,41,0.18),transparent_34%),radial-gradient(circle_at_80%_85%,rgba(59,130,246,0.12),transparent_30%)] blur-2xl pointer-events-none" />

          <div className="relative rounded-[32px] md:rounded-[38px] border border-white/80 bg-white/80 p-2 md:p-3 shadow-[0_24px_64px_rgba(17,24,39,0.14)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[24px] md:rounded-[28px] border border-[#e9ddd4] bg-[#fffdfb] p-2 md:p-3">
              <img
                src={heroImage}
                alt="Professionals collaborating in a modern learning environment"
                className="h-[380px] sm:h-[480px] md:h-[560px] w-full rounded-[16px] md:rounded-[22px] object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-4 right-4 sm:right-auto sm:left-6 sm:-bottom-6 sm:w-[320px] rounded-[22px] border border-[#efe0d8] bg-white px-5 py-4 shadow-[0_16px_36px_rgba(17,24,39,0.12)]">
              <div className="text-[14px] font-semibold text-[#111827]">Outcome Focused</div>
              <p className="mt-1 text-[14px] md:text-[15px] leading-[1.6] text-[#4b5563]">
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