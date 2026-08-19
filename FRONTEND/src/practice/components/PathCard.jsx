import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Database, Hash, Cpu, Globe, ArrowRight, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import LevelBadge from './LevelBadge';
import ProgressBar from './ProgressBar';

// Icon map by path slug or keywords
const getPathIcon = (slug, color) => {
  if (slug?.includes('python')) return <Code2 size={24} style={{ color }} />;
  if (slug?.includes('java') && !slug?.includes('javascript')) return <Cpu size={24} style={{ color }} />;
  if (slug?.includes('javascript') || slug?.includes('js')) return <Globe size={24} style={{ color }} />;
  if (slug?.includes('sql') || slug?.includes('data')) return <Database size={24} style={{ color }} />;
  if (slug?.includes('cpp') || slug?.includes('c-plus')) return <Hash size={24} style={{ color }} />;
  return <BookOpen size={24} style={{ color }} />;
};

const PathCard = ({ path, progress, index = 0 }) => {
  const { _id, title, slug, description, level, totalProblems, estimatedDuration, themeColor, gradientFrom, gradientTo } = path;

  const color = gradientFrom || themeColor || '#6366f1';
  const solved = progress?.solved || 0;
  const percentage = progress?.percentage || 0;
  const isCompleted = percentage === 100;

  // Bento Box Sizing Pattern
  const bentoPatterns = [
    'md:col-span-2 md:row-span-2', // 0: Large Square
    'md:col-span-1 md:row-span-1', // 1: Small
    'md:col-span-1 md:row-span-1', // 2: Small
    'md:col-span-2 md:row-span-1', // 3: Wide
    'md:col-span-1 md:row-span-2', // 4: Tall
    'md:col-span-1 md:row-span-1', // 5: Small
    'md:col-span-2 md:row-span-1', // 6: Wide
    'md:col-span-1 md:row-span-1', // 7: Small
  ];
  
  const bentoClass = bentoPatterns[index % bentoPatterns.length];
  const isLarge = bentoClass.includes('col-span-2') && bentoClass.includes('row-span-2');
  const isWide = bentoClass.includes('col-span-2') && !bentoClass.includes('row-span-2');
  const isTall = !bentoClass.includes('col-span-2') && bentoClass.includes('row-span-2');

  return (
    <article className={`group relative bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[32px] border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full z-10 ${bentoClass}`}>
      
      {/* Animated glowing border effect on hover */}
      <div className="absolute -inset-[2px] bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[34px] -z-10" style={{ backgroundImage: `linear-gradient(135deg, ${gradientFrom || color}, ${gradientTo || color}, transparent, ${color})` }}></div>
      <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 rounded-[32px] -z-10 backdrop-blur-xl"></div>
      
      {/* Abstract background blobs for Bento aesthetic */}
      <div className={`absolute -right-20 -top-20 opacity-20 dark:opacity-10 blur-3xl rounded-full transition-transform duration-1000 group-hover:scale-150 ${isLarge ? 'w-96 h-96' : 'w-48 h-48'}`} style={{ backgroundColor: color }}></div>
      {isLarge && <div className="absolute -left-20 -bottom-20 w-80 h-80 opacity-10 dark:opacity-5 blur-3xl rounded-full transition-transform duration-1000 group-hover:scale-150" style={{ backgroundColor: gradientTo || color }}></div>}

      <div className={`p-6 flex-1 flex flex-col relative z-20 ${isLarge ? 'sm:p-10' : 'sm:p-7'}`}>
        {/* Header: Icon & Badges */}
        <div className={`flex items-start justify-between mb-6 gap-4 ${isWide && !isLarge ? 'flex-row items-center' : ''}`}>
          <div 
            className={`${isLarge ? 'w-20 h-20' : 'w-14 h-14'} rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 relative`}
            style={{ 
              background: `linear-gradient(135deg, ${color}20, ${color}05)`,
              border: `1px solid ${color}40`
            }}
          >
            {getPathIcon(slug, color)}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10" style={{ backgroundColor: color }}></div>
          </div>
          
          <div className={`flex flex-col gap-2 ${isWide && !isLarge ? 'items-end' : 'items-end'}`}>
            <LevelBadge level={level} />
            {isLarge && (
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg tracking-widest border border-slate-200/50 dark:border-slate-700/50">
                <BookOpen size={12} className="text-slate-400" />
                {totalProblems} Questions
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className={`${isWide && !isLarge ? 'grid grid-cols-2 gap-6 flex-1' : 'flex-1 flex flex-col'}`}>
          <div>
            <h3 className={`font-black text-slate-900 dark:text-white leading-tight mb-3 transition-colors duration-300 ${isLarge ? 'text-4xl' : 'text-2xl'}`} style={{ '--hover-color': color }}>
              <span className="group-hover:text-[var(--hover-color)] transition-colors">{title}</span>
            </h3>
            
            <p className={`text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 break-words break-all ${isLarge ? 'text-base line-clamp-3' : 'line-clamp-2'}`}>
              {description}
            </p>
          </div>

          {/* Footer Area: Progress or CTA info */}
          <div className="mt-auto flex flex-col justify-end">
            {solved > 0 ? (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  <span>Progress</span>
                  <span style={{ color }}>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner relative">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${gradientFrom || color}, ${gradientTo || color})` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">
                {!isLarge && (
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    <BookOpen size={12} /> {totalProblems} Qs
                  </span>
                )}
                {estimatedDuration && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    {estimatedDuration}
                  </span>
                )}
              </div>
            )}

            {/* Action Button */}
            <Link
              to={`/practice/${slug}`}
              className={`w-full flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 ${isLarge ? 'py-4 text-base' : 'py-3.5'} ${
                isCompleted 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md group-hover:shadow-xl group-hover:-translate-y-1'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={isLarge ? 20 : 18} />
                  Completed
                </>
              ) : solved > 0 ? (
                <>
                  Continue
                  <ArrowRight size={isLarge ? 18 : 16} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              ) : (
                <>
                  Start
                  <ArrowRight size={isLarge ? 18 : 16} className="group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PathCard;
