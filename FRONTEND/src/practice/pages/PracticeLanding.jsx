import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import PathCard from '../components/PathCard';
import { PathCardSkeleton } from '../components/Skeleton';
import { 
  LogOut, ChevronDown, Search, BookOpen, 
  Zap, Code2, Trophy, Flame, PlayCircle, LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const PracticeLanding = () => {
  const { practiceUser, practiceApi, isAuthenticated, logout } = usePracticeAuth();
  const navigate = useNavigate();

  const [paths, setPaths] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

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

  // Find most active path
  const activePath = useMemo(() => {
    if (!isAuthenticated) return null;
    const activeSlugs = Object.keys(progressMap).filter(slug => progressMap[slug].solved > 0);
    if (activeSlugs.length === 0) return null;
    const sorted = activeSlugs.sort((a, b) => progressMap[b].solved - progressMap[a].solved);
    return paths.find(p => p.slug === sorted[0]);
  }, [progressMap, paths, isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] font-sans selection:bg-indigo-500/30 pb-20">
      {/* Top Navigation */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-[61px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2.5 text-sm font-medium" aria-label="Breadcrumb">
            <Link to="/" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Home</Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-indigo-600 dark:text-indigo-400">Practice Dashboard</span>
          </nav>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 p-1 pl-3 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-sm group"
              >
                <span className="hidden sm:block text-slate-700 dark:text-slate-200 font-semibold max-w-[120px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {practiceUser?.name?.split(' ')[0]}
                </span>
                {practiceUser?.avatar ? (
                  <img src={practiceUser.avatar} alt={practiceUser.name} className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900/50" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-indigo-100 dark:ring-indigo-900/50">
                    {practiceUser?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-slate-700/60 py-2 z-50 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{practiceUser?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{practiceUser?.email}</p>
                  </div>
                  <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium uppercase tracking-wider">Overall Progress</p>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{totalSolved}</span>
                      <span className="text-sm font-semibold text-slate-400 mb-0.5">/ {totalProblems}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/practice/login"
              className="px-5 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md shadow-slate-200 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="relative isolate pt-20 pb-32 bg-[url('/practice_hero_bg.jpg')] bg-cover bg-center bg-fixed rounded-b-[40px] shadow-2xl overflow-hidden border-b border-indigo-500/20">
        {/* Lighter overlays to let the background shine */}
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-[#0f172a]/60 backdrop-blur-[1px] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent dark:from-[#0f172a] z-0"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.05] drop-shadow-2xl">
            {isAuthenticated ? (
              <>Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">{practiceUser?.name?.split(' ')[0]}</span></>
            ) : (
              <>Code. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">Master.</span> Excel.</>
            )}
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-200/90 max-w-3xl font-medium leading-relaxed mb-14 drop-shadow-md">
            Dive into premium curated challenges. Track your mastery, unlock achievements, and level up your skills for top engineering roles.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-16">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-xl transition-all hover:-translate-y-1 hover:bg-white/20">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center border border-cyan-400/30">
                <Code2 size={24} className="text-cyan-300" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none mb-1">{totalProblems}</p>
                <p className="text-[11px] font-bold text-cyan-200/70 uppercase tracking-widest">Problems</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-xl transition-all hover:-translate-y-1 hover:bg-white/20">
              <div className="w-12 h-12 rounded-xl bg-purple-400/20 flex items-center justify-center border border-purple-400/30">
                <Trophy size={24} className="text-purple-300" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none mb-1">{paths.length}</p>
                <p className="text-[11px] font-bold text-purple-200/70 uppercase tracking-widest">Paths</p>
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-4 bg-indigo-500/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:-translate-y-1 hover:bg-indigo-500/30">
                <div className="w-12 h-12 rounded-xl bg-indigo-400/30 flex items-center justify-center border border-indigo-300/40">
                  <Flame size={24} className="text-indigo-200" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-white leading-none mb-1">{totalSolved}</p>
                  <p className="text-[11px] font-bold text-indigo-200/80 uppercase tracking-widest">Solved</p>
                </div>
              </div>
            )}
          </div>

          {/* Continue Learning Widget - Wide Banner Design */}
          {activePath && (
            <div className="w-full max-w-4xl mx-auto relative group text-left">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-[32px] blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 transform transition-all duration-300 group-hover:-translate-y-1">
                
                <div className="flex-1">
                  <h3 className="text-xs font-black text-cyan-300 flex items-center gap-2 uppercase tracking-widest mb-3">
                    <PlayCircle size={16} /> Resume Active Path
                  </h3>
                  <h4 className="text-3xl font-black text-white mb-2 leading-tight">
                    {activePath.title}
                  </h4>
                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed break-words break-all">
                    {activePath.description}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border-[3px] border-indigo-400/30 relative mb-2">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-cyan-400 stroke-current drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          strokeWidth="3"
                          strokeDasharray={`${(progressMap[activePath.slug]?.solved / activePath.totalProblems) * 100}, 100`}
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="text-sm font-black text-white">
                        {Math.round((progressMap[activePath.slug]?.solved / activePath.totalProblems) * 100)}%
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                  </div>

                  <Link
                    to={`/practice/${activePath.slug}`}
                    className="px-8 py-4 bg-white text-indigo-950 text-sm font-black rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap"
                  >
                    Jump Back In
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explore Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <LayoutGrid size={22} className="text-slate-400" />
                Explore Paths
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Select a path to start solving problems and tracking your progress.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search paths..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all font-medium shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-x-auto border border-slate-200/50 dark:border-slate-700/50">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setSelectedLevel(lv)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedLevel === lv
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200/50 dark:border-slate-700/50'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <PathCardSkeleton count={6} />
          ) : filteredPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 auto-rows-[300px] gap-6 grid-flow-row-dense">
              {filteredPaths.map((path, index) => (
                <PathCard key={path._id} path={path} progress={progressMap[path.slug]} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 border-dashed dark:border-slate-700">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                No practice paths found
              </h3>
              <p className="text-slate-400 text-sm font-medium">
                {search ? `No paths match "${search}"` : 'No published paths available yet. Check back soon!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeLanding;
