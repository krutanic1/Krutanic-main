import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { CardSkeleton } from '../components/Skeleton';
import { 
  ChevronDown, BookOpen, Clock, Users, Play, Trophy, ChevronRight, CheckCircle2, Lock, Star, Flag, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import certificateBg from '../../assets/card_bg.png'; // Fallback if needed
import heroBg from '../../assets/path_hero_bg.jpg';

const PracticePathPage = () => {
  const { pathSlug } = useParams();
  const { practiceApi, isAuthenticated } = usePracticeAuth();
  const navigate = useNavigate();

  const [pathData, setPathData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  const fetchPath = useCallback(async () => {
    try {
      const [pathRes, progressRes] = await Promise.all([
        practiceApi.get(`/practice/${pathSlug}`),
        isAuthenticated ? practiceApi.get(`/practice/${pathSlug}/progress`) : Promise.resolve({ data: { solvedCount: 0, totalQuestions: 0 } }),
      ]);
      setPathData(pathRes.data);
      setProgress(progressRes.data);
      
      if (pathRes.data.topics?.length > 0) {
        setExpandedTopics(new Set([pathRes.data.topics[0]._id]));
      }
    } catch (err) {
      toast.error('Failed to load practice path.');
      navigate('/practice');
    } finally {
      setLoading(false);
    }
  }, [pathSlug, practiceApi, navigate, isAuthenticated]);

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) newSet.delete(topicId);
      else newSet.add(topicId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1d22] p-8">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="h-64 bg-[#25262c] rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-24 bg-[#25262c] rounded-xl animate-pulse" />
              <div className="h-24 bg-[#25262c] rounded-xl animate-pulse" />
            </div>
            <div className="h-80 bg-[#25262c] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!pathData) return null;

  const { path, topics } = pathData;
  const totalSolved = progress?.solved || 0;
  const totalQuestions = progress?.totalProblems || path.totalProblems || 0;
  const percentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
  
  // Base color logic for gradients (fallback to CodeChef blue style)
  const baseColorClass = 'from-[#1e58c8] to-[#14429e]'; 
  const firstSubtopic = topics?.[0]?.subtopics?.[0];

  return (
    <div className="min-h-screen bg-[#191919] font-sans text-slate-200 selection:bg-blue-500/30 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Hero Card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${baseColorClass} p-8 mb-8 shadow-2xl border border-white/10`}>
          {/* Subtle Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay bg-center bg-cover"
            style={{ backgroundImage: `url(${heroBg})` }}
          ></div>
          
          <div className="relative z-10">
            {/* Top Right Badges */}
            <div className="absolute top-0 right-0 flex gap-3 hidden sm:flex">
              <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Trophy size={12} /> Certification Available
              </div>
              <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                <Star size={12} className="fill-yellow-500 text-yellow-500" /> 4.8 (12k+)
              </div>
            </div>

            {/* Icon and Title */}
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                <BookOpen size={32} className="text-white" />
              </div>
              <div className="mt-1 flex-1 overflow-hidden">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight truncate">Practice {path.title}</h1>
                <p className="text-blue-100 text-sm max-w-2xl leading-relaxed font-medium break-words line-clamp-3">
                  {path.description || `Solve ${path.title} Practice problems online with the Practice ${path.title} path on Krutanic. Answer MCQs exercises and write code for over ${path.totalProblems} coding challenges.`}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-blue-100 mb-10">
              <div className="flex items-center gap-2"><BookOpen size={16} /> {topics.length} Lessons</div>
              <div className="flex items-center gap-2"><Clock size={16} /> {path.estimatedDuration || '15 Hours'}</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} /> {path.totalProblems} Problems</div>
              <div className="flex items-center gap-2"><Users size={16} /> 6000+ Learners</div>
              <div className="flex items-center gap-2"><Zap size={16} /> {path.level} Level</div>
            </div>

            {/* Progress & Start Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10 pt-6">
              <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-bold text-sm">Your Progress:</span>
                  <span className={`${percentage === 100 ? 'text-emerald-400' : 'text-emerald-400'} font-bold text-sm flex items-center gap-1`}>
                    {percentage}% Completed
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${percentage}%` }}
                  >
                     <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
                  </div>
                </div>
              </div>
              
              {isAuthenticated ? (
                firstSubtopic ? (
                  <Link
                    to={`/practice/${pathSlug}/${topics[0].slug}/${firstSubtopic.slug}`}
                    className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                  >
                    {totalSolved > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                ) : null
              ) : (
                <Link
                  to="/practice/login"
                  className="shrink-0 bg-white text-blue-900 px-8 py-3 rounded-xl font-bold transition-colors hover:bg-slate-100 shadow-lg flex items-center gap-2"
                >
                  <Lock size={18} /> Sign in to Start
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Curriculum List */}
          <div className="lg:col-span-8 space-y-4">
            {topics.map((topic, index) => {
              const isExpanded = expandedTopics.has(topic._id);
              
              return (
                <div key={topic._id} className="bg-[#24252a] rounded-xl border border-white/5 overflow-hidden transition-all shadow-sm">
                  
                  {/* Topic Header */}
                  <button 
                    onClick={() => toggleTopic(topic._id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-[#2a2b31] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-full bg-[#191919] flex items-center justify-center font-bold text-slate-300 text-lg shadow-inner border border-white/5">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium">
                          Practice problems using {path.title} related to {topic.title.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-500 p-2 group-hover:text-slate-300 transition-colors">
                      <ChevronDown size={20} className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Subtopics List */}
                  {isExpanded && (
                    <div className="bg-[#1e1e24] border-t border-white/5">
                      {topic.subtopics?.length > 0 ? (
                        <>
                          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-8">Problem Name</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-center">Difficulty</div>
                          </div>
                          <div className="divide-y divide-white/5">
                            {topic.subtopics.map((sub) => (
                              <Link 
                                to={`/practice/${pathSlug}/${topic.slug}/${sub.slug}`}
                                key={sub._id} 
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#25262c] transition-colors group"
                              >
                                <div className="col-span-8">
                                  <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors line-clamp-1">
                                    {sub.title}
                                  </span>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                  {/* Mock Status Circle */}
                                  <div className="w-4 h-4 rounded-full bg-white/10 border border-white/20"></div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                    Easy
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center text-slate-500 text-sm font-medium">
                          No practice sets available yet.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Certificate Card */}
            <div className="bg-[#24252a] rounded-xl border border-white/5 p-6 shadow-sm">
              <div className="bg-white rounded-lg p-6 mb-5 shadow-inner border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="text-amber-600" size={24} />
                </div>
                <h4 className="text-slate-900 font-bold text-sm mb-4">Certificate on Completion</h4>
                <div className="flex items-center justify-between w-full opacity-40">
                  <div className="h-6 w-16 bg-slate-200 rounded script-font"></div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-12 bg-slate-200 rounded"></div>
                    <div className="h-1.5 w-12 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-slate-200 rounded script-font"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-white font-bold text-sm">Certification available</h4>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Included in premium</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                On Completing all the lessons in this course, you'll get a course completion certificate
              </p>
            </div>

            {/* Prerequisite Card */}
            <div className="bg-[#24252a] rounded-xl border border-white/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold text-sm">
                <Lock size={16} /> Prerequisite course
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6">
                We recommend you complete this course first before you jump into Practice {path.title}, this will help you understand this even better.
              </p>
              
              <div className="bg-[#1e1e24] border border-white/5 rounded-lg p-4 flex gap-4 hover:bg-[#2a2b31] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/30">
                  <BookOpen size={20} className="text-blue-400" />
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Learn {path.title}</h5>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-yellow-500"><Star size={10} className="fill-yellow-500"/> 4.7 (31.2k+)</span>
                    <span>Beginner</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePathPage;
