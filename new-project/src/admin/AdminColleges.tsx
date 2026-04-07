import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Building2, Users, BookOpen, Loader2, X, GraduationCap, Mail, Lock, ShieldCheck, Send, Edit, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [newCollege, setNewCollege] = useState({
    collegeName: '',
    authorizerName: '',
    email: '',
    password: '',
    studentLimit: 100,
    allowedCourses: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const colRes = await axios.get('/admin/colleges');
      setColleges(colRes.data);
      const courseRes = await axios.get('/microcourses/all');
      setCourses(courseRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCourseToggle = (courseId: string) => {
    setNewCollege(prev => ({
      ...prev,
      allowedCourses: prev.allowedCourses.includes(courseId)
        ? prev.allowedCourses.filter(id => id !== courseId)
        : [...prev.allowedCourses, courseId]
    }));
  };

  const createCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCollege) {
        await axios.put(`/admin/colleges/${editingCollege._id}`, newCollege);
      } else {
        await axios.post('/admin/colleges', newCollege);
      }
      setIsFormOpen(false);
      setEditingCollege(null);
      setNewCollege({ collegeName: '', authorizerName: '', email: '', password: '', studentLimit: 100, allowedCourses: [] });
      fetchData();
    } catch (err) {
      alert('Failed to save college');
    } finally {
      setLoading(false);
    }
  };

  const deleteCollege = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this college? All associated students will also be removed.')) return;
    try {
      await axios.delete(`/admin/colleges/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete college');
    }
  };

  const handleEdit = (college: any) => {
    setEditingCollege(college);
    setNewCollege({
      collegeName: college.collegeName,
      authorizerName: college.authorizerName,
      email: college.email,
      password: college.password,
      studentLimit: college.studentLimit,
      allowedCourses: college.allowedCourses.map((c: any) => c._id || c)
    });
    setIsFormOpen(true);
  };

  const sendCredentials = async (id: string) => {
    try {
      const res = await axios.post(`/admin/colleges/${id}/send-credentials`);
      alert(res.data.message);
    } catch (err) {
      alert('Failed to send credentials');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl text-primary mb-2">College Management</h1>
          <p className="text-on-surface-variant italic font-light">Create and oversee institutional portals and course access.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="premium-gradient text-white px-8 py-3 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-90 shadow-lg active:scale-95 transition-all"
        >
          <Plus size={16} /> Add College
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {loading && colleges.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-outline italic">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading institutions...
            </div>
          ) : colleges.length === 0 ? (
            <div className="col-span-full h-40 flex items-center justify-center text-outline italic border-2 border-dashed border-outline-variant/30 rounded-lg">
              No colleges registered yet.
            </div>
          ) : colleges.map((c) => (
            <motion.div 
              key={c._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 editorial-shadow border-t-4 border-primary flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-primary/5 p-3 rounded-lg text-primary">
                  <Building2 size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(c)}
                    className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-all"
                    title="Edit College"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteCollege(c._id)}
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                    title="Delete College"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => sendCredentials(c._id)}
                    className="flex items-center gap-2 bg-primary/5 hover:bg-primary text-primary hover:text-white px-5 py-3 rounded text-[10px] font-bold tracking-widest uppercase transition-all border border-primary/10 ml-2"
                  >
                    <Send size={14} /> Send Credentials
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-primary mb-1">{c.collegeName}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-6">Auth: {c.authorizerName}</p>
                
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-outline-variant/10">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-outline tracking-widest block">Student Capacity</span>
                    <div className="flex items-center gap-2">
                       <Users size={14} className="text-primary" />
                       <span className="text-sm font-bold">{c.studentsCount} / {c.studentLimit}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-outline tracking-widest block">Allowed Courses</span>
                    <div className="flex items-center gap-2">
                       <BookOpen size={14} className="text-primary" />
                       <span className="text-sm font-bold">{c.allowedCourses?.length || 0} Programs</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add College Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-2xl p-10 editorial-shadow relative overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute right-8 top-8 text-outline hover:text-primary transition-colors">
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#FE4323]/10 text-[#FE4323] p-2 rounded">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h2 className="text-3xl text-primary">{editingCollege ? 'Modify Institution' : 'New Institution'}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold">
                    {editingCollege ? `Updating authority for ${editingCollege.collegeName}` : 'Register a new college partnership'}
                  </p>
                </div>
              </div>

              <form onSubmit={createCollege} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">College Name</label>
                    <input 
                      required 
                      value={newCollege.collegeName}
                      onChange={(e) => setNewCollege({...newCollege, collegeName: e.target.value})}
                      className="w-full border-b border-outline-variant py-3 outline-none focus:border-[#FE4323] transition-colors"
                      placeholder="e.g. Stanford University"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Authorizer Name</label>
                    <input 
                      required 
                      value={newCollege.authorizerName}
                      onChange={(e) => setNewCollege({...newCollege, authorizerName: e.target.value})}
                      className="w-full border-b border-outline-variant py-3 outline-none focus:border-[#FE4323] transition-colors"
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline underline decoration-[#FE4323]/30 decoration-2">Official Email ID</label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={16} />
                      <input 
                        type="email"
                        required 
                        value={newCollege.email}
                        onChange={(e) => setNewCollege({...newCollege, email: e.target.value})}
                        className="w-full border-b border-outline-variant pl-6 py-3 outline-none focus:border-[#FE4323]"
                        placeholder="admin@college.edu"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Access Password</label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={16} />
                      <input 
                        type="text"
                        required 
                        value={newCollege.password}
                        onChange={(e) => setNewCollege({...newCollege, password: e.target.value})}
                        className="w-full border-b border-outline-variant pl-6 py-3 outline-none focus:border-[#FE4323]"
                        placeholder="Set strong password"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-outline block mb-4">Select Courses for Admission</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto p-4 bg-surface-container-low rounded border border-outline-variant/10">
                      {courses.map(course => (
                        <label key={course._id} className="flex items-center gap-3 p-3 bg-white border border-outline-variant/10 rounded cursor-pointer hover:border-[#FE4323]/30 transition-all">
                           <input 
                             type="checkbox"
                             checked={newCollege.allowedCourses.includes(course._id)}
                             onChange={() => handleCourseToggle(course._id)}
                             className="w-4 h-4 accent-[#FE4323]"
                           />
                           <span className="text-xs font-medium text-primary line-clamp-1">{course.title}</span>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-2 max-w-xs">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                       <ShieldCheck size={14} className="text-[#FE4323]" /> Student Enrollment Limit
                    </label>
                    <input 
                      type="number"
                      required 
                      value={newCollege.studentLimit}
                      onChange={(e) => setNewCollege({...newCollege, studentLimit: parseInt(e.target.value)})}
                      className="w-full border-b border-outline-variant py-3 outline-none focus:border-[#FE4323] font-bold text-xl"
                    />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE4323] text-white py-5 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#E03A1C] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : editingCollege ? 'Save Institutional Changes' : 'Register Institution & Courses'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
