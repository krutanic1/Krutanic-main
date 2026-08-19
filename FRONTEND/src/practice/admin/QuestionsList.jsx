import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import DifficultyBadge from '../components/DifficultyBadge';
import { Plus, Search, SlidersHorizontal, Edit2, Trash2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const typeConfig = {
  mcq: { label: 'MCQ', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  coding: { label: 'Coding', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

const QuestionsList = () => {
  const { practiceApi, isAdmin } = usePracticeAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1, limit: 20 });

  const [filters, setFilters] = useState({
    search: '', type: '', difficulty: '', status: '', pathId: '', page: 1,
  });

  useEffect(() => {
    if (!isAdmin) navigate('/practice');
    practiceApi.get('/admin/practice-paths').then(r => setPaths(r.data.paths || [])).catch(() => {});
  }, [isAdmin, navigate, practiceApi]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const res = await practiceApi.get(`/admin/questions?${params.toString()}`);
      setQuestions(res.data.questions || []);
      setPagination({ page: res.data.page, total: res.data.total, totalPages: res.data.totalPages, limit: res.data.limit });
    } catch {
      toast.error('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  }, [filters, practiceApi]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this question and all user progress for it?')) return;
    try {
      await practiceApi.delete(`/admin/questions/${id}`);
      toast.success('Question deleted.');
      fetchQuestions();
    } catch { toast.error('Failed to delete question.'); }
  };

  const handleTogglePublish = async (q) => {
    try {
      await practiceApi.put(`/admin/questions/${q._id}`, { isPublished: !q.isPublished });
      toast.success(q.isPublished ? 'Unpublished.' : 'Published!');
      fetchQuestions();
    } catch { toast.error('Failed to update.'); }
  };

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val, page: 1 }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 admin-content-wrap !p-0">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/practice" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-slate-800 dark:text-white">Questions</h1>
              <p className="text-xs text-slate-400">{pagination.total} total questions</p>
            </div>
          </div>
          <Link to="/admin/practice/questions/new" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
            <Plus size={14} /> New Question
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 placeholder-slate-400 w-48" />
          </div>
          <select value={filters.pathId} onChange={(e) => setFilter('pathId', e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
            <option value="">All Paths</option>
            {paths.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
            <option value="">All Types</option>
            <option value="mcq">MCQ</option>
            <option value="coding">Coding</option>
          </select>
          <select value={filters.difficulty} onChange={(e) => setFilter('difficulty', e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />)}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm font-medium">No questions found.</p>
              <Link to="/admin/practice/questions/new" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 block">Create one →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Difficulty</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Path</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Attempts</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {questions.map((q) => {
                    const type = typeConfig[q.type] || typeConfig['mcq'];
                    return (
                      <tr key={q._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 dark:text-white text-xs line-clamp-1">{q.title}</p>
                          <p className="text-slate-400 text-xs font-mono">{q.slug}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${type.className}`}>{type.label}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell"><DifficultyBadge difficulty={q.difficulty} size="xs" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{q.practicePath?.title}</span>
                        </td>
                        <td className="px-4 py-3 text-center hidden md:table-cell">
                          <span className="text-xs text-slate-500">{q.attemptCount || 0} / {q.solveCount || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleTogglePublish(q)}
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${q.isPublished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                            {q.isPublished ? 'Live' : 'Draft'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/practice/questions/${q._id}/edit`}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" aria-label="Edit">
                              <Edit2 size={13} />
                            </Link>
                            <button onClick={() => handleDelete(q._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" aria-label="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page <= 1}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={15} className="text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium px-2">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight size={15} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;
