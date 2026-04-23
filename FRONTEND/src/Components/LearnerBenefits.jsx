import React from 'react';
import { Star, Headphones, Compass, Award, Users, Rocket, Trophy } from 'lucide-react';

const benefitData = [
  {
    title: "World Class Pedagogy",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400",
    badges: [
      { text: "4.8/5 Rating", icon: Star },
      { text: "Gamified Learning", icon: Trophy }
    ],
    points: [
      "Learn from the World's Best Faculty & Industry Experts",
      "Learn with fun Hands-on Exercises & Assignments",
      "Participate in Hackathons & Group Activities"
    ]
  },
  {
    title: "24 x 7 Support",
    image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800",
    badges: [
      { text: "24 x 7 Support", icon: Headphones },
      { text: "1:1 Mentorship", icon: Users }
    ],
    points: [
      "Dedicated Learning Managers",
      "24*7 learning support for all your technical queries",
      "Network with Peers & Interact with Industry Leaders"
    ]
  },
  {
    title: "Career Assistance",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&q=80&w=800",
    badges: [
      { text: "22,000+ Career Transitions", icon: Rocket }
    ],
    points: [
      "Resume Building & Mock Interview Prep",
      "Exclusive access to Krutanic Job Portal",
      "250+ Hiring Partners across the globe"
    ]
  }
];

const LearnerBenefits = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[2.5rem] md:text-[4rem] font-black text-slate-900 tracking-tight leading-tight">
            Learner <span className="text-orange-600">Benefits</span>
          </h2>
          <div className="w-24 h-2 bg-orange-600 rounded-full mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefitData.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(255,107,45,0.08)] transition-all duration-500 hover:-translate-y-3 group"
            >
              {/* Image Header */}
              <div className="p-8 pb-0">
                <div className="relative h-64 rounded-[32px] overflow-hidden">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Content */}
              <div className="p-10">
                <h3 className="text-[1.75rem] font-black text-slate-900 mb-6 group-hover:text-orange-600 transition-colors">
                  {benefit.title}
                </h3>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {benefit.badges.map((badge, i) => {
                    const Icon = badge.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 bg-orange-50/50 border border-orange-100 px-4 py-2 rounded-2xl">
                        <Icon size={14} className="text-orange-600" />
                        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">{badge.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Points */}
                <ul className="space-y-5">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-4 group/item">
                      <div className="w-2 h-2 rounded-full bg-orange-600 mt-2.5 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                      <p className="text-slate-600 text-base font-medium leading-relaxed">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnerBenefits;
