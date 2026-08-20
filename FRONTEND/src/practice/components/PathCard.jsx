import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Database, Hash, Cpu, Globe, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import LevelBadge from './LevelBadge';
import cardBg from '../../assets/card_bg.png';
import bannerBg from '../../assets/futuristic_tech_bg.png';

const getPathIcon = (slug, color) => {
  if (slug?.includes('python')) return <Code2 size={24} className="text-white" />;
  if (slug?.includes('java') && !slug?.includes('javascript')) return <Cpu size={24} className="text-white" />;
  if (slug?.includes('javascript') || slug?.includes('js')) return <Globe size={24} className="text-white" />;
  if (slug?.includes('sql') || slug?.includes('data')) return <Database size={24} className="text-white" />;
  if (slug?.includes('cpp') || slug?.includes('c-plus')) return <Hash size={24} className="text-white" />;
  return <BookOpen size={24} className="text-white" />;
};

const PathCard = ({ path, progress, index }) => {
  const { title, slug, description, level, totalProblems, themeColor, gradientFrom } = path;

  // Enhance the color mapping to ensure vibrant gradients
  const colorMap = {
    '#4F46E5': 'from-indigo-500 to-purple-500',
    '#0EA5E9': 'from-sky-400 to-blue-600',
    '#10B981': 'from-emerald-400 to-teal-500',
    '#F59E0B': 'from-amber-400 to-orange-500',
    '#EF4444': 'from-rose-400 to-red-500',
  };
  
  const baseColor = gradientFrom || themeColor || '#4F46E5';
  const gradientClass = colorMap[baseColor] || 'from-indigo-500 to-purple-500';

  const solved = progress?.solved || 0;
  const percentage = progress?.percentage || 0;
  const isCompleted = percentage === 100;
  const isInProgress = percentage > 0 && percentage < 100;

  // Staggered animation delay
  const delay = index ? `${index * 100}ms` : '0ms';

  return (
    <article 
      className="group relative rounded-3xl p-[1px] flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] h-full animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: 'both' }}
    >
      {/* Animated Gradient Border Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Main Card Body */}
      <div className="relative bg-[#181920]/95 backdrop-blur-xl rounded-[23px] flex-1 flex flex-col overflow-hidden z-10 h-full">
        
        {/* Subtle overall card background image */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none group-hover:opacity-20 transition-opacity duration-500"
          style={{ backgroundImage: `url(${cardBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Top Banner Area with Image */}
        <div className="h-32 w-full relative overflow-hidden">
          {/* Banner Image */}
          <div 
            className="absolute inset-0 opacity-50 group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ backgroundImage: `url(${bannerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          {/* Vibrant Color Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} mix-blend-overlay opacity-80`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#181920]/95 to-transparent"></div>
          
          <div className="absolute top-4 right-4 z-10">
            <LevelBadge level={level} />
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-10 p-6 flex-1 flex flex-col relative z-10">
          <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 group-hover:from-white group-hover:to-white transition-all line-clamp-1 break-all">
            {title}
          </h3>
          
          <p className="text-sm text-slate-400 mb-8 line-clamp-2 leading-relaxed flex-1 break-all">
            {description}
          </p>

          {/* Footer Area */}
          <div className="mt-auto space-y-5">
            {/* Progress Bar Area */}
            <div className="bg-[#0f1115]/50 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Progress</span>
                <span className={`text-xs font-black ${isCompleted ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {percentage}%
                </span>
              </div>
              
              <div className="h-2 w-full bg-[#1e1f26] rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : `bg-gradient-to-r ${gradientClass}`}`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={14} className="text-slate-400" /> 
                  {solved} / {totalProblems} Solved
                </div>
                {isCompleted && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 size={12} /> Done</span>}
              </div>
            </div>

            {/* Action Button */}
            <Link
              to={`/practice/${slug}`}
              className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-[#2a2d36] border border-white/10 rounded-xl transition-colors duration-300 group-hover/btn:bg-[#343741]"></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`}></div>
              
              <span className="relative z-10 flex items-center gap-2">
                {isCompleted ? 'Review Path' : isInProgress ? 'Continue Path' : 'Start Path'}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PathCard;
