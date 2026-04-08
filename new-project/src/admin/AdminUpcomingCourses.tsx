import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar, Target, PlusCircle, Check } from 'lucide-react';

export default function AdminUpcomingCourses() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(true);

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
        isExisting: false
      });
      setCustomName('');
      fetchUpcoming();
    } catch (error) {
      alert('Failed to add upcoming course');
    }
  };

  const handleToggleExisting = async (course: any) => {
    const isAlreadyUpcoming = upcoming.find(u => u.courseId?._id === course._id);
    
    try {
      if (isAlreadyUpcoming) {
        // Remove it
        await axios.delete(`/admin/microcourses/upcoming/${isAlreadyUpcoming._id}`);
      } else {
        // Add it
        await axios.post('/admin/microcourses/upcoming', {
          courseName: course.title,
          isExisting: true,
          courseId: course._id
        });
      }
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

          <form onSubmit={handleAddCustom} className="bg-white p-8 rounded-2xl editorial-shadow border border-outline-variant/10 flex items-end gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-outline">Course Name*</label>
              <input 
                required 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Advanced Cybersecurity Frameworks" 
                className="w-full border-b border-outline-variant py-3 outline-none focus:border-primary transition-colors bg-transparent text-lg font-bold text-primary" 
              />
            </div>
            <button 
              type="submit" 
              className="premium-gradient text-white px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap mb-1"
            >
              Add Upcoming
            </button>
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

          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <Target className="w-12 h-12 mx-auto text-outline mb-3 opacity-30" />
                <p className="text-sm italic">The upcoming courses list is currently empty.</p>
              </div>
            ) : (
              upcoming.map((u, i) => (
                <div key={u._id} className="group relative bg-slate-50 border border-slate-100 p-4 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-bold text-primary leading-tight mb-1">{u.courseName}</h4>
                      {u.isExisting ? (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Linked Course</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Custom Title</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(u._id)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
