import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import LevelBadge from '../components/LevelBadge';
import { CardSkeleton } from '../components/Skeleton';
import { 
  ChevronRight, ChevronDown, BookOpen, Target, 
  CheckCircle2, PlayCircle, Trophy, Layers, Clock, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

const PracticePathPage = () => {
  const { pathSlug } = useParams();
  const { practiceApi, isAuthenticated } = usePracticeAuth();
  const navigate = useNavigate();

  const [pathData, setPathData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState(new Set()); // For accordion/timeline

  const fetchPath = useCallback(async () => {
    try {
      const [pathRes, progressRes] = await Promise.all([
        practiceApi.get(`/practice/${pathSlug}`),
        isAuthenticated ? practiceApi.get(`/practice/${pathSlug}/progress`) : Promise.resolve({ data: { solvedCount: 0, totalQuestions: 0 } }),
      ]);
      setPathData(pathRes.data);
      setProgress(progressRes.data);
      
      // Auto-expand first topic
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
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <CardSkeleton count={3} />
          </div>
          <div className="space-y-4">
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!pathData) return null;

  const { path, topics } = pathData;
  const color = path.gradientFrom || path.themeColor || '#6366f1';
  
  const totalSolved = progress?.solved || 0;
  const totalQuestions = progress?.totalProblems || path.totalProblems || 0;
  const percentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
  const isCompleted = percentage === 100;

  const firstSubtopic = topics?.[0]?.subtopics?.[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans selection:bg-indigo-500/30 pb-20">
      
      {/* Breadcrumb Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Breadcrumb">
            <Link to="/practice" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              Practice
            </Link>
            <ChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">{path.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        {/* Subtle background glow */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[600px] opacity-[0.03] dark:opacity-[0.07] rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"
          style={{ backgroundColor: color }}
        />
        
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm"
                style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color }}
              >
                <Layers size={24} />
              </div>
              <LevelBadge level={path.level} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              {path.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-2xl break-words overflow-hidden">
              {path.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <BookOpen size={18} className="text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{path.totalProblems}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Problems</p>
                </div>
              </div>
              
              {path.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Clock size={18} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{path.estimatedDuration}</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Curriculum Column */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                Curriculum
                <span className="text-sm font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
                  {topics.length} Topics
                </span>
              </h2>
              
              <button 
                onClick={() => setExpandedTopics(new Set(expandedTopics.size === topics.length ? [] : topics.map(t => t._id)))}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
              >
                {expandedTopics.size === topics.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-4 bottom-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
              
              <div className="space-y-6">
                {topics.map((topic, topicIdx) => {
                  const isExpanded = expandedTopics.has(topic._id);
                  const subCount = topic.subtopics?.length || 0;
                  const qCount = topic.subtopics?.reduce((sum, sub) => sum + (sub.questionCount || 0), 0) || 0;
                  
                  return (
                    <div key={topic._id} className="relative z-10">
                      <div className="flex items-start gap-4 sm:gap-6">
                        
                        {/* Timeline Node */}
                        <div 
                          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-lg text-slate-400 hidden sm:flex shrink-0 transition-colors shadow-sm"
                          style={isExpanded ? { borderColor: color, color } : {}}
                        >
                          {topicIdx + 1}
                        </div>

                        {/* Topic Card */}
                        <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300">
                          
                          {/* Header Toggle */}
                          <button
                            onClick={() => toggleTopic(topic._id)}
                            className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="pr-4">
                              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1.5">
                                {topic.title}
                              </h3>
                              {topic.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 break-all">
                                  {topic.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-3 mt-4 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1"><Layers size={14}/> {subCount} Subtopics</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="flex items-center gap-1"><BookOpen size={14}/> {qCount} Questions</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isExpanded ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rotate-180' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                            >
                              <ChevronDown size={20} />
                            </div>
                          </button>

                          {/* Subtopics Expanded Content */}
                          {isExpanded && (
                            <div className="border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20">
                              {topic.subtopics?.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                  {topic.subtopics.map((sub) => (
                                    <div key={sub._id} className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                      <div className="flex-1">
                                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                                          {sub.title}
                                        </h4>
                                        {sub.description && (
                                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 break-all">
                                            {sub.description}
                                          </p>
                                        )}
                                      </div>
                                      
                                      <Link
                                        to={`/practice/${pathSlug}/${topic.slug}/${sub.slug}`}
                                        className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-all group"
                                      >
                                        View Set
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg text-xs font-black group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                          {sub.questionCount || 0} Qs
                                        </span>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-8 text-center text-slate-400 font-medium">
                                  No subtopics available in this module yet.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {topics.length === 0 && (
                <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Syllabus Coming Soon</h3>
                  <p className="text-slate-500 dark:text-slate-400">The curriculum for this path is currently being crafted.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Progress Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              
              {/* Your Journey Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
                
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
                  Your Journey
                </h3>

                {isAuthenticated ? (
                  <>
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{percentage}</span>
                        <span className="text-xl font-bold text-slate-400">%</span>
                      </div>
                      <div className="text-right text-sm font-bold text-slate-500">
                        <span style={{ color }}>{totalSolved}</span> / {totalQuestions} Solved
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden mb-8">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                      </div>
                    </div>

                    {isCompleted ? (
                      <div className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold border border-emerald-200 dark:border-emerald-500/20">
                        <Trophy size={18} />
                        Path Mastered!
                      </div>
                    ) : firstSubtopic ? (
                      <Link
                        to={`/practice/${pathSlug}/${topics[0].slug}/${firstSubtopic.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 group"
                        style={{ backgroundColor: color }}
                      >
                        <PlayCircle size={18} />
                        {totalSolved > 0 ? 'Continue Practicing' : 'Start Practicing'}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                      Sign in to track your progress, earn achievements, and save your solutions.
                    </p>
                    <Link
                      to="/practice/login"
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white bg-slate-900 dark:bg-white dark:text-slate-900 font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Sign in to Start
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PracticePathPage;
