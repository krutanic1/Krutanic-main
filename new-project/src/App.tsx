import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ExploreCourses from './pages/ExploreCourses';
import AboutUs from './pages/AboutUs';
import Institutions from './pages/Institutions';
import Insights from './pages/Insights';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import StudentDashboard from './pages/StudentDashboard';
import AdminEnrolls from './admin/AdminEnrolls';
import AdminReferrals from './admin/AdminReferrals';
import CourseCreator from './admin/CourseCreator';
import AdminProjectCreator from './admin/AdminProjectCreator';
import AdminColleges from './admin/AdminColleges';
import AdminCertificates from './admin/AdminCertificates';
import AdminUpcomingCourses from './admin/AdminUpcomingCourses';
import AdminCollegeRequests from './admin/AdminCollegeRequests';
import AdminMicroUsers from './admin/AdminMicroUsers';
import CollegeDashboard from './pages/CollegeDashboard';
import { Layout, Users, Ticket, Video, LogOut, ChevronRight, BookOpen, GraduationCap, Award, Calendar, Building2 } from 'lucide-react';
import Logo from './components/Logo';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/AdminLogin';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await axios.post('/microadmin/logout');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminName');
      navigate('/adminlogin');
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback
      window.location.href = '/adminlogin';
    }
  };
  
  const navItems = [
    { label: 'Enrolls', path: '/admin/enrolls', icon: Users },
    { label: 'Referrals', path: '/admin/referrals', icon: Ticket },
    { label: 'Manage Courses', path: '/admin/courses', icon: Video },
    { label: 'Upcoming Courses', path: '/admin/upcoming', icon: Calendar },
    { label: 'Manage Projects', path: '/admin/projects', icon: BookOpen },
    { label: 'Manage Colleges', path: '/admin/colleges', icon: GraduationCap },
    { label: 'Certificates', path: '/admin/certificates', icon: Award },
    { label: 'College Requests', path: '/admin/college-requests', icon: Building2 },
    { label: 'Micro Students', path: '/admin/micro-students', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white p-8 flex flex-col fixed inset-y-0 z-50">
        <div className="mb-12">
          <Link to="/" className="flex items-center">
            <Logo height={28} />
          </Link>
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
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors w-full"
          >
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

function RouteScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scrollToHashTarget = () => {
      if (!location.hash) return true;

      const targetId = location.hash.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return false;

      const headerOffset = 96;
      const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return true;
    };

    if (location.hash) {
      if (!scrollToHashTarget()) {
        timeoutId = setTimeout(scrollToHashTarget, 120);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <>
      <RouteScrollHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore-courses" element={<ExploreCourses />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/dashboard/*" element={<StudentDashboard />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin/enrolls" element={<AdminProtectedRoute><AdminLayout><AdminEnrolls /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/referrals" element={<AdminProtectedRoute><AdminLayout><AdminReferrals /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/courses" element={<AdminProtectedRoute><AdminLayout><CourseCreator /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/upcoming" element={<AdminProtectedRoute><AdminLayout><AdminUpcomingCourses /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/projects" element={<AdminProtectedRoute><AdminLayout><AdminProjectCreator /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/colleges" element={<AdminProtectedRoute><AdminLayout><AdminColleges /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/certificates" element={<AdminProtectedRoute><AdminLayout><AdminCertificates /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/college-requests" element={<AdminProtectedRoute><AdminLayout><AdminCollegeRequests /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/micro-students" element={<AdminProtectedRoute><AdminLayout><AdminMicroUsers /></AdminLayout></AdminProtectedRoute>} />
        
        {/* College Portal */}
        <Route path="/college/*" element={<CollegeDashboard />} />
        
        {/* Fallback to Admin Enrolls for /admin */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><AdminEnrolls /></AdminLayout></AdminProtectedRoute>} />
      </Routes>
    </>
  );
}
