import React from 'react';
import { 
  Briefcase, 
  Users, 
  Code, 
  BookOpen, 
  Rocket, 
  Award,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const features = [
  { icon: Briefcase, title: "100% Placement Support" },
  { icon: Users, title: "1:1 Industry Mentorship" },
  { icon: Code, title: "Live Hands-on Experience" },
  { icon: BookOpen, title: "Project Based Learning" },
  { icon: Rocket, title: "Real-World Capstone Projects" },
  { icon: Award, title: "Elite Certification" },
  { icon: TrendingUp, title: "55% Avg. Salary Hike" },
  { icon: CheckCircle2, title: "15 Interview oppurtunities Guaranteed" },
];

const FeatureStrip = () => {
  // Duplicate features to create a seamless infinite loop
  const marqueeItems = [...features, ...features, ...features];

  return (
    <section className="w-full bg-[#FFFAF5] py-6 border-y border-gray-100 overflow-hidden relative">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 40s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="animate-marquee flex items-center">
        {marqueeItems.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 px-12 py-2 flex-shrink-0 border-r border-gray-200/60 transition-all duration-300 group"
          >
            <div className="flex-shrink-0 text-[#ff6b2d] group-hover:scale-110 transition-transform duration-300">
              <feature.icon size={22} strokeWidth={2} />
            </div>
            <p className="text-[#334155] font-black text-sm md:text-base tracking-tight whitespace-nowrap">
              {feature.title}
            </p>
          </div>
        ))}
      </div>

      {/* Gradient Fades for Smooth Transition */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FFFAF5] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FFFAF5] to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default FeatureStrip;
