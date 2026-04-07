import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Users, Mail, Lock, Loader2, X, GraduationCap, ShieldCheck, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollegeStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const collegeId = localStorage.getItem('collegeId');
  const collegeName = localStorage.getItem('collegeName');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    password: '',
    enrolledCourses: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const studRes = await axios.get(`/college/${collegeId}/students`);
      setStudents(studRes.data);
      const courseRes = await axios.get(`/college/${collegeId}/courses`);
      setCourses(courseRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collegeId]);

  const handleCourseToggle = (courseId: string) => {
    setNewStudent(prev => ({
      ...prev,
      enrolledCourses: prev.enrolledCourses.includes(courseId)
        ? prev.enrolledCourses.filter(id => id !== courseId)
        : [...prev.enrolledCourses, courseId]
    }));
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (newStudent.enrolledCourses.length === 0) {
        alert('Please select at least one course');
        return;
      }
      await axios.post(`/college/${collegeId}/add-student`, newStudent);
      setIsFormOpen(false);
      setNewStudent({ fullName: '', email: '', password: '', enrolledCourses: [] });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  const sendCredentials = async (id: string) => {
    setSendingId(id);
    try {
      const res = await axios.post(`/college/students/${id}/send-credentials`);
      alert(res.data.message);
    } catch (err) {
      alert('Failed to send credentials');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-5xl text-primary font-serif italic mb-3">Student Roster</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#FE4323] font-bold">
            {collegeName || 'Institution'} Portal • Access Credentials Management
          </p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          className="premium-gradient text-white px-10 py-4 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-3 hover:opacity-90 shadow-2xl active:scale-95 transition-all"
        >
          <Plus size={18} /> New Student Enrollment
        </button>
      </div>

      <div className="bg-white editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/10">
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-outline">Student Details</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-outline">Email Address</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-outline">Course Access</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-outline italic">
                     <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                     Loading student data...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-outline italic">
                     No students enrolled yet. Start by adding your first student.
                  </td>
                </tr>
              ) : students.map((s) => (
                <tr key={s._id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {s.fullName.charAt(0)}
                      </div>
                      <span className="font-bold text-primary">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-on-surface-variant font-light italic">{s.email}</td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-2">
                       {s.enrolledCourses?.length} Courses Assigned
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => sendCredentials(s._id)}
                      disabled={sendingId === s._id}
                      className="inline-flex items-center gap-2 bg-[#FE4323]/5 text-[#FE4323] hover:bg-[#FE4323] hover:text-white px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-all border border-[#FE4323]/20 disabled:opacity-50"
                    >
                      {sendingId === s._id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {sendingId === s._id ? 'Sending...' : 'Send Credentials'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl p-12 editorial-shadow relative overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute right-10 top-10 text-outline hover:text-primary transition-colors">
                <X size={28} />
              </button>

              <div className="flex items-center gap-4 mb-12">
                <div className="bg-[#FE4323]/10 text-[#FE4323] p-3 rounded-lg">
                  <Plus size={32} />
                </div>
                <div>
                  <h2 className="text-4xl text-primary font-serif italic">Student Enrollment</h2>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Onboard a new student to your institution</p>
                </div>
              </div>

              <form onSubmit={createStudent} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Full Legal Name</label>
                    <input 
                      required 
                      value={newStudent.fullName}
                      onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                      className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary text-xl font-light italic"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline underline decoration-[#FE4323]/30">Academic Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={18} />
                      <input 
                        type="email"
                        required 
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                        className="w-full border-b border-outline-variant pl-8 py-3 outline-none focus:border-primary text-xl font-light"
                        placeholder="jane@university.edu"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Access Password</label>
                    <div className="relative">
                      <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-outline" size={18} />
                      <input 
                        type="text"
                        required 
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                        className="w-full border-b border-outline-variant pl-8 py-3 outline-none focus:border-primary text-xl font-light"
                        placeholder="Generate secure password"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold tracking-widest uppercase text-outline flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#FE4323]" /> Enrollment Status
                     </label>
                     <div className="py-3 text-sm text-on-surface-variant font-medium flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" /> Authorized for Admission
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-outline block mb-6">Assign Approved Curriculum</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-6 bg-surface-container-low rounded-lg border border-outline-variant/10">
                      {courses.map(course => (
                        <label key={course._id} className="flex items-center gap-4 p-4 bg-white border border-outline-variant/10 rounded-lg cursor-pointer hover:border-[#FE4323]/40 hover:shadow-md transition-all group">
                           <input 
                             type="checkbox"
                             checked={newStudent.enrolledCourses.includes(course._id)}
                             onChange={() => handleCourseToggle(course._id)}
                             className="w-5 h-5 accent-[#FE4323] cursor-pointer"
                           />
                           <div className="flex-1">
                              <span className="text-xs font-bold text-primary block group-hover:text-[#FE4323] transition-colors">{course.title}</span>
                              <span className="text-[9px] uppercase font-bold text-outline tracking-tighter italic">{course.duration} ACCESS</span>
                           </div>
                        </label>
                      ))}
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FE4323] text-white py-6 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-[#E03A1C] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 mt-8"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Finalize Student Enrollment'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
