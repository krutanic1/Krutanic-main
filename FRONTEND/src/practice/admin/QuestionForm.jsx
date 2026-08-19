import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { Save, ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TYPES = ['mcq', 'coding'];
const LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'c', 'sql', 'typescript', 'go', 'rust'];

const QuestionForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { practiceApi, isAdmin } = usePracticeAuth();
  const navigate = useNavigate();

  const [paths, setPaths] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    practicePath: '', topic: '', subtopic: '',
    title: '', slug: '', type: 'mcq', difficulty: 'Easy',
    statement: '', codeSnippet: '', codeLanguage: 'python',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: '', tags: '', order: 0, isPublished: false,
  });

  useEffect(() => {
    if (!isAdmin) { navigate('/practice'); return; }
    // Load paths
    practiceApi.get('/admin/practice-paths').then(r => setPaths(r.data.paths || [])).catch(() => {});
    // If edit, load question
    if (isEdit) {
      practiceApi.get(`/admin/questions/${id}`)
        .then(r => {
          const q = r.data.question;
          setForm({
            ...q,
            practicePath: q.practicePath?._id || q.practicePath,
            topic: q.topic?._id || q.topic,
            subtopic: q.subtopic?._id || q.subtopic,
            tags: (q.tags || []).join(', '),
          });
          // Load chain
          return Promise.all([
            practiceApi.get(`/admin/practice/topics?pathId=${q.practicePath?._id || q.practicePath}`),
            practiceApi.get(`/admin/practice/subtopics?topicId=${q.topic?._id || q.topic}`),
          ]);
        })
        .then(([tr, sr]) => {
          setTopics(tr.data.topics || []);
          setSubtopics(sr.data.subtopics || []);
        })
        .catch(() => toast.error('Failed to load question.'));
    }
  }, [id, isEdit, isAdmin, navigate, practiceApi]);

  const handlePathChange = async (e) => {
    const pathId = e.target.value;
    setForm(prev => ({ ...prev, practicePath: pathId, topic: '', subtopic: '' }));
    setTopics([]);
    setSubtopics([]);
    if (pathId) {
      const res = await practiceApi.get(`/admin/practice/topics?pathId=${pathId}`);
      setTopics(res.data.topics || []);
    }
  };

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    setForm(prev => ({ ...prev, topic: topicId, subtopic: '' }));
    setSubtopics([]);
    if (topicId) {
      const res = await practiceApi.get(`/admin/practice/subtopics?topicId=${topicId}`);
      setSubtopics(res.data.subtopics || []);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOptionChange = (idx, field, value) => {
    setForm(prev => {
      const opts = [...prev.options];
      if (field === 'isCorrect') {
        opts.forEach((o, i) => { o.isCorrect = i === idx; }); // radio behavior
      } else {
        opts[idx] = { ...opts[idx], [field]: value };
      }
      return { ...prev, options: opts };
    });
  };

  const addOption = () => setForm(prev => ({ ...prev, options: [...prev.options, { text: '', isCorrect: false }] }));
  const removeOption = (idx) => setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev, title,
      slug: prev.slug || title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.type === 'mcq' && !form.options.some(o => o.isCorrect)) {
      toast.error('Please mark one option as correct.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await practiceApi.put(`/admin/questions/${id}`, payload);
        toast.success('Question updated!');
      } else {
        await practiceApi.post('/admin/questions', payload);
        toast.success('Question created!');
      }
      navigate('/admin/practice/questions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 admin-content-wrap !p-0">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/admin/practice/questions" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <h1 className="text-sm font-bold text-slate-800 dark:text-white">
            {isEdit ? 'Edit Question' : 'New Question'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hierarchy */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Practice Path *</label>
                <select name="practicePath" value={form.practicePath} onChange={handlePathChange} required
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
                  <option value="">Select path...</option>
                  {paths.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Topic *</label>
                <select name="topic" value={form.topic} onChange={handleTopicChange} required disabled={!form.practicePath}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 disabled:opacity-50">
                  <option value="">Select topic...</option>
                  {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Subtopic *</label>
                <select name="subtopic" value={form.subtopic} onChange={handleChange} required disabled={!form.topic}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 disabled:opacity-50">
                  <option value="">Select subtopic...</option>
                  {subtopics.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Question Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleTitleChange} required
                  placeholder="e.g. Sum and Print - MCQ"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Slug *</label>
                <input type="text" name="slug" value={form.slug} onChange={handleChange} required
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Type *</label>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Difficulty *</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Question Statement *</label>
                <textarea name="statement" value={form.statement} onChange={handleChange} required rows={4}
                  placeholder="Write the question statement here..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Code Language</label>
                <select name="codeLanguage" value={form.codeLanguage} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Tags (comma-separated)</label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="python, output, beginner"
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Code Snippet (optional)</label>
                <textarea name="codeSnippet" value={form.codeSnippet} onChange={handleChange} rows={4}
                  placeholder="print(21 + 40)"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-emerald-400 placeholder-slate-600 resize-none" />
              </div>
            </div>
          </div>

          {/* MCQ Options */}
          {form.type === 'mcq' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200">Answer Options</h2>
                <button type="button" onClick={addOption}
                  className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  <Plus size={13} /> Add Option
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4">Click the radio button on the left to mark the correct answer.</p>
              <div className="space-y-3">
                {form.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${opt.isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-600' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                    <input type="radio" name="correctOption" checked={opt.isCorrect} onChange={() => handleOptionChange(idx, 'isCorrect', true)}
                      className="w-4 h-4 text-emerald-600 flex-shrink-0 cursor-pointer accent-emerald-600" aria-label={`Mark option ${optionLabels[idx]} as correct`} />
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'}`}>
                      {optionLabels[idx]}
                    </span>
                    <input type="text" value={opt.text} onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                      placeholder={`Option ${optionLabels[idx]}...`} required
                      className="flex-1 px-3 py-2 text-sm bg-transparent border-0 focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400" />
                    {form.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(idx)}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Explanation</h2>
            <textarea name="explanation" value={form.explanation} onChange={handleChange} rows={4}
              placeholder="Explain why the correct answer is correct..."
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none" />
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Display Order</label>
                <input type="number" name="order" value={form.order} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="sr-only" />
                    <div className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Published</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-8">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : isEdit ? 'Update Question' : 'Create Question'}
            </button>
            <Link to="/admin/practice/questions" className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
