import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Play, 
  LogOut, 
  Video, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  User, 
  Award, 
  Search, 
  Layout, 
  CheckCircle,
  Menu,
  X,
  Bell,
  ArrowLeft,
  Book,
  Lock,
  Calendar,
  Save,
  Check,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [view, setView] = useState<'syllabus' | 'session' | 'project'>('syllabus');
  const [userEmail, setUserEmail] = useState('');
  const [userProgress, setUserProgress] = useState<any>({});
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [currentDiary, setCurrentDiary] = useState<any>(null);
  const [isSubmittingDiary, setIsSubmittingDiary] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    const email = localStorage.getItem('studentEmail');
    
    if (!token || !email) {
      window.location.href = '/login';
      return;
    }
    setUserEmail(email);
    fetchUserInfo();
    fetchMyCourses(email);
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get('/microcourses/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      setUserProgress(res.data.courseProgress || {});
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  };

  const fetchMyCourses = async (email: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/microcourses/my-courses?email=${email}`);
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourse(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectStatus = async (courseId: string) => {
    try {
      const res = await axios.get(`/microcourses/my-project/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      setCurrentProject(res.data.project);
      setCurrentDiary(res.data.diary);
    } catch (err) {
      setCurrentProject(null);
      setCurrentDiary(null);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchProjectStatus(selectedCourse.courseId._id);
    }
  }, [selectedCourse]);

  const handleTrackSession = async (courseId: string, sessionIndex: number) => {
    try {
      await axios.post('/microcourses/track-session', { courseId, sessionIndex }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      fetchUserInfo(); // Refresh progress
    } catch (err) {
      console.error('Failed to track progress', err);
    }
  };

  const isSessionLocked = (courseId: string, sessionIndex: number) => {
    if (!currentProject) return false;
    
    // If the student hasn't watched enough sessions to trigger the project, it's not locked yet
    if (sessionIndex < currentProject.lockAfterSessions) return false;

    // If they ARE at or beyond the lock threshold, they must have completed the project
    const isProjectDone = currentDiary?.isCompleted;
    return !isProjectDone;
  };

  const handleStartSession = (course: any, session: any, index: number) => {
    const courseId = course.courseId._id;
    if (isSessionLocked(courseId, index)) {
      setSelectedCourse(course);
      setView('project');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setSelectedCourse(course);
    setActiveSession({...session, index});
    setView('session');
    handleTrackSession(courseId, index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitDiary = async (entries: any[]) => {
    if (!currentProject || !selectedCourse) return;
    setIsSubmittingDiary(true);
    try {
      await axios.post('/microcourses/submit-diary', {
        projectId: currentProject._id,
        courseId: selectedCourse.courseId._id,
        entries
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      await fetchProjectStatus(selectedCourse.courseId._id);
      alert('Diary updated successfully!');
    } catch (err) {
      alert('Failed to save diary');
    } finally {
      setIsSubmittingDiary(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentName');
    window.location.href = '/';
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
          className="text-academic-dark"
        >
          <LoaderIcon />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-on-surface font-sans selection:bg-academic-dark/10">
      {/* More Vibrant Metallic Shining Navigation Header */}
      <nav className="h-20 lg:h-24 bg-gradient-to-r from-[#003d33] via-[#00897B] to-[#003d33] border-b border-white/20 px-8 lg:px-12 flex justify-between items-center sticky top-0 z-[100] shadow-[0_4px_30px_rgba(0,121,107,0.3)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_-2px_15px_rgba(52,211,153,0.6)]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <a href="/" className="text-2xl lg:text-3xl font-serif font-bold italic tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Krutanic
          </a>
        </div>
        
        <div className="flex items-center gap-6 lg:gap-10 relative z-10">
          <button className="p-2 text-white/70 hover:text-white transition-colors relative group/bell">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-academic-dark group-hover/bell:scale-110 transition-transform"></span>
          </button>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 lg:pl-10">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-white uppercase tracking-widest leading-none mb-1">
                {localStorage.getItem('studentName') || userEmail.split('@')[0]}
              </div>
              <div className="text-[9px] text-white/50 uppercase font-medium tracking-tight">
                Premium Scholar
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all shadow-inner group/user"
                title="Sign Out"
              >
                <User size={18} className="group-hover/user:scale-110 transition-transform" />
              </button>
              <button 
                onClick={handleLogout}
                className="text-white/40 hover:text-white/80 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {view === 'syllabus' ? (
            <motion.div
              key="syllabus"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-7xl mx-auto p-8 lg:p-16"
            >
              <header className="mb-16">
                <h1 className="text-5xl font-serif text-academic-dark mb-4">Your Syllabus</h1>
                <p className="text-academic-gray font-serif italic italic font-light italic">Continue your scholarly pursuit across certified curricula.</p>
              </header>

              <div className="grid grid-cols-1 gap-12">
                {courses.length > 0 ? (
                  courses.map((enrollment) => (
                    <CourseCard 
                      key={enrollment._id} 
                      enrollment={enrollment} 
                      onStartSession={handleStartSession} 
                      userProgress={userProgress}
                      currentProject={currentProject}
                      currentDiary={currentDiary}
                    />
                  ))
                ) : (
                  <div className="py-32 text-center border-2 border-dashed border-outline-variant/50 rounded-lg">
                    <BookOpen size={48} className="mx-auto text-academic-gray/20 mb-6" />
                    <h2 className="text-2xl font-serif text-academic-dark mb-2 font-light italic">No Active Enrollments</h2>
                    <p className="text-academic-gray max-w-sm mx-auto italic font-light">Visit our course catalog to begin your learning journey.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : view === 'session' ? (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white"
            >
              <SessionView 
                course={selectedCourse} 
                session={activeSession} 
                onBack={() => setView('syllabus')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="project"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-5xl mx-auto p-8 lg:p-16"
            >
              <ProjectDiaryView 
                project={currentProject} 
                diary={currentDiary} 
                onSubmit={submitDiary}
                onBack={() => setView('syllabus')}
                isSubmitting={isSubmittingDiary}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Global Footer (Subtle) */}
      <footer className="py-12 px-8 lg:px-16 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6 bg-academic-light-gray/30">
        <div className="flex gap-8 text-[9px] font-bold tracking-widest text-academic-gray uppercase">
          <a href="#" className="hover:text-academic-dark">Honor Code</a>
          <a href="#" className="hover:text-academic-dark">Terms of Inquiry</a>
          <a href="#" className="hover:text-academic-dark">Library Access</a>
        </div>
        <div className="text-[9px] font-bold tracking-widest text-academic-gray/60 uppercase">
          © 2024 KRUTANIC. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ enrollment, onStartSession, userProgress, currentProject, currentDiary }: any) {
  const course = enrollment.courseId;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border-l-4 border-[#00897B] shadow-[0_10px_40px_rgba(0,121,107,0.1)] p-8 lg:p-12 transition-all hover:border-[#00BFA5]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1 bg-emerald-50 text-[#00897B] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">Course ID: {course._id.slice(-6).toUpperCase()}</span>
          </div>
          <h2 className="text-4xl font-serif text-academic-dark mb-4">{course.title}</h2>
          <p className="text-academic-gray max-w-2xl font-serif italic font-light">"{course.description}"</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-1">Certification Module</div>
          <div className="text-2xl font-serif text-[#00897B] uppercase tracking-tight">Active</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-6">
           <h3 className="text-[10px] font-bold tracking-[0.3em] text-emerald-800 uppercase">Curriculum Modules</h3>
           <span className="text-[10px] font-bold text-[#00897B] uppercase">{course.sessions?.length || 0} Total</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.sessions?.map((s: any, i: number) => {
            const isCompleted = userProgress[course._id]?.includes(i);
            const isLocked = !isCompleted && i >= (currentProject?.lockAfterSessions ?? 999) && !currentDiary?.isCompleted;

            return (
              <button 
                key={i}
                onClick={() => onStartSession(enrollment, s, i)}
                className={`group p-6 border transition-all text-left flex items-center justify-between ${isLocked ? 'border-gray-200 bg-gray-50/50 cursor-not-allowed' : 'border-emerald-50 hover:border-[#00BFA5] hover:bg-emerald-50/30'}`}
                disabled={false} // We handle the lock in handleStartSession for better UX (showing Project view)
              >
                <div className={isLocked ? 'opacity-40' : ''}>
                  <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-1 text-opacity-70">Module {String(i + 1).padStart(2, '0')}</div>
                  <div className="text-xs font-bold text-academic-dark uppercase group-hover:text-[#00897B] transition-colors">{s.sessionName}</div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLocked ? 'text-gray-300' : isCompleted ? 'bg-emerald-100 text-emerald-600' : 'text-emerald-200 group-hover:text-[#00897B] group-hover:bg-emerald-100'}`}>
                  {isLocked ? <Lock size={12} /> : isCompleted ? <CheckCircle size={14} /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionView({ course, session, onBack }: any) {
  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col items-center">
      <div className="max-w-6xl w-full px-8 py-12 lg:py-20 flex flex-col items-center text-center">
        <div className="mb-8">
          <span className="academic-pill">Current Module</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-serif text-[#004D40] mb-6 leading-tight max-w-4xl font-light">
          {session.sessionName}
        </h1>
        
        <p className="text-xl font-serif text-emerald-700 italic font-light mb-16 max-w-2xl bg-emerald-50/50 px-6 py-2 rounded-full border border-emerald-100">
          {course.courseId.title}
        </p>

        {/* Video Player Container with Green Glow */}
        <div className="w-full relative group mb-20">
          <div className="absolute -inset-4 bg-emerald-400/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          <div className="relative bg-white p-2 sm:p-4 lg:p-6 shadow-[0_15px_50px_rgba(0,121,107,0.15)] ring-1 ring-emerald-100/50">
            <div className="aspect-video bg-[#002D24] relative overflow-hidden">
              <iframe
                src={`https://drive.google.com/file/d/${session.driveFileId}/preview`}
                className="w-full h-full border-0 contrast-[1.05]"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
          <button 
            onClick={onBack}
            className="academic-button-outline w-full sm:w-auto flex items-center justify-center gap-3 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          >
            <ArrowLeft size={16} />
            Return to Syllabus
          </button>
          <button className="academic-button-filled w-full sm:w-auto bg-[#00897B] hover:bg-[#00796B] shadow-emerald-200">
            Complete Session
          </button>
        </div>

        <div className="flex items-center gap-3 text-emerald-600/40">
           <Book size={14} />
           <span className="text-[10px] font-bold tracking-[0.4em] uppercase">The Scholarly Pursuit Continues</span>
        </div>
      </div>
    </div>
  );
}

function ProjectDiaryView({ project, diary, onSubmit, onBack, isSubmitting }: any) {
  const [entries, setEntries] = useState<any[]>(diary?.entries || project.days.map((d: any) => ({ dayNumber: d.dayNumber, report: '' })));

  const handleEntryChange = (dayNumber: number, report: string) => {
    const updated = [...entries];
    const index = updated.findIndex(e => e.dayNumber === dayNumber);
    if (index !== -1) {
      updated[index] = { ...updated[index], report };
    } else {
      updated.push({ dayNumber, report });
    }
    setEntries(updated);
  };

  const isFullyFilled = project.days.every((d: any) => 
    entries.find(e => e.dayNumber === d.dayNumber && e.report?.trim().length > 10)
  );

  return (
    <div className="w-full">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-academic-gray hover:text-academic-dark mb-12 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Syllabus
      </button>

      <div className="bg-white border border-emerald-100 p-10 lg:p-16 shadow-[0_30px_100px_rgba(0,121,107,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <header className="relative z-10 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1 bg-emerald-600 text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full shadow-lg shadow-emerald-200">Compulsory Project</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif text-academic-dark mb-6 leading-tight">{project.projectName}</h1>
          <p className="text-xl text-academic-gray font-serif italic font-light italic max-w-2xl">Your scholarly sessions are temporarily suspended. To resume, please document your daily research and practical findings in the diary below.</p>
        </header>

        <div className="space-y-12 relative z-10">
          {project.days.map((day: any) => {
            const entry = entries.find(e => e.dayNumber === day.dayNumber);
            return (
              <div key={day.dayNumber} className="group">
                <div className="flex items-start gap-8 mb-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-serif text-xl border border-emerald-100 flex-shrink-0">
                    {day.dayNumber}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-academic-dark uppercase tracking-tight mb-1">{day.topic}</h3>
                    <p className="text-sm text-academic-gray font-serif italic mb-6">"{day.description}"</p>
                    
                    <textarea 
                      value={entry?.report || ''}
                      onChange={(e) => handleEntryChange(day.dayNumber, e.target.value)}
                      placeholder="Enter your daily progress report here (minimum 10 characters)..."
                      className="w-full bg-academic-light-gray/20 border border-emerald-50 p-6 text-sm font-sans italic outline-none focus:border-emerald-500 focus:bg-white transition-all h-32 resize-none rounded-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 pt-10 border-t border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex items-center gap-3 text-academic-gray">
             <Calendar size={18} />
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Documenting Excellence</span>
          </div>

          <button 
            onClick={() => onSubmit(entries)}
            disabled={!isFullyFilled || isSubmitting}
            className={`academic-button-filled px-12 h-14 flex items-center gap-3 transition-all ${isFullyFilled ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-gray-200 cursor-not-allowed opacity-50 text-gray-500'}`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : diary?.isCompleted ? <Check size={18} /> : <Save size={18} />}
            {diary?.isCompleted ? 'Update Scholarly Diary' : 'Submit & Unlock Sessions'}
          </button>
        </div>
        
        {!isFullyFilled && (
           <p className="text-[9px] text-red-400 font-bold tracking-widest uppercase mt-4 text-right">Provide a detailed report for all days to unlock content.</p>
        )}
      </div>
    </div>
  );
}

function LoaderIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
