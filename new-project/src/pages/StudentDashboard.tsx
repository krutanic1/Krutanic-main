import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle, 
  PlayCircle, 
  Loader2, 
  Trophy, 
  Target, 
  ArrowRight, 
  Library,
  Download, 
  Check, 
  X, 
  Printer,
  Play, 
  ChevronRight, 
  Search, 
  Bell, 
  Award,
  Video,
  FileText,
  ArrowLeft,
  Book,
  Lock,
  Save,
  FileCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import DikshanntLoader from '../components/DikshanntLoader';
import StudentLayout from '../components/StudentLayout';
import ProfessionalCertificate from '../components/ProfessionalCertificate';

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userProgress, setUserProgress] = useState<any>({});
  const [projectsMap, setProjectsMap] = useState<any>({});
  const [diariesMap, setDiariesMap] = useState<any>({});
  const [certEligibilities, setCertEligibilities] = useState<any>({});
  const [isSubmittingDiary, setIsSubmittingDiary] = useState(false);
  const [isApplyingCert, setIsApplyingCert] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [downloadData, setDownloadData] = useState<any>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  
  // High-Speed Lazy Loading States
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [certsLoading, setCertsLoading] = useState(false);
  const [hasFetchedProjects, setHasFetchedProjects] = useState(false);
  const [hasFetchedCerts, setHasFetchedCerts] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Optimized Lazy Loading: Fetch specialized data only when the route is active
  useEffect(() => {
    const path = location.pathname;
    
    if (path.endsWith('/projects') && !hasFetchedProjects && courses.length > 0) {
      setProjectsLoading(true);
      Promise.all(courses.map(enroll => fetchProjectStatus(enroll.courseId._id)))
        .then(() => {
          setHasFetchedProjects(true);
          setProjectsLoading(false);
        });
    }

    if (path.endsWith('/certificates') && !hasFetchedCerts && courses.length > 0) {
      setCertsLoading(true);
      Promise.all(courses.map(enroll => fetchCertEligibility(enroll.courseId._id)))
        .then(() => {
          setHasFetchedCerts(true);
          setCertsLoading(false);
        });
    }

    // Courses page also needs project status for session locking
    if (path.endsWith('/courses') && !hasFetchedProjects && courses.length > 0) {
      setProjectsLoading(true);
      Promise.all(courses.map(enroll => fetchProjectStatus(enroll.courseId._id)))
        .then(() => {
          setHasFetchedProjects(true);
          setProjectsLoading(false);
        });
    }
  }, [location.pathname, courses.length, hasFetchedProjects, hasFetchedCerts]);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get('/microcourses/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      setUserProgress(res.data.courseProgress || {});
      setUserFullName(res.data.fullName);
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
        // LAZY LOADING: We no longer fetch projects/certs for all courses here
        // This makes the initial "login to overview" transition high-speed.
        // Specialized data will be fetched by the location-aware useEffect instead.
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
      setProjectsMap((prev: any) => ({ ...prev, [courseId]: res.data.project }));
      setDiariesMap((prev: any) => ({ ...prev, [courseId]: res.data.diary }));
    } catch (err) {
      setProjectsMap((prev: any) => ({ ...prev, [courseId]: null }));
      setDiariesMap((prev: any) => ({ ...prev, [courseId]: null }));
    }
  };

  const fetchCertEligibility = async (courseId: string) => {
    try {
      const res = await axios.get(`/microcourses/cert-eligibility/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      setCertEligibilities((prev: any) => ({ ...prev, [courseId]: res.data }));
    } catch (err) {
      console.error('Cert check failed', err);
    }
  };

  const handleApplyEarly = async (courseId: string, courseTitle: string) => {
    setIsApplyingCert(courseId);
    try {
      await axios.post('/microcourses/apply-early', { courseId, courseTitle }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      await fetchCertEligibility(courseId);
      alert('Application submitted for Admin review!');
    } catch (err) {
      alert('Failed to submit application');
    } finally {
      setIsApplyingCert(null);
    }
  };

  const downloadCertificate = (courseId: string, studentName: string, courseTitle: string, certId: string) => {
    setDownloadData({ studentName, courseTitle, certId, courseId });
    setShowCertModal(true);
  };

  const performCapture = async () => {
    if (!downloadData || !certRef.current) return;
    
    setIsDownloading(downloadData.courseId);
    try {
      if (document.fonts) await document.fonts.ready;
      await new Promise(r => setTimeout(r, 600));
      
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1123,
        height: 794,
        scrollX: 0,
        scrollY: 0,
      });
      
      const link = document.createElement('a');
      const fileName = `Dikshannt_Certificate_${downloadData.courseTitle.replace(/\s+/g, '_')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Snapshot failed', err);
      alert('Automatic download failed. Please use "Print / Save as PDF" instead.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handlePrint = () => {
    if (!certRef.current) return;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>Scholarly Certificate - ${downloadData.courseTitle}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print { @page { size: landscape; margin: 0; } body { margin: 0; } }
              body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            </style>
          </head>
          <body>
            ${certRef.current.innerHTML}
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 1000);
    }
  };

  // Remove the old useEffect-based trigger

  const handleTrackSession = async (courseId: string, sessionIndex: number) => {
    try {
      await axios.post('/microcourses/track-session', { courseId, sessionIndex }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('studentToken')}` }
      });
      fetchUserInfo();
    } catch (err) {
      console.error('Failed to track progress', err);
    }
  };

  const isSessionLocked = (courseId: string, sessionIndex: number) => {
    const project = projectsMap[courseId];
    if (!project) return false;
    if (sessionIndex < project.lockAfterSessions) return false;
    const diary = diariesMap[courseId];
    return !diary?.isCompleted;
  };

  const handleStartSession = (course: any, session: any, index: number) => {
    const courseId = course.courseId._id;
    if (isSessionLocked(courseId, index)) {
      setSelectedCourse(course);
      navigate('/dashboard/projects');
      return;
    }
    
    setSelectedCourse(course);
    setActiveSession({...session, index});
    handleTrackSession(courseId, index);
    navigate('/dashboard/session');
  };

  const submitDiary = async (entries: any[]) => {
    const project = projectsMap[selectedCourse?.courseId?._id];
    if (!project || !selectedCourse) return;
    setIsSubmittingDiary(true);
    try {
      await axios.post('/microcourses/submit-diary', {
        projectId: project._id,
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



  return (
    <StudentLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={
            <StudentOverview 
              courses={courses} 
              userProgress={userProgress} 
              loading={loading}
              onStartCourse={(c: any) => { setSelectedCourse(c); navigate('/dashboard/courses'); }} 
            />
          } />
          <Route path="courses" element={
            <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ${projectsLoading ? 'opacity-50' : 'opacity-100'}`}>
              <header className="mb-12">
                <h1 className="text-4xl font-serif text-slate-800 mb-4 drop-shadow-sm">Your Enrolled Curricula</h1>
                <p className="text-slate-500 font-serif italic font-light flex items-center gap-2">
                  <BookOpen size={14} /> Master the disciplines of antiquity and the future.
                </p>
                {projectsLoading && (
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                     <Loader2 size={12} className="animate-spin" /> Retrieving locking criteria...
                   </p>
                )}
              </header>
              <div className="grid grid-cols-1 gap-12">
                {(courses || []).length > 0 ? (
                  (courses || []).map((enrollment) => (
                    <CourseCard 
                      key={enrollment._id} 
                      enrollment={enrollment} 
                      onStartSession={handleStartSession} 
                      userProgress={userProgress}
                      project={projectsMap[enrollment.courseId._id]}
                      diary={diariesMap[enrollment.courseId._id]}
                    />
                  ))
                ) : (
                  <NoData placeholder="No Courses Found" />
                )}
              </div>
            </div>
          } />
          <Route path="projects" element={
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`space-y-10 ${projectsLoading ? 'opacity-50' : 'opacity-100'}`}
            >
              <header className="py-10 px-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/30 -skew-x-12 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6 text-slate-800">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-px bg-emerald-600"></span>
                       <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-600 uppercase">Scholarly Archives</span>
                    </div>
                    <h1 className="text-4xl font-serif">Research Laboratory</h1>
                    <p className="text-sm text-slate-500 font-serif italic max-w-md">Document your scholarly journey and research findings to certify.</p>
                  </div>
                  <div className="flex gap-4">
                     {projectsLoading ? (
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                           <Loader2 size={14} className="animate-spin text-emerald-600" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entering Lab...</span>
                        </div>
                     ) : (
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Modules</p>
                           <p className="text-xl font-serif text-slate-800">{Object.keys(projectsMap).length || 0}</p>
                        </div>
                     )}
                  </div>
                </div>
              </header>

              {projectsLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Initializing Archive Data...</p>
                </div>
              ) : Object.keys(projectsMap).length > 0 ? (
                <div className="space-y-12">
                  {(courses || []).map((enroll, idx) => {
                    const project = projectsMap[enroll.courseId._id];
                    if (!project) return null;
                    const diary = diariesMap[enroll.courseId._id];
                    const completedDays = diary?.entries?.filter((e: any) => e.report?.trim().length > 10).length || 0;
                    const totalDays = project.days.length;
                    const progress = Math.round((completedDays / totalDays) * 100);

                    return (
                      <motion.div 
                        key={enroll._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-emerald-600/30 transition-all duration-300"
                      >
                         <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 pb-10 border-b border-slate-50">
                            <div className="flex items-center gap-5">
                               <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                                  <Library size={24} />
                               </div>
                               <div>
                                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Assigned Research</div>
                                  <h2 className="text-2xl font-serif text-slate-800">{project.projectName}</h2>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-6 bg-slate-50/80 px-6 py-4 rounded-2xl border border-slate-100 min-w-[280px]">
                               <div className="flex-grow">
                                  <div className="flex justify-between items-end mb-1.5">
                                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Journal Status</span>
                                     <span className="text-lg font-serif text-emerald-700">{progress}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                     <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className="h-full bg-emerald-600"
                                     />
                                  </div>
                               </div>
                               <div className="text-right border-l border-slate-200 pl-6">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Modules</p>
                                  <p className="text-lg font-serif text-slate-800 leading-none">{completedDays}/{totalDays}</p>
                               </div>
                            </div>
                         </div>

                         <ProjectDiaryView 
                           project={project} 
                           diary={diary} 
                           onSubmit={submitDiary}
                           hideBack
                           onBack={() => {}}
                           isSubmitting={isSubmittingDiary}
                         />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <NoData placeholder="No Research Projects Found" />
              )}
            </motion.div>
          } />
          <Route path="certificates" element={
            <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ${certsLoading ? 'opacity-50' : 'opacity-100'}`}>
               <header className="mb-12">
                <h1 className="text-4xl font-serif text-slate-800 mb-4 drop-shadow-sm">Honorifics & Certifications</h1>
                <p className="text-slate-500 font-serif italic font-light">The culmination of your scholarly journey.</p>
                {certsLoading && (
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                     <Loader2 size={12} className="animate-spin" /> Consulting the registrars...
                   </p>
                )}
              </header>
              
              {certsLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Validating Qualifications...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {(courses || []).map(enroll => {
                    const eligibility = certEligibilities[enroll.courseId._id];
                    if (!eligibility) {
                      return (
                        <div key={enroll._id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm animate-pulse h-80 flex flex-col justify-between">
                           <div className="space-y-4">
                              <div className="size-12 bg-slate-200 rounded-xl" />
                              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                              <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                           </div>
                           <div className="h-12 bg-slate-200 rounded-2xl w-full" />
                        </div>
                      );
                    }

                    const title = enroll.courseId.title;
                    const cId = enroll.courseId._id;
                    const daysRemaining = 14 - eligibility.diffDays;
                    const isFullyWatched = userProgress[cId]?.length === enroll.courseId.sessions?.length;
                    const isProjectDone = diariesMap[cId]?.isCompleted;
                    // Allow issue if all criteria met OR if admin already delivered it
                    const readyToIssue = (eligibility.isEligible && (isFullyWatched || isProjectDone)) || eligibility.status === 'delivered';

                    return (
                      <div key={enroll._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         
                         <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                               <div className="size-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                  <Award size={24} />
                               </div>
                               <div className="text-right">
                                  {readyToIssue ? (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-widest uppercase rounded-full">Issued</span>
                                  ) : (
                                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold tracking-widest uppercase rounded-full">Locked</span>
                                  )}
                               </div>
                            </div>

                            <div>
                               <h3 className="text-xl font-serif text-slate-800 mb-1">{title}</h3>
                               <p className="text-xs text-slate-400 font-medium">Verify through the Academic Archives</p>
                            </div>

                            <div className="space-y-3 py-4 border-y border-slate-50">
                               <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                  <span className="text-slate-400 flex items-center gap-1.5"><FileCheck size={12}/> Video Progress</span>
                                  <span className={isFullyWatched ? 'text-emerald-600' : 'text-slate-400'}>{isFullyWatched ? 'Completed' : 'Incomplete'}</span>
                               </div>
                               <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                  <span className="text-slate-400 flex items-center gap-1.5"><Save size={12}/> Research Project</span>
                                  <span className={isProjectDone ? 'text-emerald-600' : 'text-slate-400'}>{isProjectDone ? 'Completed' : 'Incomplete'}</span>
                               </div>
                               <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                                  <span className="text-slate-400 flex items-center gap-1.5"><History size={12}/> 14-Day Rule</span>
                                  <span className={eligibility.isEligible ? 'text-emerald-600' : 'text-slate-400'}>
                                    {eligibility.isEligible ? 'Passed' : daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Checking...'}
                                  </span>
                               </div>
                            </div>

                            {readyToIssue ? (
                              <>
                                <button 
                                  onClick={() => downloadCertificate(cId, userFullName, title, eligibility.certificate?.certificateId || 'VERIFYING')}
                                  disabled={!!isDownloading}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-3"
                                >
                                  {isDownloading === cId ? <Loader2 className="animate-spin" size={14}/> : <Download size={14} />}
                                  Download Scholar Certificate
                                </button>
                              </>
                            ) : eligibility.status === 'pending' ? (
                               <button disabled className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-slate-100 cursor-not-allowed">
                                  Under Scholarly Review
                               </button>
                            ) : (
                               <button 
                                onClick={() => handleApplyEarly(cId, title)}
                                disabled={!!isApplyingCert}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                {isApplyingCert === cId ? <Loader2 className="animate-spin" size={14}/> : <Check size={14} />}
                                Apply for Early Excellence
                              </button>
                            )}
                         </div>
                      </div>
                  );
               })}
                </div>
              )}

               {(courses || []).length === 0 && !certsLoading && <NoData placeholder="No Certifications Found" />}
            
               {/* Certificate Preview Modal */}
               {showCertModal && downloadData && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
                   <div className="bg-white rounded-3xl w-full max-w-7xl overflow-hidden shadow-2xl relative my-auto">
                     {/* Header */}
                     <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                       <div>
                         <h2 className="text-xl font-bold text-slate-800">Certificate Preview</h2>
                         <p className="text-sm text-slate-500">Review your distinguished achievement</p>
                       </div>
                       <button 
                         onClick={() => { setShowCertModal(false); setDownloadData(null); }}
                         className="p-3 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-rose-500"
                       >
                         <X size={24} />
                       </button>
                     </div>
 
                     {/* Preview Area */}
                     <div className="p-12 bg-slate-100/50 flex justify-center overflow-x-auto min-h-[600px] items-center">
                       <div className="transform scale-[0.6] lg:scale-[0.65] xl:scale-[0.8] origin-center shadow-2xl">
                         <ProfessionalCertificate 
                           containerRef={certRef}
                           studentName={downloadData.studentName}
                           courseTitle={downloadData.courseTitle}
                           certificateId={downloadData.certId}
                           date={new Date().toLocaleDateString()}
                         />
                       </div>
                     </div>
 
                     {/* Actions */}
                     <div className="p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-center gap-4">
                       <button 
                         onClick={performCapture}
                         disabled={!!isDownloading}
                         className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-3"
                       >
                         {isDownloading ? <Loader2 className="animate-spin" size={18}/> : <Download size={18} />}
                         Save as Image (PNG)
                       </button>
                       <button 
                         onClick={handlePrint}
                         className="w-full sm:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-3"
                       >
                         <Printer size={18} />
                         Print / Save as PDF
                       </button>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          } />
          <Route path="session" element={
            activeSession && selectedCourse ? (
               <SessionView 
                course={selectedCourse} 
                session={activeSession} 
                onBack={() => navigate('/dashboard/courses')}
              />
            ) : <Navigate to="/dashboard/courses" replace />
          } />
        </Routes>
      </AnimatePresence>
    </StudentLayout>
  );
}

function StudentOverview({ courses, userProgress, onStartCourse, loading }: any) {
  const totalSessions: number = (courses || []).reduce((acc: number, c: any) => acc + (c.courseId.sessions?.length || 0), 0);
  const watchedSessions: number = (Object.values(userProgress || {}) as any[]).reduce((acc: number, p: any) => acc + (p.length || 0), 0);
  const progressPercent: number = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif text-slate-800 mb-4">Academic Overview</h1>
          <p className="text-slate-500 font-serif italic italic font-light italic flex items-center gap-4">
             {loading ? <Loader2 className="animate-spin" size={16} /> : <Clock size={16} />} 
             {loading ? 'Retrieving your scholarly archives...' : 'Welcome back to your scholarly sanctuary.'}
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-emerald-50 text-center ring-1 ring-emerald-50/50">
              <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-600 mb-1 uppercase">Cumulative Knowledge</p>
              <p className="text-3xl font-serif text-slate-800">{progressPercent}%</p>
           </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Active Curricula', val: courses.length, icon: BookOpen, color: 'text-emerald-700' },
          { label: 'Milestones Reached', val: watchedSessions, icon: Target, color: 'text-indigo-700' },
          { label: 'Pending Research', val: '02', icon: Library, color: 'text-amber-700' },
          { label: 'Honorifics Earned', val: '00', icon: Trophy, color: 'text-rose-700' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group">
            <div className={`size-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${s.color}`}>
              <s.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-serif text-slate-900">{s.val}</p>
          </div>
        ))}
      </div>
      <div className="space-y-8">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Resuming Curricula</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-50 rounded-2xl animate-pulse" />
            ))
          ) : (courses || []).length > 0 ? (
            (courses || []).map(c => (
              <button 
                key={c._id}
                onClick={() => onStartCourse(c)}
                className="bg-white p-8 rounded-2xl border border-emerald-50 shadow-sm hover:border-emerald-600 transition-all text-left flex flex-col justify-between group h-64"
              >
                <div>
                  <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Module Insight</div>
                  <h3 className="text-xl font-serif text-slate-800 mb-4 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">{c.courseId.title}</h3>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Enter Classroom</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            ))
          ) : (
             <div className="col-span-full">
                <NoData placeholder="No Curricula Found" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoData({ placeholder }: { placeholder: string }) {
  return (
    <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      <Library size={48} className="mx-auto text-slate-200 mb-6" />
      <h2 className="text-2xl font-serif text-slate-400 mb-2 font-light italic">{placeholder}</h2>
      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">The archives appear to be awaiting your contribution.</p>
    </div>
  );
}

function CourseCard({ enrollment, onStartSession, userProgress, project, diary }: any) {
  const course = enrollment.courseId;
  return (
    <div className="bg-white border-l-4 border-emerald-600 shadow-lg p-8 lg:p-12 transition-all hover:border-emerald-400 rounded-r-2xl border-y border-r border-slate-100">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">Course ID: {course._id.slice(-6).toUpperCase()}</span>
          </div>
          <h2 className="text-4xl font-serif text-slate-800 mb-4">{course.title}</h2>
          <p className="text-slate-500 max-w-2xl font-serif italic font-light italic">"{course.description}"</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-1">Certification Progress</div>
          <div className="text-2xl font-serif text-emerald-700 uppercase tracking-tight">Active Scholar</div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-50 pb-4 mb-6">
           <h3 className="text-[10px] font-bold tracking-[0.3em] text-emerald-800 uppercase">Curriculum Modules</h3>
           <span className="text-[10px] font-bold text-emerald-600 uppercase">{course.sessions?.length || 0} Total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.sessions?.map((s: any, i: number) => {
            const isCompleted = userProgress[course._id]?.includes(i);
            const isLocked = !isCompleted && i >= (project?.lockAfterSessions ?? 999) && !diary?.isCompleted;
            return (
              <button 
                key={i}
                onClick={() => onStartSession(enrollment, s, i)}
                className={`group p-6 border transition-all text-left flex items-center justify-between rounded-xl ${isLocked ? 'border-slate-100 bg-slate-50/50 cursor-not-allowed grayscale' : 'border-emerald-50 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
              >
                <div>
                  <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Module {String(i + 1).padStart(2, '0')}</div>
                  <div className="text-xs font-bold text-slate-800 uppercase group-hover:text-emerald-700 transition-colors">{s.sessionName}</div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLocked ? 'text-slate-300' : isCompleted ? 'bg-emerald-100 text-emerald-600' : 'text-emerald-200 group-hover:text-emerald-600'}`}>
                  {isLocked ? <Lock size={12} /> : isCompleted ? <CheckCircle size={14} /> : <Play size={14} fill="currentColor" />}
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
    <div className="bg-white min-h-[calc(100vh-80px)] p-8 lg:p-16 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-emerald-600 mb-12 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <span className="text-[10px] font-bold tracking-[0.4em] text-emerald-600 uppercase">Interactive Session</span>
          <h1 className="text-5xl lg:text-6xl font-serif text-slate-800 leading-tight">{session.sessionName}</h1>
          <p className="text-lg text-slate-500 font-serif italic italic font-light italic">{course.courseId.title}</p>
        </header>
        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-8 ring-slate-50">
          <iframe
            src={`https://drive.google.com/file/d/${session.driveFileId}/preview`}
            className="w-full h-full border-0"
            allow="autoplay"
          ></iframe>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12">
          <button className="px-12 py-4 bg-emerald-700 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3">
             <PlayCircle size={18} /> Complete This Module
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectDiaryView({ project, diary, onSubmit, onBack, isSubmitting, hideBack }: any) {
  const [entries, setEntries] = useState<any[]>(diary?.entries || (project?.days || []).map((d: any) => ({ dayNumber: d.dayNumber, report: '' })));
  
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

  const isFullyFilled = (project?.days || []).every((d: any) => 
    entries.find(e => e.dayNumber === d.dayNumber && e.report?.trim().length > 10)
  );

  return (
    <div className="w-full space-y-8">
      {!hideBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-emerald-600 mb-10 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {(project?.days || []).map((day: any, idx: number) => {
          const entry = entries.find(e => e.dayNumber === day.dayNumber);
          const isFilled = entry?.report?.trim().length > 10;

          return (
            <motion.div 
              key={day.dayNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`rounded-2xl border transition-all duration-200 ${
                isFilled 
                  ? 'bg-emerald-50/20 border-emerald-100 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className={`md:w-16 flex flex-col items-center justify-center p-5 border-b md:border-b-0 md:border-r border-slate-100 ${
                  isFilled ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-400 bg-slate-50/50'
                }`}>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 mb-1">Day</span>
                  <span className="text-xl font-serif leading-none">{day.dayNumber}</span>
                  {isFilled && <Check size={14} className="mt-3 text-emerald-600" />}
                </div>

                <div className="flex-grow p-6 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1 line-clamp-1">
                        {day.topic}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-serif italic truncate max-w-md">
                        "{day.description}"
                      </p>
                    </div>
                    {isFilled && (
                      <span className="px-3 py-1 bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Recorded</span>
                    )}
                  </div>
                  
                  <textarea 
                    value={entry?.report || ''}
                    onChange={(e) => handleEntryChange(day.dayNumber, e.target.value)}
                    placeholder="Transcribe findings..."
                    className="w-full bg-white border border-slate-100 p-4 text-xs italic outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 rounded-xl transition-all resize-none font-serif min-h-[100px]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mt-8 gap-4">
        <div className="flex items-center gap-4">
           <div className={`size-10 rounded-full flex items-center justify-center ${isFullyFilled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
              <Award size={20} />
           </div>
           <div className="text-left">
              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Certification Requirement</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">All modules must be documented</p>
           </div>
        </div>
        
        <button 
          onClick={() => onSubmit(entries)}
          disabled={!isFullyFilled || isSubmitting}
          className={`px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 ${
            isFullyFilled 
              ? 'bg-slate-900 text-white hover:bg-black shadow-lg' 
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Save size={14} />
          )}
          {diary?.isCompleted ? 'Update Documentation' : 'Submit Research Journal'}
        </button>
      </div>
    </div>
  );
}
