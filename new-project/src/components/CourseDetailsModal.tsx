import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, BookOpen, ChevronRight, CheckCircle2, Trophy, ArrowRight, Layout, Code2, Layers, Circle, Target, BookMarked } from 'lucide-react';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

const WeekSection = ({ week, index, isExpanded, onToggle }: { week: any, index: number, isExpanded: boolean, onToggle: () => void }) => {
  return (
    <div className="mb-4 last:mb-0">
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-5 border transition-all rounded-none ${isExpanded ? 'bg-surface-container-low border-outline-variant/30 shadow-sm' : 'bg-surface border-outline-variant/10 hover:border-outline-variant/30'}`}
      >
        <div className="flex items-center gap-4 text-left">
          <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm ${isExpanded ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
            {index + 1}
          </div>
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest mb-0.5 block">Module 0{index + 1}</span>
            <h3 className="text-base font-bold text-primary">{week.weekTitle}</h3>
          </div>
        </div>
        <motion.div
           animate={{ rotate: isExpanded ? 90 : 0 }}
           className="text-outline"
        >
          <ChevronRight size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-5 space-y-3 mt-3 ml-5 border-l border-outline-variant/20">
              {week.days.map((day: any, dIdx: number) => (
                <div 
                  key={dIdx} 
                  className={`p-5 border ${day.isSunday ? 'border-primary/20 bg-primary/5' : 'border-outline-variant/10 bg-surface'} relative`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider ${day.isSunday ? 'text-primary bg-surface border-primary/20' : 'text-on-surface-variant bg-surface-container-low border-outline-variant/20'}`}>
                      {day.isSunday ? 'Assessment' : day.dayName.split(' ')[0]}
                    </span>
                    <h4 className={`text-sm font-bold tracking-tight text-primary`}>
                      {day.topic}
                    </h4>
                  </div>
                  
                  <div className="text-sm text-on-surface-variant leading-relaxed font-normal">
                    {day.learning}
                  </div>
                  
                  {day.projectBadge && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Target size={14} className="text-primary" />
                      <span>{day.projectBadge}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CourseDetailsModal({ isOpen, onClose, course }: CourseDetailsModalProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  if (!course) return null;

  const curriculum = course.curriculum || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-6 lg:p-12 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-5xl h-full md:h-[85vh] bg-surface overflow-hidden flex flex-col editorial-shadow shadow-2xl shadow-black/20"
          >
            {/* Professional Header */}
            <div className="px-8 py-6 flex justify-between items-center bg-surface border-b border-outline-variant/10 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary flex items-center justify-center text-white">
                  <BookMarked size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-primary tracking-tight leading-none mb-1">{course.title}</h2>
                   <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">{course.tag || 'Institutional Course Library'}</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-outline hover:bg-surface-container-low hover:text-primary transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar bg-surface">
              <div className="container mx-auto px-8 py-10 lg:px-12 max-w-4xl">
                
                {/* Description & Metadata */}
                <div className="mb-12">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="h-0.5 w-6 bg-primary" />
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest">About this Course</span>
                   </div>
                   <p className="text-sm md:text-base text-on-surface-variant leading-relaxed mb-8 max-w-3xl">
                      {course.description}
                   </p>
                   
                   <div className="flex flex-wrap gap-8 py-6 px-8 bg-surface-container-low border border-outline-variant/10">
                      <div className="flex items-center gap-3">
                         <Clock className="text-outline" size={16} />
                         <div>
                            <span className="block text-[10px] font-bold text-outline uppercase tracking-[0.1em]">Duration</span>
                            <span className="text-xs font-bold text-primary tracking-tight">14 Days Plan</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 border-l border-outline-variant/20 pl-8">
                         <Layout className="text-outline" size={16} />
                         <div>
                            <span className="block text-[10px] font-bold text-outline uppercase tracking-[0.1em]">Sessions</span>
                            <span className="text-xs font-bold text-primary tracking-tight">14 Daily Modules</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 border-l border-outline-variant/20 pl-8">
                         <CheckCircle2 className="text-metallic-green" size={16} />
                         <div>
                            <span className="block text-[10px] font-bold text-outline uppercase tracking-[0.1em]">Certification</span>
                            <span className="text-xs font-bold text-primary tracking-tight">Included</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Section Title */}
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] whitespace-nowrap">Program Curriculum</h3>
                  <div className="h-px flex-grow ml-8 bg-outline-variant/10" />
                </div>

                {/* Curriculum Rendering */}
                {curriculum.length > 0 ? (
                  <div className="space-y-2">
                    {curriculum.map((week: any, idx: number) => (
                      <WeekSection 
                        key={idx} 
                        week={week} 
                        index={idx} 
                        isExpanded={expandedWeek === idx}
                        onToggle={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center bg-surface-container-low border border-dashed border-outline-variant/20">
                    <Layers className="mx-auto text-outline mb-4" size={48} />
                    <h3 className="text-primary font-bold mb-2">Curriculum under review</h3>
                    <p className="text-outline text-xs">The latest academic roadmap for this course is being compiled.</p>
                  </div>
                )}
                
                {/* Enrollment Teaser */}
                <div className="mt-16 p-8 bg-primary text-center text-white relative flex flex-col items-center">
                    <div className="relative z-10 w-full">
                        <h3 className="text-lg font-bold mb-2 text-white">Take the next step in your professional journey</h3>
                        <p className="text-white/60 text-xs mb-8">Enroll today to get full access to course materials and alumni network.</p>
                        <button 
                          onClick={onClose}
                          className="px-10 py-3.5 bg-white text-primary hover:bg-surface-container-low font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
                        >
                          Enroll in this Course
                        </button>
                    </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 bg-surface border-t border-outline-variant/10 flex justify-center sticky bottom-0 z-20 md:hidden">
               <button 
                  onClick={onClose}
                  className="w-full py-4 bg-surface-container-low border border-outline-variant/20 text-primary text-xs font-bold tracking-widest uppercase active:scale-95"
               >
                  Close Roadmap
               </button>
            </div>
          </motion.div>
          
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #f1f5f9;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #e2e8f0;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
