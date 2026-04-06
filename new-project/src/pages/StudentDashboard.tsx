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
  Play,
  Award,
  ArrowLeft,
  Book,
  Lock,
  Save,
  Check,
  Download,
  FileCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
  
  const certRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        res.data.forEach((enroll: any) => {
          fetchProjectStatus(enroll.courseId._id);
          fetchCertEligibility(enroll.courseId._id);
        });
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

  const downloadCertificate = async (courseId: string, studentName: string, courseTitle: string, certId: string) => {
    setIsDownloading(courseId);
    // Give time for component to render in the hidden div if needed (not needed for absolute positioning usually)
    setTimeout(async () => {
      if (certRef.current) {
        try {
          const canvas = await html2canvas(certRef.current, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
          });
          const link = document.createElement('a');
          link.download = `Dikshannt_Certificate_${courseTitle.replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (err) {
          console.error('Snapshot failed', err);
        }
      }
      setIsDownloading(null);
    }, 500);
  };

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

  if (loading && courses.length === 0) {
    return <DikshanntLoader overlay />;
  }

  return (
    <StudentLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={
            <StudentOverview 
              courses={courses} 
              userProgress={userProgress} 
              onStartCourse={(c: any) => { setSelectedCourse(c); navigate('/dashboard/courses'); }} 
            />
          } />
          <Route path="courses" element={
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-12">
                <h1 className="text-4xl font-serif text-slate-800 mb-4 drop-shadow-sm">Your Enrolled Curricula</h1>
                <p className="text-slate-500 font-serif italic font-light flex items-center gap-2">
                  <BookOpen size={14} /> Master the disciplines of antiquity and the future.
                </p>
              </header>
              <div className="grid grid-cols-1 gap-12">
                {courses.length > 0 ? (
                  courses.map((enrollment) => (
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
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <header className="mb-12">
                <h1 className="text-4xl font-serif text-slate-800 mb-4 drop-shadow-sm">Research & Scholarly Projects</h1>
                <p className="text-slate-500 font-serif italic font-light">Complete your daily research diaries to unlock deeper knowledge.</p>
              </header>
              {Object.keys(projectsMap).length > 0 ? (
                <div className="space-y-12">
                  {courses.map(enroll => {
                    const project = projectsMap[enroll.courseId._id];
                    if (!project) return null;
                    return (
                      <div key={enroll._id} className="bg-white p-8 rounded-2xl border border-emerald-50 shadow-sm mb-12">
                        <ProjectDiaryView 
                          project={project} 
                          diary={diariesMap[enroll.courseId._id]} 
                          onSubmit={submitDiary}
                          hideBack
                          onBack={() => {}}
                          isSubmitting={isSubmittingDiary}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <NoData placeholder="No Research Projects Found" />
              )}
            </div>
          } />
          <Route path="certificates" element={
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <header className="mb-12">
                <h1 className="text-4xl font-serif text-slate-800 mb-4 drop-shadow-sm">Honorifics & Certifications</h1>
                <p className="text-slate-500 font-serif italic font-light">The culmination of your scholarly journey.</p>
              </header>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {courses.map(enroll => {
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
                    const readyToIssue = eligibility.isEligible && isFullyWatched && isProjectDone;

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
                                {/* Invisible Template for Snapshot */}
                                <ProfessionalCertificate 
                                  containerRef={certRef}
                                  studentName={userFullName}
                                  courseTitle={title}
                                  certificateId={eligibility.certificate?.certificateId || 'VERIFYING'}
                                  date={new Date().toLocaleDateString()}
                                />
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

              {courses.length === 0 && <NoData placeholder="No Certifications Found" />}
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

function StudentOverview({ courses, userProgress, onStartCourse }: any) {
  const totalSessions: number = courses.reduce((acc: number, c: any) => acc + (c.courseId.sessions?.length || 0), 0);
  const watchedSessions: number = (Object.values(userProgress) as any[]).reduce((acc: number, p: any) => acc + (p.length || 0), 0);
  const progressPercent: number = totalSessions > 0 ? Math.round((watchedSessions / totalSessions) * 100) : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif text-slate-800 mb-4">Academic Overview</h1>
          <p className="text-slate-500 font-serif italic italic font-light italic flex items-center gap-4">
             <Clock size={16} /> Welcome back to your scholarly sanctuary.
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
          {courses.map(c => (
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
          ))}
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
    <div className="w-full space-y-12 animate-in fade-in duration-500">
      {!hideBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 hover:text-emerald-600 mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      )}
      <div className="space-y-16">
        <header className="space-y-4 border-b border-emerald-50 pb-12">
          <span className="px-4 py-1 bg-emerald-600 text-white text-[9px] font-bold tracking-[0.3em] uppercase rounded-full">Compulsory Academic Challenge</span>
          <h2 className="text-5xl font-serif text-slate-800">{project.projectName}</h2>
          <p className="text-xl text-slate-500 font-serif italic font-light italic italic">Complete the following research modules to advance your certification.</p>
        </header>
        <div className="space-y-12">
          {project.days.map((day: any) => {
            const entry = entries.find(e => e.dayNumber === day.dayNumber);
            return (
              <div key={day.dayNumber} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-serif text-xl shadow-lg shadow-emerald-100 flex-shrink-0">
                    {day.dayNumber}
                  </div>
                  <div className="flex-grow space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-2">{day.topic}</h3>
                      <p className="text-sm text-slate-500 font-serif italic">"{day.description}"</p>
                    </div>
                    <textarea 
                      value={entry?.report || ''}
                      onChange={(e) => handleEntryChange(day.dayNumber, e.target.value)}
                      placeholder="Enter research findings (min 10 characters)..."
                      className="w-full bg-white border border-slate-100 p-6 text-sm italic outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-2xl shadow-inner min-h-[150px]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pt-8">
          <button 
            onClick={() => onSubmit(entries)}
            disabled={!isFullyFilled || isSubmitting}
            className={`px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-3 ${isFullyFilled ? 'bg-emerald-700 text-white shadow-xl shadow-emerald-200 hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed grayscale'}`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {diary?.isCompleted ? 'Update Research Diary' : 'Submit & Unlock Modules'}
          </button>
        </div>
      </div>
    </div>
  );
}
