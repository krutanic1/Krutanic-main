import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import { ArrowLeft, Plus, Trash2, Edit2, Layers, Book, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';

const TopicsManager = () => {
  const { practiceApi, isAdmin } = usePracticeAuth();
  const navigate = useNavigate();

  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const [loading, setLoading] = useState(false);

  // Form states
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/practice');
      return;
    }
    fetchPaths();
  }, [isAdmin, navigate, practiceApi]);

  const fetchPaths = async () => {
    try {
      const res = await practiceApi.get('/admin/practice-paths');
      setPaths(res.data.paths || []);
    } catch (err) {
      toast.error('Failed to load paths');
    }
  };

  const fetchTopics = async (pathId) => {
    try {
      setLoading(true);
      const res = await practiceApi.get(`/admin/practice/topics?pathId=${pathId}`);
      setTopics(res.data.topics || []);
      setSubtopics([]);
      setSelectedTopic('');
    } catch (err) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtopics = async (topicId) => {
    try {
      setLoading(true);
      const res = await practiceApi.get(`/admin/practice/subtopics?topicId=${topicId}`);
      setSubtopics(res.data.subtopics || []);
    } catch (err) {
      toast.error('Failed to load subtopics');
    } finally {
      setLoading(false);
    }
  };

  const handlePathChange = (e) => {
    const pathId = e.target.value;
    setSelectedPath(pathId);
    if (pathId) fetchTopics(pathId);
    else {
      setTopics([]);
      setSubtopics([]);
      setSelectedTopic('');
    }
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    if (topicId) fetchSubtopics(topicId);
    else setSubtopics([]);
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedPath) return;
    try {
      await practiceApi.post('/admin/topics', {
        practicePath: selectedPath,
        title: newTopicTitle,
        slug: newTopicTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        isPublished: true,
      });
      toast.success('Topic added!');
      setNewTopicTitle('');
      fetchTopics(selectedPath);
    } catch (err) {
      toast.error('Failed to add topic');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Delete this topic and all its subtopics?')) return;
    try {
      await practiceApi.delete(`/admin/topics/${topicId}`);
      toast.success('Topic deleted');
      if (selectedTopic === topicId) setSelectedTopic('');
      fetchTopics(selectedPath);
    } catch (err) {
      toast.error('Failed to delete topic');
    }
  };

  const handleAddSubtopic = async (e) => {
    e.preventDefault();
    if (!newSubtopicTitle.trim() || !selectedTopic) return;
    try {
      await practiceApi.post('/admin/subtopics', {
        topic: selectedTopic,
        practicePath: selectedPath,
        title: newSubtopicTitle,
        slug: newSubtopicTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
        isPublished: true,
      });
      toast.success('Subtopic added!');
      setNewSubtopicTitle('');
      fetchSubtopics(selectedTopic);
    } catch (err) {
      toast.error('Failed to add subtopic');
    }
  };

  const handleDeleteSubtopic = async (subtopicId) => {
    if (!window.confirm('Delete this subtopic?')) return;
    try {
      await practiceApi.delete(`/admin/subtopics/${subtopicId}`);
      toast.success('Subtopic deleted');
      fetchSubtopics(selectedTopic);
    } catch (err) {
      toast.error('Failed to delete subtopic');
    }
  };

  const handleToggleTopicPublish = async (topic) => {
    try {
      await practiceApi.put(`/admin/topics/${topic._id}`, { isPublished: !topic.isPublished });
      toast.success(topic.isPublished ? 'Topic unpublished' : 'Topic published');
      fetchTopics(selectedPath);
    } catch (err) {
      toast.error('Failed to update topic status');
    }
  };

  const handleToggleSubtopicPublish = async (sub) => {
    try {
      await practiceApi.put(`/admin/subtopics/${sub._id}`, { isPublished: !sub.isPublished });
      toast.success(sub.isPublished ? 'Subtopic unpublished' : 'Subtopic published');
      fetchSubtopics(selectedTopic);
    } catch (err) {
      toast.error('Failed to update subtopic status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 admin-content-wrap !p-0">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/admin/practice" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={16} className="text-slate-600 dark:text-slate-300" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Topics & Subtopics</h1>
            <p className="text-xs text-slate-400">Manage learning structure for your paths</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Path Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Select Practice Path
          </label>
          <select 
            value={selectedPath} 
            onChange={handlePathChange}
            className="w-full max-w-md px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
          >
            <option value="">-- Select a Path --</option>
            {paths.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>

        {selectedPath && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TOPICS COLUMN */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                <Book size={18} className="text-blue-500" />
                <h2 className="font-bold text-slate-800 dark:text-white">Topics</h2>
              </div>
              
              <div className="p-4 flex flex-col flex-1 overflow-hidden">
                <form onSubmit={handleAddTopic} className="flex gap-2 mb-4 shrink-0">
                  <input 
                    type="text" 
                    value={newTopicTitle} 
                    onChange={e => setNewTopicTitle(e.target.value)}
                    placeholder="New Topic Name..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
                  />
                  <button type="submit" disabled={!newTopicTitle.trim()} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors">
                    <Plus size={18} />
                  </button>
                </form>

                <div className="overflow-y-auto flex-1 pr-2 space-y-2">
                  {loading && topics.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">Loading...</p>
                  ) : topics.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No topics yet.</p>
                  ) : (
                    topics.map(topic => (
                      <div key={topic._id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer
                          ${selectedTopic === topic._id 
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                            : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300'}`}
                        onClick={() => handleTopicChange(topic._id)}
                      >
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{topic.title}</span>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleTopicPublish(topic); }}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                              topic.isPublished
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {topic.isPublished ? 'Published' : 'Draft'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic._id); }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* SUBTOPICS COLUMN */}
            <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] transition-opacity ${!selectedTopic ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
                <FolderTree size={18} className="text-emerald-500" />
                <h2 className="font-bold text-slate-800 dark:text-white">Subtopics</h2>
              </div>
              
              <div className="p-4 flex flex-col flex-1 overflow-hidden">
                <form onSubmit={handleAddSubtopic} className="flex gap-2 mb-4 shrink-0">
                  <input 
                    type="text" 
                    value={newSubtopicTitle} 
                    onChange={e => setNewSubtopicTitle(e.target.value)}
                    placeholder="New Subtopic Name..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-slate-200"
                  />
                  <button type="submit" disabled={!newSubtopicTitle.trim()} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors">
                    <Plus size={18} />
                  </button>
                </form>

                <div className="overflow-y-auto flex-1 pr-2 space-y-2">
                  {!selectedTopic ? (
                    <p className="text-sm text-slate-400 text-center py-4">Select a topic first.</p>
                  ) : loading && subtopics.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">Loading...</p>
                  ) : subtopics.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No subtopics yet.</p>
                  ) : (
                    subtopics.map(sub => (
                      <div key={sub._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{sub.title}</span>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleToggleSubtopicPublish(sub)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                              sub.isPublished
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {sub.isPublished ? 'Published' : 'Draft'}
                          </button>
                          <button 
                            onClick={() => handleDeleteSubtopic(sub._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsManager;
