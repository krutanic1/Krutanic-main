import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { BookOpen, Layers, AlignLeft, HelpCircle, Users, CheckCircle2, TrendingUp, Plus, Settings, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{value ?? '—'}</p>
  </div>
);

const PracticeAdminDashboard = () => {
  const { practiceApi, isAdmin } = usePracticeAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      if (!practiceApi.defaults.headers.Authorization) {
        toast.error('Please log in as an Admin first.');
        navigate('/practice/login', { state: { from: { pathname: '/admin/practice' } } });
      } else {
        toast.error('Admin access required.');
        navigate('/practice');
      }
    }
  }, [isAdmin, navigate, practiceApi]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, pathsRes] = await Promise.all([
        practiceApi.get('/admin/practice/stats'),
        practiceApi.get('/admin/practice-paths'),
      ]);
      setStats(statsRes.data);
      setPaths(pathsRes.data.paths || []);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [practiceApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeletePath = async (id) => {
    if (!confirm('Delete this practice path and all its data? This cannot be undone.')) return;
    try {
      await practiceApi.delete(`/admin/practice-paths/${id}`);
      toast.success('Practice path deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete path.');
    }
  };

  const handleTogglePublish = async (path) => {
    try {
      await practiceApi.put(`/admin/practice-paths/${path._id}`, { isPublished: !path.isPublished });
      toast.success(path.isPublished ? 'Path unpublished.' : 'Path published!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update path.');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 admin-content-wrap !p-0">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Practice Admin</h1>
            <p className="text-xs text-slate-400">Manage practice paths, topics, and questions</p>
          </div>
          <Link
            to="/admin/practice/paths/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus size={15} />
            New Path
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard icon={<BookOpen size={18} className="text-blue-600" />} label="Paths" value={stats?.totalPaths} color="bg-blue-100 dark:bg-blue-900/30" />
          <StatCard icon={<HelpCircle size={18} className="text-purple-600" />} label="Questions" value={stats?.totalQuestions} color="bg-purple-100 dark:bg-purple-900/30" />
          <StatCard icon={<CheckCircle2 size={18} className="text-emerald-600" />} label="Published" value={stats?.publishedQuestions} color="bg-emerald-100 dark:bg-emerald-900/30" />
          <StatCard icon={<Users size={18} className="text-amber-600" />} label="Users" value={stats?.totalUsers} color="bg-amber-100 dark:bg-amber-900/30" />
          <StatCard icon={<TrendingUp size={18} className="text-rose-600" />} label="Attempts" value={stats?.totalAttempts} color="bg-rose-100 dark:bg-rose-900/30" />
          <StatCard icon={<CheckCircle2 size={18} className="text-indigo-600" />} label="Solved" value={stats?.totalSolved} color="bg-indigo-100 dark:bg-indigo-900/30" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/practice/questions/new" className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Plus size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">New Question</p>
              <p className="text-xs text-slate-400">Add MCQ or coding question</p>
            </div>
          </Link>
          <Link to="/admin/practice/questions" className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <AlignLeft size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">All Questions</p>
              <p className="text-xs text-slate-400">Browse, filter, and edit</p>
            </div>
          </Link>
          <Link to="/admin/practice/paths/new" className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Layers size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">New Practice Path</p>
              <p className="text-xs text-slate-400">Create language/topic path</p>
            </div>
          </Link>
          <Link to="/admin/practice/topics" className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <FolderTree size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Topics & Subtopics</p>
              <p className="text-xs text-slate-400">Manage learning structure</p>
            </div>
          </Link>
        </div>

        {/* Practice Paths Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-white text-sm">Practice Paths</h2>
            <span className="text-xs text-slate-400">{paths.length} paths</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : paths.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No practice paths yet.</p>
              <Link to="/admin/practice/paths/new" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1 block">
                Create your first path →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Path</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Level</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Published Qs</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {paths.map((path) => (
                    <tr key={path._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${path.gradientFrom || path.themeColor || '#6366f1'}, ${path.gradientTo || '#8b5cf6'})` }} />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{path.title}</p>
                            <p className="text-xs text-slate-400 font-mono">{path.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-xs text-slate-600 dark:text-slate-300">{path.level}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{path.totalProblems}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{path.publishedProblems}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTogglePublish(path)}
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${
                            path.isPublished
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {path.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/practice/paths/${path._id}/edit`}
                            className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePath(path._id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeAdminDashboard;
