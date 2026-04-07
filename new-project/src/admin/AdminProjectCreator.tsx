import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, PlusCircle, Save, Loader2, BookOpen, Clock, Layout, ChevronRight, Edit, Trash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProjectCreator() {
  const [courses, setCourses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const [projectData, setProjectData] = useState({
    projectName: '',
    description: '',
    lockAfterSessions: 2,
    days: [
      { dayNumber: 1, topic: '', description: '' }
    ]
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

  const fetchProjects = async (courseId: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/admin/microcourses/course/${courseId}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchProjects(selectedCourseId);
    }
  }, [selectedCourseId]);

  const addDay = () => {
    setProjectData({
      ...projectData,
      days: [...projectData.days, { dayNumber: projectData.days.length + 1, topic: '', description: '' }]
    });
  };

  const removeDay = (index: number) => {
    const updatedDays = projectData.days.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 }));
    setProjectData({ ...projectData, days: updatedDays });
  };

  const handleDayChange = (index: number, field: string, value: string) => {
    const updatedDays = [...projectData.days];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setProjectData({ ...projectData, days: updatedDays });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return alert('Select a course first');
    setLoading(true);
    try {
      if (editingProjectId) {
        await axios.put(`/admin/microcourses/projects/${editingProjectId}`, {
          ...projectData,
          courseId: selectedCourseId
        });
        alert('Project updated successfully');
      } else {
        await axios.post('/admin/microcourses/projects', {
          ...projectData,
          courseId: selectedCourseId
        });
        alert('Project created successfully');
      }
      setEditingProjectId(null);
      setProjectData({
        projectName: '',
        description: '',
        lockAfterSessions: 2,
        days: [{ dayNumber: 1, topic: '', description: '' }]
      });
      fetchProjects(selectedCourseId);
    } catch (err) {
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Delete this project? This will affect all enrolled students.')) return;
    try {
      await axios.delete(`/admin/microcourses/projects/${id}`);
      fetchProjects(selectedCourseId);
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleEdit = (project: any) => {
    setEditingProjectId(project._id);
    setProjectData({
      projectName: project.projectName,
      description: project.description || '',
      lockAfterSessions: project.lockAfterSessions,
      days: project.days.map((d: any) => ({
        dayNumber: d.dayNumber,
        topic: d.topic,
        description: d.description
      }))
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif text-academic-dark mb-4 drop-shadow-sm">Project & Diary Manager</h1>
        <p className="text-academic-gray font-serif italic italic font-light italic">Define compulsory projects and daily scholarly tasks.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Creation Form */}
        <div className="bg-white p-10 border border-outline-variant/10 shadow-[0_15px_50px_rgba(0,121,107,0.05)] ring-1 ring-emerald-50 rounded-sm">
          <h2 className="text-2xl font-serif text-academic-dark mb-8 flex items-center justify-between">
            <span className="flex items-center gap-3">
              <PlusCircle className={editingProjectId ? "text-blue-600" : "text-emerald-600"} size={24} /> 
              {editingProjectId ? 'Modify Project' : 'Create New Project'}
            </span>
            {editingProjectId && (
               <button 
                type="button"
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectData({ projectName: '', lockAfterSessions: 2, days: [{ dayNumber: 1, topic: '', description: '' }] });
                }}
                className="text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-700 flex items-center gap-1"
               >
                 <X size={14} /> Cancel Edit
               </button>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-academic-gray">Target Micro Course</label>
              <select 
                value={selectedCourseId} 
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full border-b border-outline-variant py-3 outline-none focus:border-emerald-600 transition-colors bg-transparent text-lg font-serif italic text-academic-dark"
                required
              >
                <option value="">Select a Course...</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-academic-gray">Project Title</label>
              <input 
                required 
                value={projectData.projectName} 
                onChange={(e) => setProjectData({...projectData, projectName: e.target.value})} 
                placeholder="e.g. Full Stack Capstone" 
                className="w-full border-b border-outline-variant py-3 outline-none focus:border-emerald-600 transition-colors bg-transparent text-xl font-bold text-academic-dark"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-academic-gray">Compulsory After (Sessions)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  required 
                  min="1"
                  value={projectData.lockAfterSessions} 
                  onChange={(e) => setProjectData({...projectData, lockAfterSessions: parseInt(e.target.value)})} 
                  className="w-24 border-b border-outline-variant py-3 outline-none focus:border-emerald-600 transition-colors bg-transparent text-xl font-bold text-academic-dark text-center"
                />
                <span className="text-xs text-academic-gray italic">Student must complete this project to watch session {projectData.lockAfterSessions + 1} and beyond.</span>
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-academic-dark uppercase">Daily Scholarly Tasks</h3>
                <button type="button" onClick={addDay} className="text-emerald-600 hover:text-emerald-800 transition-colors">
                  <PlusCircle size={20} />
                </button>
              </div>

              <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {projectData.days.map((day, index) => (
                  <div key={index} className="p-6 bg-academic-light-gray/30 relative group border border-transparent hover:border-emerald-100 transition-all rounded-sm">
                    {projectData.days.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeDay(index)} 
                        className="absolute top-4 right-4 text-academic-gray/30 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Day {day.dayNumber}</div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold tracking-widest uppercase text-academic-gray">Task Topic</label>
                         <input 
                           required 
                           value={day.topic} 
                           onChange={(e) => handleDayChange(index, 'topic', e.target.value)} 
                           placeholder="Enter topic name..." 
                           className="w-full border-b border-outline-variant py-2 outline-none focus:border-emerald-600 transition-colors bg-transparent text-sm font-bold text-academic-dark"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold tracking-widest uppercase text-academic-gray">Detailed Description</label>
                         <textarea 
                           required 
                           value={day.description} 
                           onChange={(e) => handleDayChange(index, 'description', e.target.value)} 
                           placeholder="Describe the scholarly requirements for this day..." 
                           className="w-full border-b border-outline-variant py-2 outline-none focus:border-emerald-600 transition-colors bg-transparent text-xs font-light italic h-24 resize-none"
                         />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full academic-button-filled mt-8 flex items-center justify-center gap-3 ${editingProjectId ? 'bg-blue-700 hover:bg-blue-800' : 'bg-emerald-700 hover:bg-emerald-800'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {editingProjectId ? 'Update Project Requirements' : 'Publish Project Requirements'}
            </button>
          </form>
        </div>

        {/* List of Existing Projects */}
        <div className="bg-academic-light-gray/20 p-10 border border-outline-variant/10 rounded-sm overflow-hidden flex flex-col h-full">
          <h2 className="text-2xl font-serif text-academic-dark mb-8 flex items-center gap-3">
             <Layout className="text-academic-gray" size={24} /> Course Projects
          </h2>

          <div className="flex-grow space-y-6 overflow-y-auto no-scrollbar">
            {!selectedCourseId ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 text-academic-gray/40">
                <BookOpen size={48} className="mb-6 opacity-20" />
                <p className="font-serif italic font-light">Select a course to view established projects.</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 text-academic-gray/40">
                <Clock size={48} className="mb-6 opacity-20" />
                <p className="font-serif italic font-light">No projects defined for this learner path.</p>
              </div>
            ) : (
              projects.map((p) => (
                <div key={p._id} className="bg-white p-8 border-l-4 border-emerald-600 shadow-lg relative group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-serif text-academic-dark">{p.projectName}</h3>
                      {p.description && <p className="text-xs text-academic-gray italic line-clamp-1 mt-1">"{p.description}"</p>}
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2">Compulsory after {p.lockAfterSessions} sessions</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="p-2 text-academic-gray opacity-30 hover:opacity-100 hover:text-emerald-600 transition-all"
                        title="Edit Project"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                         onClick={() => deleteProject(p._id)}
                         className="p-2 text-academic-gray opacity-30 hover:opacity-100 hover:text-rose-500 transition-all"
                         title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-[9px] font-bold text-academic-gray uppercase tracking-[0.2em] border-b border-emerald-50 pb-2 mb-4">Milestone Schedule</div>
                    {p.days.map((d: any) => (
                      <div key={d._id} className="flex gap-4">
                        <div className="text-[9px] font-bold text-emerald-600 w-8">D{d.dayNumber}</div>
                        <div>
                          <div className="text-xs font-bold text-academic-dark">{d.topic}</div>
                          <p className="text-[10px] text-academic-gray font-light mt-1 line-clamp-1 italic">{d.description}</p>
                        </div>
                      </div>
                    ))}
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
