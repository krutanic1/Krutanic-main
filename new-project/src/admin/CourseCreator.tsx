import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Play, Layout, Video, Loader2, X, PlusCircle, Save } from 'lucide-react';
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
      // Re-select course to show updated sessions
      const res = await axios.get('/admin/microcourses/courses');
      const updated = res.data.find((c: any) => c._id === selectedCourse._id);
      setSelectedCourse(updated);
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
      const res = await axios.get('/admin/microcourses/courses');
      const updated = res.data.find((c: any) => c._id === selectedCourse._id);
      setSelectedCourse(updated);
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

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl text-primary mb-2">Manage Courses</h1>
            <p className="text-on-surface-variant italic font-light italic">Curate elite micro-learning experiences.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="premium-gradient text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-90 shadow-lg"
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
              className={`bg-white editorial-shadow group relative overflow-hidden flex flex-col md:flex-row h-auto md:h-48 border transition-all hover:border-primary/20 ${selectedCourse?._id === c._id ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.02]' : 'border-outline-variant/10'}`}
            >
              {/* Compact Thumbnail */}
              <div className="w-full md:w-72 h-40 md:h-full bg-stone-100 overflow-hidden relative border-r border-outline-variant/5">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
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

              {/* Course Info - Horizontal layout */}
              <div className="p-6 flex flex-col md:flex-row flex-grow items-center gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-primary font-bold leading-tight">{c.title}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-primary font-bold px-2 py-0.5 bg-primary/5 rounded">
                      {c.rating || 4.8}★
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant font-light italic line-clamp-1 mb-4 opacity-70">
                    "{c.description}"
                  </p>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-outline font-bold">Curriculum</span>
                      <span className="text-xs font-bold text-primary">{c.sessions?.length || 0} Sessions</span>
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
                    className={`px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${selectedCourse?._id === c._id ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-primary hover:bg-primary hover:text-white'}`}
                  >
                    Manage Curriculum <Play size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sessions Sidebar */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="lg:w-1/3 bg-stone-50 p-8 border-l border-outline-variant/10 min-h-[600px] flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl text-primary mb-2">Curriculum</h2>
                <p className="text-[10px] uppercase tracking-widest text-outline font-bold">{selectedCourse.title}</p>
              </div>
              <button 
                onClick={() => setIsSessionFormOpen(true)}
                className="text-primary hover:opacity-70 transition-opacity p-2"
                title="Add Session"
              >
                <PlusCircle size={24} />
              </button>
            </div>

            <div className="flex-grow space-y-4">
              {selectedCourse.sessions?.length === 0 ? (
                <div className="text-center py-20 text-outline text-xs italic">
                  No sessions added to this course yet.
                </div>
              ) : selectedCourse.sessions.map((s: any, i: number) => (
                <div key={i} className="bg-white p-6 border border-outline-variant/10 hover:border-primary/30 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 text-primary rounded-full flex items-center justify-center font-serif">
                      {i + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-tight">{s.sessionName}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-outline font-mono">
                        <Video size={10} /> {s.driveFileId.substring(0, 15)}...
                      </div>
                    </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleEditSession(s)}
                          className="text-slate-400 hover:text-primary p-2 transition-colors"
                          title="Edit Session"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => deleteSession(s._id)}
                          className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 size={12} />
                        </button>
                        <a 
                          href={`https://drive.google.com/file/d/${s.driveFileId}/view`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary opacity-40 group-hover:opacity-100 transition-opacity p-2"
                        >
                          <Play size={16} fill="currentColor" />
                        </a>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
               onClick={() => setSelectedCourse(null)}
               className="mt-12 text-xs font-bold tracking-widest uppercase text-outline hover:text-red-500 transition-colors w-full text-center"
            >
              Close Panel
            </button>
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
              className="bg-surface w-full max-w-lg p-8 editorial-shadow relative"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute right-6 top-6 text-outline hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-3xl text-primary mb-2">{isEditing ? 'Edit MicroCourse' : 'Create MicroCourse'}</h2>
              <p className="text-[10px] uppercase tracking-widest text-outline mb-10 italic">{isEditing ? 'Refine your premium instructional content.' : 'Design a new premium learning track.'}</p>

              <form onSubmit={handleSubmitCourse} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Course Title*</label>
                  <input required value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} placeholder="e.g. Java Full Stack Mastery" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-xl text-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Description*</label>
                  <textarea required value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} placeholder="Describe the course outcomes..." className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent h-24 resize-none italic font-light font-sans" />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Star Rating*</label>
                      <input required type="number" step="0.1" max="5" value={courseData.rating} onChange={(e) => setCourseData({...courseData, rating: parseFloat(e.target.value)})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Course Price (₹)*</label>
                      <input required type="number" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: parseInt(e.target.value)})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent font-bold" />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Thumbnail URL</label>
                  <input value={courseData.thumbnail} onChange={(e) => setCourseData({...courseData, thumbnail: e.target.value})} className="w-full border-b border-outline-variant py-2 outline-none focus:border-primary transition-colors bg-transparent text-xs text-outline" />
                </div>

                <button type="submit" disabled={loading} className="w-full premium-gradient text-white py-4 rounded text-xs font-bold tracking-widest uppercase hover:bg-stone-800 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2">
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
              className="bg-surface w-full max-w-md p-8 editorial-shadow relative"
            >
              <button onClick={() => setIsSessionFormOpen(false)} className="absolute right-6 top-6 text-outline hover:text-primary transition-colors">
                <X size={20} />
              </button>

              <h2 className="text-3xl text-primary mb-2">{editingSessionId ? 'Edit Session' : 'Add New Session'}</h2>
              <p className="text-[10px] uppercase tracking-widest text-outline mb-10 italic">
                {editingSessionId ? 'Update your Google Drive video link.' : 'Attach a Google Drive video to this course.'}
              </p>

              <form onSubmit={addSession} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Session Name*</label>
                  <input required value={newSession.sessionName} onChange={(e) => setNewSession({...newSession, sessionName: e.target.value})} placeholder="e.g. Introduction to Spring Boot" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Google Drive File ID*</label>
                  <input required value={newSession.driveFileId} onChange={(e) => setNewSession({...newSession, driveFileId: e.target.value})} placeholder="The 33-character ID from the share link" className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-mono text-sm" />
                </div>
                <p className="text-[9px] text-outline italic">Tip: The ID is the long string in the Drive share URL (e.g., 1xYz2A...)</p>
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Session'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
