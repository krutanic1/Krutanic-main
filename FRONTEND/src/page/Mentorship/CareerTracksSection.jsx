import React, { useState, useEffect } from 'react';
import { FaLaptopCode, FaUserTie, FaProjectDiagram, FaBuilding, FaUsers, FaInfinity, FaCheckCircle, FaCode } from 'react-icons/fa';

const storySteps = [
  {
    id: '01',
    label: 'STRUCTURED LEARNING',
    title: 'AI-first structured curriculum / role-based learning path',
    desc: 'Our curriculum is continuously updated. We don\'t teach isolated skills; we teach you how to function in a specific role. From day one, your path is aligned with the exact requirements of top tech companies.',
    icon: <FaLaptopCode />,
  },
  {
    id: '02',
    label: 'EXPERT GUIDANCE',
    title: 'Mentor guidance while building real work',
    desc: 'Get unblocked instantly. Our mentors are practitioners from FAANG and top product companies. They review your code, refine your architecture, and guide your career decisions through 1:1 sessions.',
    icon: <FaUserTie />,
  },
  {
    id: '03',
    label: 'PRACTICAL EXECUTION',
    title: 'Projects, labs, and evaluated practice',
    desc: 'Theory doesn\'t get you hired. You will build production-ready systems, debug live environments, and deploy scalable applications that you can proudly showcase in your portfolio.',
    icon: <FaProjectDiagram />,
  },
  {
    id: '04',
    label: 'CAREER SIMULATION',
    title: 'Platform built to simulate real hiring/work environment',
    desc: 'Experience what it’s actually like to work in a tech team. We simulate agile sprints, PR reviews, system design rounds, and behavioral interviews so you are never caught off guard.',
    icon: <FaBuilding />,
  },
  {
    id: '05',
    label: 'THE ECOSYSTEM',
    title: 'Community, accountability, and career support',
    desc: 'You are not alone. Join a tight-knit community of ambitious peers. Our dedicated placement team works with you on resume building, LinkedIn optimization, and interview scheduling.',
    icon: <FaUsers />,
  },
  {
    id: '06',
    label: 'BEYOND PLACEMENT',
    title: 'Lifelong access and continuous learning',
    desc: 'Technology moves fast. Your access to the Krutanic community and curriculum updates remains active even after you land your job, ensuring you never fall behind the curve.',
    icon: <FaInfinity />,
  }
];

// Reusable Visual Components for the sticky panel
const VisualImage = ({ isActive, src, alt }) => (
  <div className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center ${isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[0.98] z-0 pointer-events-none'}`}>
    <div className="w-full h-full rounded-[2.5rem] p-2 border border-slate-200/50 shadow-2xl bg-white relative overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-[2rem]" />
      <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/10 pointer-events-none"></div>
    </div>
  </div>
);

const VisualOne = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" alt="Structured Learning" />;
const VisualTwo = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" alt="Expert Guidance" />;
const VisualThree = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" alt="Practical Execution" />;
const VisualFour = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" alt="Career Simulation" />;
const VisualFive = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200" alt="Community Ecosystem" />;
const VisualSix = ({ isActive }) => <VisualImage isActive={isActive} src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" alt="Beyond Placement" />;


const CareerTracksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Use Intersection Observer to detect which step is currently in the middle of the viewport
  useEffect(() => {
    const stepElements = document.querySelectorAll('.story-step-item');
    
    if (stepElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.index));
          }
        });
      },
      {
        // Trigger when the element crosses the middle 40% of the viewport height
        rootMargin: "-40% 0px -40% 0px", 
        threshold: 0
      }
    );

    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="bg-slate-50 py-24 md:py-32 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Intro Section */}
        <div className="max-w-3xl mb-16 md:mb-24">

          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            This isn’t just course content.<br className="hidden md:block"/>
            <span className="text-slate-400 font-medium"> It’s a system built for real career momentum.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Designed for learners with ambition and limited time. Mentorship, projects, accountability, and evaluated practice are built in so progress turns into outcomes.
          </p>
        </div>

        {/* Scroll Storytelling Wrapper */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
          
          {/* LEFT: Sticky Visual Panel */}
          <div className="hidden lg:block lg:w-5/12 relative">
            {/* The sticky container */}
            <div className="sticky top-32 h-[calc(100vh-16rem)] min-h-[500px] max-h-[600px] w-full flex items-center justify-center">
              <VisualOne isActive={activeStep === 0} />
              <VisualTwo isActive={activeStep === 1} />
              <VisualThree isActive={activeStep === 2} />
              <VisualFour isActive={activeStep === 3} />
              <VisualFive isActive={activeStep === 4} />
              <VisualSix isActive={activeStep === 5} />
            </div>
          </div>

          {/* RIGHT: Scrollable Steps */}
          <div className="w-full lg:w-7/12 flex flex-col relative pb-[30vh]">
            {/* A vertical tracking line for desktop */}
            <div className="hidden lg:block absolute left-[31px] top-0 bottom-0 w-px bg-slate-200 z-0"></div>

            {storySteps.map((step, idx) => (
              <div 
                key={idx}
                data-index={idx}
                className={`story-step-item relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 py-8 md:py-16 transition-all duration-700 ease-out ${activeStep === idx ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98]'}`}
              >
                {/* Step Marker */}
                <div className="shrink-0 flex items-start justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-700 
                    ${activeStep === idx 
                      ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] scale-110 border border-blue-400' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    {step.id}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-3">
                  <div className={`text-xs font-bold tracking-widest uppercase mb-4 transition-colors duration-500 ${activeStep === idx ? 'text-blue-600' : 'text-slate-400'}`}>
                    {step.label}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                  
                  {/* Mobile-only visual fallback */}
                  <div className="block lg:hidden mt-10 h-64 sm:h-80 w-full relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    {idx === 0 && <VisualOne isActive={true} />}
                    {idx === 1 && <VisualTwo isActive={true} />}
                    {idx === 2 && <VisualThree isActive={true} />}
                    {idx === 3 && <VisualFour isActive={true} />}
                    {idx === 4 && <VisualFive isActive={true} />}
                    {idx === 5 && <VisualSix isActive={true} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CareerTracksSection;
