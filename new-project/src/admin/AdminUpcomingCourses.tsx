import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar, Target, PlusCircle, Check, Pencil, Save, X } from 'lucide-react';

export default function AdminUpcomingCourses() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [customName, setCustomName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [enrolledCount, setEnrolledCount] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCount, setEditCount] = useState<string>('');

  const fetchUpcoming = async () => {
    try {
      const res = await axios.get('/admin/microcourses/upcoming');
      setUpcoming(res.data);
    } catch (error) {
      console.error('Failed to fetch upcoming courses', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/admin/microcourses/courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUpcoming(), fetchCourses()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    try {
      await axios.post('/admin/microcourses/upcoming', {
        courseName: customName,
        startDate: startDate,
        enrolledCount: parseInt(enrolledCount) || 0,
        isExisting: false
      });
      setCustomName('');
      setStartDate('');
      setEnrolledCount('');
      fetchUpcoming();
    } catch (error) {
      alert('Failed to add upcoming course');
    }
  };

  const handleToggleExisting = async (course: any) => {
    const isAlreadyUpcoming = upcoming.find(u => u.courseId?._id === course._id);
    
    try {
      if (isAlreadyUpcoming) {
        await axios.delete(`/admin/microcourses/upcoming/${isAlreadyUpcoming._id}`);
      } else {
        // For existing courses, we'll use the prompt values if entered, otherwise defaults
        const date = prompt("Starting Date (e.g. 15th April):", "Coming Soon");
        const count = prompt("Estimated Enrollment (for social proof):", "100");
        
        await axios.post('/admin/microcourses/upcoming', {
          courseName: course.title,
          isExisting: true,
          courseId: course._id,
          startDate: date || "Coming Soon",
          enrolledCount: parseInt(count || "0") || 0
        });
      }
      fetchUpcoming();
    } catch (error) {
      alert('Failed to update upcoming course');
    }
  };

  const handleEdit = (u: any) => {
    setEditingId(u._id);
    setEditName(u.courseName);
    setEditDate(u.startDate || '');
    setEditCount((u.enrolledCount || 0).toString());
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`/admin/microcourses/upcoming/${id}`, {
        courseName: editName,
        startDate: editDate,
        enrolledCount: parseInt(editCount) || 0
      });
      setEditingId(null);
      fetchUpcoming();
    } catch (error) {
      alert('Failed to update upcoming course');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this course from the upcoming list?')) return;
    try {
      await axios.delete(`/admin/microcourses/upcoming/${id}`);
      fetchUpcoming();
    } catch (error) {
      alert('Failed to delete upcoming course');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="flex-1 space-y-12">
        
        {/* Existing Courses List */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl text-primary font-bold">Available Courses</h2>
            <p className="text-on-surface-variant italic text-sm">Select existing courses to feature them in the upcoming list.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl editorial-shadow border border-outline-variant/10">
            {courses.length === 0 ? (
              <p className="text-outline italic text-sm text-center py-6">No existing courses found in the database.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((c) => {
                  const isChecked = upcoming.some(u => u.courseId?._id === c._id);
                  return (
                    <div 
                      key={c._id}
                      onClick={() => handleToggleExisting(c)}
                      className={`p-4 rounded-xl border flex items-center cursor-pointer transition-all ${isChecked ? 'bg-primary/5 border-primary/40' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${isChecked ? 'bg-primary text-white' : 'border-2 border-slate-300'}`}>
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">{c.title}</h4>
                        <span className="text-[10px] text-outline font-bold uppercase tracking-widest">{c.tag || 'COURSE'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Custom Course Form */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl text-primary font-bold">Add Custom Course Name</h2>
            <p className="text-on-surface-variant italic text-sm">Manually add a course name that doesn't exist yet.</p>
          </div>

          <form onSubmit={handleAddCustom} className="bg-white p-8 rounded-2xl editorial-shadow border border-outline-variant/10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Course Name*</label>
                <input 
                  required 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Advanced Cybersecurity Frameworks" 
                  className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-lg font-bold text-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Starting Date</label>
                <input 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. 15th April" 
                  className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Enrolled Count</label>
                <input 
                  type="number"
                  value={enrolledCount}
                  onChange={(e) => setEnrolledCount(e.target.value)}
                  placeholder="e.g. 150" 
                  className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent font-medium" 
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="premium-gradient text-white px-12 py-4 rounded-lg text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap shadow-lg shadow-primary/20"
              >
                Add Upcoming Course
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Sidebar: Curated Upcoming List */}
      <div className="lg:w-[400px]">
        <div className="bg-white rounded-2xl editorial-shadow border border-outline-variant/10 p-8 sticky top-8">
          <div className="flex items-center gap-3 mb-8 border-b border-outline-variant/10 pb-4">
            <Calendar className="text-primary w-6 h-6" />
            <h3 className="text-xl font-bold text-primary">Live Upcoming List</h3>
          </div>

          <div className="space-y-6">
            {upcoming.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <Target className="w-12 h-12 mx-auto text-outline mb-3 opacity-30" />
                <p className="text-sm italic">The upcoming courses list is currently empty.</p>
              </div>
            ) : (
              upcoming.map((u, i) => (
                <div key={u._id} className="group relative bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:border-primary/20 transition-all shadow-sm">
                  {editingId === u._id ? (
                    // EDIT MODE
                    <div className="space-y-4">
                       <div className="space-y-1">
                        <label className="text-[8px] font-bold text-outline uppercase tracking-widest">Course Name</label>
                        <input 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border-b border-primary/30 py-1 bg-transparent text-sm font-bold text-primary outline-none focus:border-primary"
                        />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-outline uppercase tracking-widest">Date</label>
                            <input 
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="w-full border-b border-primary/30 py-1 bg-transparent text-xs font-bold text-primary outline-none focus:border-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-bold text-outline uppercase tracking-widest">Enrollment</label>
                            <input 
                              type="number"
                              value={editCount}
                              onChange={(e) => setEditCount(e.target.value)}
                              className="w-full border-b border-primary/30 py-1 bg-transparent text-xs font-bold text-primary outline-none focus:border-primary"
                            />
                          </div>
                       </div>
                       <div className="flex justify-end gap-2 pt-2">
                          <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={16} />
                          </button>
                          <button onClick={() => handleUpdate(u._id)} className="p-2 text-primary hover:text-primary-container transition-colors">
                            <Save size={16} />
                          </button>
                       </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <h4 className="text-base font-bold text-primary leading-tight mb-2">{u.courseName}</h4>
                          {u.isExisting ? (
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Linked Course</span>
                          ) : (
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Custom Title</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(u)}
                            className="text-slate-300 hover:text-primary transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(u._id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[8px] font-bold text-outline uppercase tracking-widest mb-1">Starts</p>
                          <p className="text-xs font-bold text-primary">{u.startDate || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-outline uppercase tracking-widest mb-1">Enrolled</p>
                          <p className="text-xs font-bold text-primary">{u.enrolledCount || 0}+</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
