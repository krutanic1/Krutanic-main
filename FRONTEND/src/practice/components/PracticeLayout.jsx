import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { LogOut } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/practice' },
  { label: 'Practice Paths', path: '/practice#paths' },
  { label: 'Assessments', path: '/practice#assessments' },
  { label: 'Leaderboard', path: '/practice#leaderboard' },
];

const PracticeLayout = ({ children }) => {
  const { practiceUser, logout, isAuthenticated } = usePracticeAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#181920] font-sans selection:bg-indigo-500/30 flex flex-col text-slate-200">
      
      {/* Top Navbar */}
      <header className="h-16 bg-[#1e1f26] border-b border-slate-800 sticky top-[65px] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const currentFullPath = location.pathname + location.hash;
              // If path is exactly '/practice' and we have no hash, Dashboard is active.
              // Otherwise, match the exact path + hash.
              const isActive = (item.path === '/practice' && (currentFullPath === '/practice' || currentFullPath === '/practice#dashboard')) || currentFullPath === item.path;
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'text-white bg-indigo-500/20 border border-indigo-500/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2d36] border border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-800">
              {practiceUser?.avatar ? (
                <img src={practiceUser.avatar} alt={practiceUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1e1f26]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-[#1e1f26]">
                  {practiceUser?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block min-w-0 max-w-[120px]">
                <p className="text-sm font-bold text-slate-200 truncate">{practiceUser?.name}</p>
              </div>
              <button onClick={logout} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="pl-4 border-l border-slate-800">
              <Link to="/practice/login" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PracticeLayout;
