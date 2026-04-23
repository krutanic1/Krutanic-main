import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviewsValue = [
  {
    name: "Raja Singh",
    role: "Stock Market Analyst",
    experience: "4 Years",
    rating: 5,
    quote: "Recently completed the stock market course and found it exceptionally informative and beneficial. The mentorship and training made a significant positive impact on my learning journey.",
    image: "https://i.pravatar.cc/150?u=raja"
  },
  {
    name: "Birendra Kumar",
    role: "Data Science Associate",
    experience: "10 Years",
    rating: 5,
    quote: "I completed my internship in stock market and also pursued more courses here. Great mentorship. The practical approach to complex concepts is what sets Krutanic apart.",
    image: "https://i.pravatar.cc/150?u=birendra"
  },
  {
    name: "Mithun Prajapati",
    role: "Full Stack Developer",
    experience: "2 Years",
    rating: 5,
    quote: "Successfully completed my full stack web development internship at Krutanic. Sessions were interactive and highly engaging with excellent mentor support. Truly career-transforming.",
    image: "https://i.pravatar.cc/150?u=mithun"
  }
];

const ReviewCards = () => {
  return (
    <section className="bg-[#fffcf9] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-orange-600 font-black text-xs uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full mb-6 inline-block">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              What Our <span className="text-orange-600">Learners Have To Say</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-3xl shadow-sm border border-orange-100">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill="#ff6b2d" className="text-orange-600" />
              ))}
            </div>
            <span className="font-bold text-slate-900">4.9/5</span>
            <span className="text-slate-400 font-medium">from 8,000+ Students</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviewsValue.map((review, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-[40px] p-10 shadow-[0_15px_50px_-15px_rgba(255,107,45,0.08)] border border-slate-100 hover:shadow-[0_30px_70px_-10px_rgba(255,107,45,0.15)] transition-all duration-500 hover:-translate-y-3"
            >
              <div className="absolute top-10 right-10 text-orange-600/10 group-hover:text-orange-600/20 transition-colors">
                <Quote size={80} className="opacity-10 group-hover:opacity-20 transition-opacity" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#ff6b2d" className="text-orange-600" />
                ))}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-10 italic relative z-10">
                "{review.quote}"
              </p>

              <div className="flex items-center gap-5 pt-8 border-t border-slate-50">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-16 h-16 rounded-2xl object-cover relative z-10 border-2 border-white shadow-xl"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">{review.name}</h4>
                  <p className="text-orange-600 font-bold text-sm">{review.role}</p>
                  <p className="text-slate-400 text-[11px] font-bold tracking-widest uppercase mt-1">{review.experience} Exp</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewCards;
