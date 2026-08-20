import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import PathCard from '../components/PathCard';
import { PathCardSkeleton } from '../components/Skeleton';
import PracticeLayout from '../components/PracticeLayout';
import { 
  Search, BookOpen, Flame, Target, Trophy, 
  ChevronRight, ListFilter, TrendingUp, Sparkles, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import heroBg from '../../assets/futuristic_tech_bg.png';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORTS = ['Most popular', 'Recently updated'];

const PracticeLanding = () => {
  const { practiceUser, practiceApi, isAuthenticated } = usePracticeAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.hash || '#dashboard';

  const [paths, setPaths] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('Most popular');

  const fetchPaths = useCallback(async () => {
    try {
      setLoading(true);
      const res = await practiceApi.get('/practice');
      const fetchedPaths = res.data.paths || [];
      setPaths(fetchedPaths);

      if (isAuthenticated && fetchedPaths.length > 0) {
        const progressPromises = fetchedPaths.map((p) =>
          practiceApi.get(`/practice/${p.slug}/progress`).then((r) => ({ slug: p.slug, ...r.data })).catch(() => null)
        );
        const results = await Promise.all(progressPromises);
        const map = {};
        results.forEach((r) => { if (r) map[r.slug] = r; });
        setProgressMap(map);
      }
    } catch (err) {
      toast.error('Failed to load practice paths.');
    } finally {
      setLoading(false);
    }
  }, [practiceApi, isAuthenticated]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const filteredPaths = useMemo(() => paths.filter((p) => {
    const levelMatch = selectedLevel === 'All' || p.level === selectedLevel;
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return levelMatch && searchMatch;
  }), [paths, selectedLevel, search]);

  const totalSolved = useMemo(() => Object.values(progressMap).reduce((sum, p) => sum + (p.solved || 0), 0), [progressMap]);
  const totalProblems = useMemo(() => paths.reduce((sum, p) => sum + (p.totalProblems || 0), 0), [paths]);
  const progressPercent = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Active path logic
  const activePath = useMemo(() => {
    if (!isAuthenticated) return null;
    const activeSlugs = Object.keys(progressMap).filter(slug => progressMap[slug].solved > 0);
    if (activeSlugs.length === 0) return paths.length > 0 ? paths[0] : null; // Fallback to first path if none started
    const sorted = activeSlugs.sort((a, b) => progressMap[b].solved - progressMap[a].solved);
    return paths.find(p => p.slug === sorted[0]);
  }, [progressMap, paths, isAuthenticated]);

  const activePathProgress = activePath && progressMap[activePath.slug] 
    ? Math.round((progressMap[activePath.slug].solved / activePath.totalProblems) * 100) 
    : 0;
  
  const activePathCompleted = activePathProgress === 100;
  const activePathSolved = activePath ? (progressMap[activePath.slug]?.solved || 0) : 0;

  return (
    <PracticeLayout>
      <div className="space-y-8 pb-10">
        
          {/* Main Dashboard Overview */}
        {currentTab === '#dashboard' && (
          <>
            {/* Welcome Hero Section */}
            <div 
              className="bg-[#1e1f26] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
            >
              {/* Background Image Overlay */}
              <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
                style={{
                  backgroundImage: `url(${heroBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1e1f26] via-[#1e1f26]/80 to-transparent pointer-events-none"></div>
              
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-60 z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                  Welcome back, {isAuthenticated ? practiceUser?.name?.split(' ')[0] : 'Developer'} <span className="inline-block animate-wave">👋</span>
                </h2>
                <p className="text-slate-300 font-medium max-w-xl text-sm sm:text-base leading-relaxed">
                  Ready to push your limits? Dive into immersive challenges, conquer new technologies, and accelerate your coding mastery.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                {isAuthenticated && (
                  <div className="bg-[#2a2d36] border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 min-w-[200px]">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Daily Goal</p>
                      <p className="text-sm font-bold text-white">2 of 3 problems</p>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    if (activePath) navigate(`/practice/${activePath.slug}`);
                    else navigate('/practice#paths');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  Continue Practice <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Statistics Row - Premium Glass Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Problems Solved', value: totalSolved, icon: CheckCircle2, color: 'indigo' },
                { label: 'Active Paths', value: Object.keys(progressMap).filter(k => progressMap[k].solved > 0 && progressMap[k].solved < paths.find(p => p.slug === k)?.totalProblems).length || 1, icon: BookOpen, color: 'sky' },
                { label: 'Current Streak', value: '0 days', icon: Flame, color: 'orange' },
                { label: 'Overall Progress', value: `${progressPercent}%`, icon: TrendingUp, color: 'emerald' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                const colors = {
                  indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
                  sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:border-sky-500/50 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]',
                  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
                  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(10,185,129,0.15)]',
                };
                
                return (
                  <div key={i} className="group relative bg-[#1e1f26]/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    {/* Background Image Layer */}
                    <div 
                      className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-${stat.color}-500 to-transparent`}></div>
                    
                    <div className="relative z-10 flex flex-col gap-2">
                      <div>
                        <p className="text-3xl font-black text-white tracking-tight drop-shadow-md">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-2">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resume Learning Card - High-Tech Module */}
            {activePath && (
              <div className="relative rounded-3xl p-[1px] group overflow-hidden mt-2">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 opacity-40 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-xy"></div>
                
                <div className="relative bg-[#181920] rounded-[23px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 overflow-hidden h-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  {/* Futuristic Background Accents */}
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#181920]/80 to-[#181920] opacity-80 z-0"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-50 group-hover:bg-purple-600/20 transition-all duration-700 z-0"></div>
                  
                  <div className="flex-1 text-center md:text-left z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                      <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                        {activePath.title}
                      </h3>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs font-bold rounded-full backdrop-blur-md w-max mx-auto md:mx-0 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                        {activePath.level}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-6 max-w-2xl line-clamp-2 leading-relaxed font-medium">
                      {activePath.description}
                    </p>
                    
                    {/* Premium Progress Bar */}
                    <div className="flex flex-col gap-2 max-w-md">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                        <span className="flex items-center gap-1.5">
                          {activePathCompleted && <CheckCircle2 size={14} className="text-emerald-400" />}
                          {activePathProgress}% Completed
                        </span>
                        <span className="text-slate-400">{activePathSolved} / {activePath.totalProblems} problems</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#0f1115] rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${activePathCompleted ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-indigo-600 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'}`}
                          style={{ width: `${activePathProgress}%` }}
                        >
                          {/* Shimmer effect on bar */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Futuristic Button */}
                  <div className="z-10 w-full md:w-auto mt-4 md:mt-0">
                    <Link 
                      to={`/practice/${activePath.slug}`}
                      className="relative inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 font-bold text-white transition-all duration-300 bg-[#2a2d36] border border-white/10 rounded-xl overflow-hidden group/btn hover:scale-105 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                      <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
                      <span className="relative flex items-center gap-2">
                        {activePathCompleted ? 'Review Path' : 'Continue Path'}
                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Practice Paths Tab / Section */}
        {(currentTab === '#dashboard' || currentTab === '#paths') && (
          <div id="practice-paths" className={currentTab === '#dashboard' ? "pt-4" : ""}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Explore Practice Paths</h2>
                <p className="text-sm text-slate-400">Curated paths to build a strong foundation and master concepts.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search paths..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1e1f26] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-white placeholder-slate-500 transition-all font-medium shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[#1e1f26] rounded-xl overflow-x-auto border border-slate-800">
                  {LEVELS.map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setSelectedLevel(lv)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedLevel === lv
                          ? 'bg-[#2a2d36] text-white shadow-sm border border-slate-700/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d36] border border-transparent'
                      }`}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <select 
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-[#1e1f26] border border-slate-800 rounded-xl text-sm font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm w-full sm:w-auto"
                  >
                    {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ListFilter size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Path Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PathCardSkeleton count={3} />
              </div>
            ) : filteredPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPaths.map((path, index) => (
                  <PathCard key={path._id} path={path} progress={progressMap[path.slug]} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#1e1f26] rounded-2xl border border-slate-800 shadow-sm">
                <div className="w-16 h-16 bg-[#2a2d36] rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Search size={28} className="text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No practice paths found
                </h3>
                <p className="text-slate-400 text-sm">
                  {search ? `No paths match "${search}"` : 'No published paths available yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Assessments Tab */}
        {currentTab === '#assessments' && (
          <div className="text-center py-24 bg-[#1e1f26] rounded-2xl border border-slate-800 shadow-sm mt-4">
            <div className="w-16 h-16 bg-[#2a2d36] rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Target size={28} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Assessments</h2>
            <p className="text-slate-400">Assessments are coming soon. Stay tuned!</p>
          </div>
        )}

        {/* Leaderboard Tab */}
        {currentTab === '#leaderboard' && (
          <div className="text-center py-24 bg-[#1e1f26] rounded-2xl border border-slate-800 shadow-sm mt-4">
            <div className="w-16 h-16 bg-[#2a2d36] rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Trophy size={28} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Leaderboard</h2>
            <p className="text-slate-400">Leaderboard is coming soon. Start practicing to rank up!</p>
          </div>
        )}
      </div>
    </PracticeLayout>
  );
};

export default PracticeLanding;
