import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { ChevronRight, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400"
    />
  </div>
);

const PathForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { practiceApi, isAdmin } = usePracticeAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', slug: '', description: '', level: 'Beginner',
    themeColor: '#3b82f6', gradientFrom: '#3b82f6', gradientTo: '#1d4ed8',
    estimatedDuration: '', order: 0, isPublished: false, image: '', icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/practice'); return; }
    if (isEdit) {
      setLoading(true);
      practiceApi.get('/admin/practice-paths')
        .then(res => {
          const path = res.data.paths?.find(p => p._id === id);
          if (path) setForm({ ...path });
          else toast.error('Path not found.');
        })
        .catch(() => toast.error('Failed to load path.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, isAdmin, navigate, practiceApi]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await practiceApi.put(`/admin/practice-paths/${id}`, form);
        toast.success('Practice path updated!');
      } else {
        await practiceApi.post('/admin/practice-paths', form);
        toast.success('Practice path created!');
      }
      navigate('/admin/practice');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save path.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center admin-content-wrap !p-0"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 admin-content-wrap !p-0">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/admin/practice" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-800 dark:text-white">
              {isEdit ? 'Edit Practice Path' : 'New Practice Path'}
            </h1>
            <nav className="text-xs text-slate-400 flex items-center gap-1">
              <Link to="/admin/practice" className="hover:text-blue-600">Admin</Link>
              <ChevronRight size={10} />
              <span>{isEdit ? 'Edit Path' : 'New Path'}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-5">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Path Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="title" value={form.title} onChange={handleTitleChange} required
                  placeholder="e.g. Practice Python"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400"
                />
              </div>
              <InputField label="Slug" name="slug" value={form.slug} onChange={handleChange} required placeholder="practice-python" />
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Level <span className="text-red-500">*</span>
                </label>
                <select name="level" value={form.level} onChange={handleChange} className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} required rows={3}
                  placeholder="Describe this practice path..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none"
                />
              </div>
              <InputField label="Estimated Duration" name="estimatedDuration" value={form.estimatedDuration} onChange={handleChange} placeholder="e.g. 8 hours" />
              <InputField label="Display Order" name="order" value={form.order} onChange={handleChange} type="number" placeholder="0" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-5">Appearance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Theme Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="themeColor" value={form.themeColor} onChange={handleChange}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer" />
                  <input type="text" name="themeColor" value={form.themeColor} onChange={handleChange}
                    className="flex-1 px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Gradient From</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="gradientFrom" value={form.gradientFrom} onChange={handleChange}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer" />
                  <input type="text" name="gradientFrom" value={form.gradientFrom} onChange={handleChange}
                    className="flex-1 px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Gradient To</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="gradientTo" value={form.gradientTo} onChange={handleChange}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer" />
                  <input type="text" name="gradientTo" value={form.gradientTo} onChange={handleChange}
                    className="flex-1 px-3 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-mono" />
                </div>
              </div>

              {/* Preview */}
              <div className="sm:col-span-3">
                <p className="text-xs text-slate-400 mb-2">Preview:</p>
                <div className="h-16 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})` }}>
                  {form.title || 'Path Name'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Publishing</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Published</p>
                <p className="text-xs text-slate-400">Visible to all logged-in practice users</p>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : isEdit ? 'Update Path' : 'Create Path'}
            </button>
            <Link to="/admin/practice" className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PathForm;
