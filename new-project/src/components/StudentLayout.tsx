import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut, 
  ChevronRight, 
  GraduationCap, 
  Library,
  User,
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const studentName = localStorage.getItem('studentName') || 'Scholar';
  
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: Layout },
    { label: 'My Courses', path: '/dashboard/courses', icon: BookOpen },
    { label: 'Research Projects', path: '/dashboard/projects', icon: Library },
    { label: 'Certificates', path: '/dashboard/certificates', icon: Trophy },
  ];

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentName');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-x-hidden">
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-gradient-to-b from-[#003d33] to-[#00251a] text-white flex flex-col fixed inset-y-0 z-50 shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="p-8 pb-12">
          <Link to="/" className="block group">
            <Logo height={32} />
            <div className="h-0.5 w-0 group-hover:w-full bg-emerald-400 transition-all duration-500 mt-2 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-100/40">Academic Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/overview');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white text-[#004D40] shadow-[0_10px_20px_rgba(0,0,0,0.2)] scale-[1.02]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-emerald-50' : 'bg-transparent group-hover:bg-white/10'}`}>
                    <Icon size={18} />
                  </div>
                  {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="text-emerald-600 animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="mt-auto p-6 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-bold text-white leading-none mb-1 truncate">{studentName}</p>
              <p className="text-[8px] text-emerald-400/60 font-bold tracking-widest uppercase">Premium Scholar</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-[10px] font-bold tracking-widest uppercase text-red-300/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen relative w-full">
        {/* Top Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-grow lg:flex-none">
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-800 tracking-wider">LATEST MILESTONE</p>
                <p className="text-[9px] text-emerald-600 font-bold uppercase">72% Progress</p>
              </div>
              <div className="size-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <GraduationCap size={20} className="text-slate-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-12 pb-24 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Fixed Footer Decoration */}
        <div className="fixed bottom-8 right-12 opacity-10 pointer-events-none">
           <Library size={120} className="text-[#004D40]" />
        </div>
      </main>
    </div>
  );
}
