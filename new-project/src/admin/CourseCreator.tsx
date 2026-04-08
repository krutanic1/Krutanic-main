import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Play, Layout, Video, Loader2, X, PlusCircle, Save, BookOpen, ChevronRight, ChevronDown, Calendar, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseCreator() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSessionFormOpen, setIsSessionFormOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'syllabus'>('sessions');
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    rating: 4.8,
    price: 5000,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'
  });

  const [newSession, setNewSession] = useState({
    sessionName: '',
    driveFileId: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/microcourses/courses');
      setCourses(res.data);
      if (selectedCourse) {
        const updated = res.data.find((c: any) => c._id === selectedCourse._id);
        setSelectedCourse(updated);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setCourseData({ title: '', description: '', rating: 4.8, price: 5000, thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' });
    setIsFormOpen(true);
  };

  const handleEditClick = (c: any) => {
    setIsEditing(true);
    setEditId(c._id);
    setCourseData({ 
        title: c.title, 
        description: c.description, 
        rating: c.rating || 4.8, 
        price: c.price || 5000, 
        thumbnail: c.thumbnail 
    });
    setIsFormOpen(true);
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && editId) {
        await axios.patch(`/admin/microcourses/courses/${editId}`, courseData);
      } else {
        await axios.post('/admin/microcourses/courses', courseData);
      }
      setIsFormOpen(false);
      fetchCourses();
    } catch (err) {
      alert('Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLoading(true);
    try {
      if (editingSessionId) {
        await axios.patch(`/admin/microcourses/courses/${selectedCourse._id}/session/${editingSessionId}`, newSession);
      } else {
        await axios.post(`/admin/microcourses/courses/${selectedCourse._id}/session`, newSession);
      }
      setIsSessionFormOpen(false);
      setEditingSessionId(null);
      setNewSession({ sessionName: '', driveFileId: '' });
      fetchCourses();
    } catch (err) {
      alert('Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    setLoading(true);
    try {
      await axios.delete(`/admin/microcourses/courses/${selectedCourse._id}/session/${sessionId}`);
      fetchCourses();
    } catch (err) {
      alert('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: any) => {
    setEditingSessionId(session._id);
    setNewSession({
      sessionName: session.sessionName,
      driveFileId: session.driveFileId
    });
    setIsSessionFormOpen(true);
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/admin/microcourses/courses/${id}`);
      fetchCourses();
      if (selectedCourse?._id === id) setSelectedCourse(null);
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  // Syllabus Editor Logic
  const handleUpdateSyllabus = async (newCurriculum: any[]) => {
    if (!selectedCourse) return;
    try {
      setLoading(true);
      await axios.patch(`/admin/microcourses/courses/${selectedCourse._id}`, { curriculum: newCurriculum });
      fetchCourses();
    } catch (err) {
      alert('Failed to update syllabus');
    } finally {
      setLoading(false);
    }
  };

  const addWeek = () => {
    const cur = selectedCourse.curriculum ? [...selectedCourse.curriculum] : [];
    cur.push({
      weekTitle: `Module ${cur.length + 1}`,
      days: []
    });
    handleUpdateSyllabus(cur);
  };

  const removeWeek = (wIdx: number) => {
    if (!window.confirm('Delete this entire module?')) return;
    const cur = [...selectedCourse.curriculum];
    cur.splice(wIdx, 1);
    handleUpdateSyllabus(cur);
  };

  const addDay = (wIdx: number) => {
    const cur = [...selectedCourse.curriculum];
    cur[wIdx].days.push({
      dayName: 'Day 1',
      topic: '',
      learning: '',
      isSunday: false,
      projectBadge: null
    });
    handleUpdateSyllabus(cur);
  };

  const updateDay = (wIdx: number, dIdx: number, field: string, value: any) => {
    const cur = [...selectedCourse.curriculum];
    cur[wIdx].days[dIdx][field] = value;
    // We don't auto-save for every keystroke to avoid spamming the server
    const updatedCourse = { ...selectedCourse, curriculum: cur };
    setSelectedCourse(updatedCourse);
  };

  const removeDay = (wIdx: number, dIdx: number) => {
    const cur = [...selectedCourse.curriculum];
    cur[wIdx].days.splice(dIdx, 1);
    handleUpdateSyllabus(cur);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl text-primary mb-2">Manage Courses</h1>
            <p className="text-on-surface-variant italic font-light">Curate elite micro-learning experiences.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="premium-gradient text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-90 shadow-lg transition-all active:scale-95"
          >
            <Plus size={16} /> New Course
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading && courses.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-outline italic">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading courses...
            </div>
          ) : courses.map((c) => (
            <motion.div 
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white editorial-shadow group relative overflow-hidden flex flex-col md:flex-row h-auto md:h-52 border transition-all hover:border-primary/20 ${selectedCourse?._id === c._id ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.02]' : 'border-outline-variant/10'}`}
            >
              {/* Compact Thumbnail */}
              <div className="w-full md:w-80 h-48 md:h-full bg-stone-100 overflow-hidden relative border-r border-outline-variant/5">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(c)}
                        className="bg-white/90 text-primary p-2 rounded hover:bg-primary hover:text-white transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => deleteCourse(c._id)}
                        className="bg-white/90 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 size={12} />
                      </button>
                   </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-8 flex flex-col md:flex-row flex-grow items-center gap-8">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl text-primary font-bold leading-tight">{c.title}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold px-2 py-0.5 bg-primary/5 rounded">
                      {c.rating || 4.8}★
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant font-light italic line-clamp-2 mb-6 opacity-70">
                    "{c.description}"
                  </p>
                  
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-outline font-bold">Roadmap</span>
                      <span className="text-xs font-bold text-primary">{c.curriculum?.length || 0} Modules</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-outline font-bold">Sessions</span>
                      <span className="text-xs font-bold text-primary">{c.sessions?.length || 0} Videos</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-outline font-bold">Investment</span>
                      <span className="text-xs font-bold text-metallic-green">₹{c.price || 5000}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto shrink-0">
                  <button 
                    onClick={() => setSelectedCourse(c)}
                    className={`px-8 py-4 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${selectedCourse?._id === c._id ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-primary hover:bg-primary hover:text-white'}`}
                  >
                    Manage Course <Play size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Management Sidebar */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="lg:w-[450px] bg-white editorial-shadow border-l border-outline-variant/10 min-h-screen flex flex-col sticky top-0 h-screen"
          >
            <div className="p-8 border-b border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl text-primary font-bold tracking-tight mb-1">Management</h2>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold max-w-[200px] leading-tight">{selectedCourse.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-outline hover:text-red-500 transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="flex bg-slate-50 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('sessions')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'sessions' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Video size={14} /> Sessions
                </button>
                <button 
                  onClick={() => setActiveTab('syllabus')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'syllabus' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <BookOpen size={14} /> Syllabus
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
              {activeTab === 'sessions' ? (
                /* Sessions Tab Content */
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library ({selectedCourse.sessions?.length || 0})</span>
                    <button 
                      onClick={() => setIsSessionFormOpen(true)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:opacity-70 transition-opacity"
                    >
                      <PlusCircle size={14} /> ADD NEW
                    </button>
                  </div>
                  
                  {selectedCourse.sessions?.length === 0 ? (
                    <div className="text-center py-20 text-outline text-xs italic">
                      No video sessions attached yet.
                    </div>
                  ) : selectedCourse.sessions.map((s: any, i: number) => (
                    <div key={i} className="bg-white p-5 border border-slate-100 rounded-xl hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/5 text-primary rounded-lg flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-xs font-bold text-primary mb-0.5">{s.sessionName}</h4>
                          <div className="flex items-center gap-2 text-[9px] text-outline truncate opacity-60">
                            <Video size={10} /> {s.driveFileId.substring(0, 15)}...
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditSession(s)} className="text-slate-400 hover:text-primary p-2"><Edit2 size={12} /></button>
                          <button onClick={() => deleteSession(s._id)} className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Syllabus Tab Content */
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Roadmap</span>
                    <button 
                      onClick={addWeek}
                      className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:opacity-70 transition-opacity"
                    >
                      <PlusCircle size={14} /> ADD MODULE
                    </button>
                  </div>

                  {selectedCourse.curriculum?.length === 0 ? (
                    <div className="text-center py-20 text-outline text-xs italic">
                      Start building your roadmap by adding a module.
                    </div>
                  ) : selectedCourse.curriculum.map((week: any, wIdx: number) => (
                    <div key={wIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-primary text-white text-[10px] flex items-center justify-center font-black">
                                {wIdx + 1}
                            </div>
                            <input 
                              value={week.weekTitle} 
                              onChange={(e) => {
                                const cur = [...selectedCourse.curriculum];
                                cur[wIdx].weekTitle = e.target.value;
                                setSelectedCourse({...selectedCourse, curriculum: cur});
                              }}
                              className="bg-transparent text-xs font-bold text-primary focus:outline-none focus:border-b border-primary/20"
                            />
                         </div>
                         <div className="flex items-center gap-1">
                            <button onClick={() => handleUpdateSyllabus(selectedCourse.curriculum)} className="text-emerald-500 p-1.5" title="Save Changes"><Save size={14} /></button>
                            <button onClick={() => removeWeek(wIdx)} className="text-red-400 p-1.5"><Trash2 size={14} /></button>
                         </div>
                      </div>
                      
                      <div className="p-4 space-y-4">
                         {week.days?.map((day: any, dIdx: number) => (
                           <div key={dIdx} className="p-4 border border-dashed border-slate-100 rounded-xl space-y-3 relative group/day">
                              <button onClick={() => removeDay(wIdx, dIdx)} className="absolute -right-2 -top-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/day:opacity-100 transition-opacity shadow-sm"><X size={10} /></button>
                              
                              <div className="flex gap-2">
                                <input 
                                  value={day.dayName} 
                                  placeholder="Day name"
                                  onChange={(e) => updateDay(wIdx, dIdx, 'dayName', e.target.value)}
                                  className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded w-1/3"
                                />
                                <input 
                                  value={day.topic} 
                                  placeholder="Topic title"
                                  onChange={(e) => updateDay(wIdx, dIdx, 'topic', e.target.value)}
                                  className="text-[11px] font-bold text-slate-800 border-b border-transparent focus:border-slate-200 outline-none flex-grow"
                                />
                              </div>
                              <textarea 
                                value={day.learning} 
                                placeholder="Learning outcomes..."
                                onChange={(e) => updateDay(wIdx, dIdx, 'learning', e.target.value)}
                                className="w-full text-[11px] text-slate-500 leading-tight focus:outline-none h-12 resize-none bg-transparent"
                              />
                               <div className="flex items-center justify-between">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                     <input type="checkbox" checked={day.isSunday} onChange={(e) => updateDay(wIdx, dIdx, 'isSunday', e.target.checked)} className="rounded" />
                                     <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Milestone Card</span>
                                  </label>
                                  {day.isSunday && (
                                    <input 
                                      value={day.projectBadge || ''} 
                                      placeholder="Assessent detail..."
                                      onChange={(e) => updateDay(wIdx, dIdx, 'projectBadge', e.target.value)}
                                      className="text-[9px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded focus:outline-none"
                                    />
                                  )}
                               </div>
                           </div>
                         ))}
                         <button 
                          onClick={() => addDay(wIdx)}
                          className="w-full py-2 border-2 border-dashed border-slate-50 rounded-xl text-[9px] font-black text-slate-300 hover:border-slate-100 hover:text-slate-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                         >
                           <PlusCircle size={12} /> ADD SESSION
                         </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => handleUpdateSyllabus(selectedCourse.curriculum)}
                    className="w-full premium-gradient text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Update Full Roadmap
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Editor Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-lg p-10 editorial-shadow relative rounded-2xl"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute right-8 top-8 text-outline hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">{isEditing ? 'Edit MicroCourse' : 'Create MicroCourse'}</h2>
              <p className="text-[10px] uppercase tracking-widest text-outline mb-12 italic">{isEditing ? 'Refine your premium instructional content.' : 'Design a new premium learning track.'}</p>

              <form onSubmit={handleSubmitCourse} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Course Title*</label>
                  <input required value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} placeholder="e.g. Java Full Stack Mastery" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-xl font-bold text-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Description*</label>
                  <textarea required value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} placeholder="Describe the course outcomes..." className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent h-28 resize-none text-sm text-slate-600 font-sans leading-relaxed" />
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Star Rating*</label>
                      <input required type="number" step="0.1" max="5" value={courseData.rating} onChange={(e) => setCourseData({...courseData, rating: parseFloat(e.target.value)})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent font-bold text-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Price (₹)*</label>
                      <input required type="number" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: parseInt(e.target.value)})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent font-bold text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Thumbnail URL</label>
                  <input value={courseData.thumbnail} onChange={(e) => setCourseData({...courseData, thumbnail: e.target.value})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent text-[11px] text-outline font-mono" />
                </div>

                <button type="submit" disabled={loading} className="w-full premium-gradient text-white py-5 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:opacity-95 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 mt-6 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Save size={16} /> : null)}
                  {isEditing ? 'Save Changes' : 'Publish Course'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Session Modal */}
      <AnimatePresence>
        {isSessionFormOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface w-full max-w-md p-10 editorial-shadow relative rounded-2xl"
            >
              <button onClick={() => setIsSessionFormOpen(false)} className="absolute right-8 top-8 text-outline hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">{editingSessionId ? 'Edit Session' : 'Add New Session'}</h2>
              <p className="text-[10px] uppercase tracking-widest text-outline mb-12 italic">
                {editingSessionId ? 'Update your Google Drive video link.' : 'Attach a Google Drive video to this course.'}
              </p>

              <form onSubmit={addSession} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Session Name*</label>
                  <input required value={newSession.sessionName} onChange={(e) => setNewSession({...newSession, sessionName: e.target.value})} placeholder="e.g. Introduction to Spring Boot" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-bold text-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Google Drive File ID*</label>
                  <input required value={newSession.driveFileId} onChange={(e) => setNewSession({...newSession, driveFileId: e.target.value})} placeholder="33-character ID from share link" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-mono text-sm" />
                </div>
                <p className="text-[9px] text-outline italic leading-relaxed">Tip: Access the ID from the Drive share URL (e.g., d/1xYz2A.../view)</p>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-6">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Session'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
