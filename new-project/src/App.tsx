import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminEnrolls from './admin/AdminEnrolls';
import AdminReferrals from './admin/AdminReferrals';
import CourseCreator from './admin/CourseCreator';
import AdminProjectCreator from './admin/AdminProjectCreator';
import { Layout, Users, Ticket, Video, LogOut, ChevronRight, BookOpen } from 'lucide-react';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { label: 'Enrolls', path: '/admin/enrolls', icon: Users },
    { label: 'Referrals', path: '/admin/referrals', icon: Ticket },
    { label: 'Manage Courses', path: '/admin/courses', icon: Video },
    { label: 'Manage Projects', path: '/admin/projects', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white p-8 flex flex-col fixed inset-y-0 z-50">
        <div className="mb-12">
          <Link to="/" className="text-2xl font-serif tracking-tighter text-white">Krutanic</Link>
          <div className="text-[10px] font-bold tracking-[0.2em] opacity-40 mt-2 uppercase">Root Admin</div>
        </div>

        <nav className="flex-grow space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between p-4 rounded text-xs font-bold tracking-widest uppercase transition-all ${isActive ? 'bg-white text-primary shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  {item.label}
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/10">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen bg-surface-container-low">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      
      {/* Admin Protected Routes */}
      <Route path="/admin/enrolls" element={<AdminLayout><AdminEnrolls /></AdminLayout>} />
      <Route path="/admin/referrals" element={<AdminLayout><AdminReferrals /></AdminLayout>} />
      <Route path="/admin/courses" element={<AdminLayout><CourseCreator /></AdminLayout>} />
      <Route path="/admin/projects" element={<AdminLayout><AdminProjectCreator /></AdminLayout>} />
      
      {/* Fallback to Admin Enrolls for /admin */}
      <Route path="/admin" element={<AdminLayout><AdminEnrolls /></AdminLayout>} />
    </Routes>
  );
}
