import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Layout, Users, BookOpen, LogOut, ChevronRight, GraduationCap, BarChart3, Clock, PlayCircle, Trophy, Sparkles, Building2, Send } from 'lucide-react';
import CollegeStudents from './CollegeStudents';
import Logo from '../components/Logo';

function CollegeLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const collegeName = localStorage.getItem('collegeName') || 'Institution';
  
  const navItems = [
    { label: 'Overview', path: '/college/dashboard', icon: Layout },
    { label: 'My Students', path: '/college/students', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('collegeId');
    localStorage.removeItem('collegeName');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* College Sidebar */}
      <aside className="w-80 bg-primary text-white p-12 flex flex-col fixed inset-y-0 z-50">
        <div className="mb-20">
          <Link to="/" className="inline-block mb-3">
             <Logo height={40} />
          </Link>
          <div className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase">Institutional Portal</div>
        </div>

        <div className="mb-12 p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
           <div className="flex items-center gap-3 mb-3">
             <div className="bg-white/10 p-2 rounded">
                <Building2 size={16} />
             </div>
             <span className="text-xs font-bold truncate max-w-[160px]">{collegeName}</span>
           </div>
           <div className="flex items-center gap-2 text-[9px] text-white/50 uppercase tracking-widest font-bold">
              <Sparkles size={12} className="text-primary-container" /> Premium Partner
           </div>
        </div>

        <nav className="flex-grow space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between p-5 rounded text-xs font-bold tracking-widest uppercase transition-all ${isActive ? 'bg-white text-primary shadow-xl' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={18} />
                  {item.label}
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-12 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 min-h-screen bg-surface-container-low">
        {children}
      </main>
    </div>
  );
}

function CollegeOverview() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const collegeId = localStorage.getItem('collegeId');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`/college/${collegeId}/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [collegeId]);

  return (
    <div className="p-12 max-w-6xl mx-auto font-sans">
      <div className="mb-16">
        <h1 className="text-5xl text-primary font-serif italic mb-3">Academic Overview</h1>
        <p className="text-[11px] uppercase tracking-[0.2em] text-outline font-bold">Manage your institutional curriculum and students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-10 editorial-shadow border-t-2 border-primary group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-primary/5 p-3 rounded text-primary">
                <BookOpen size={24} />
              </div>
              <span className="text-[10px] bg-primary text-white px-3 py-1 font-bold uppercase tracking-widest italic">{course.tag || 'CORE'}</span>
            </div>
            
            <h3 className="text-2xl text-primary leading-tight mb-4">{course.title}</h3>
            <p className="text-xs text-on-surface-variant font-light mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
            
            <div className="flex gap-8 pt-8 border-t border-outline-variant/10">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-outline tracking-widest block">Duration</span>
                <span className="text-xs font-medium">{course.duration || '24 Weeks'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-outline tracking-widest block">Format</span>
                <span className="text-xs font-medium">{course.format || 'Cohort'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CollegeDashboard() {
  return (
    <Routes>
      <Route index element={<CollegeLayout><CollegeOverview /></CollegeLayout>} />
      <Route path="/dashboard" element={<CollegeLayout><CollegeOverview /></CollegeLayout>} />
      <Route path="/students" element={<CollegeLayout><CollegeStudents /></CollegeLayout>} />
    </Routes>
  );
}
