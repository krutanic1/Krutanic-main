import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import QuestionTable from '../components/QuestionTable';
import LevelBadge from '../components/LevelBadge';
import { TableRowSkeleton } from '../components/Skeleton';
import { ChevronRight, BookOpen, Trophy, Target, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const PracticeSubtopicPage = () => {
  const { pathSlug, topicSlug, subtopicSlug } = useParams();
  const { practiceApi } = usePracticeAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await practiceApi.get(`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}/questions`);
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load questions.');
      navigate(`/practice/${pathSlug}`);
    } finally {
      setLoading(false);
    }
  }, [pathSlug, topicSlug, subtopicSlug, practiceApi, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-6 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 mb-8 animate-pulse" />
        <TableRowSkeleton rows={6} />
      </div>
    );
  }

  if (!data) return null;

  const { path, topic, subtopic, questions } = data;

  const totalQuestions = questions.length;
  const solvedQuestions = questions.filter(q => q.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;
  
  let scoreMessage = "Keep practicing!";
  if (scorePercent === 100) scoreMessage = "Perfect! You mastered this subtopic.";
  else if (scorePercent >= 80) scoreMessage = "Great job! Almost there.";
  else if (scorePercent >= 50) scoreMessage = "Good progress. Keep it up!";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Breadcrumb bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs" aria-label="Breadcrumb">
            <Link to="/practice" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Practice</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to={`/practice/${pathSlug}`} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors truncate max-w-[100px]">
              {path?.title}
            </Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-400 truncate max-w-[100px]">{topic?.title}</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[120px]">{subtopic?.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Subtopic Header & Score Card */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 break-all">
              {subtopic?.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'} in this subtopic
            </p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              {scoreMessage}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Trophy size={16} className="text-emerald-500" />
                Your Score
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {scorePercent}%
              </span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${scorePercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Target size={12}/> {solvedQuestions} Solved</span>
              <span>{totalQuestions - solvedQuestions} Remaining</span>
            </div>
          </div>
        </div>

        {/* Question Table */}
        <QuestionTable
          questions={questions}
          pathSlug={pathSlug}
          topicSlug={topicSlug}
          subtopicSlug={subtopicSlug}
        />

        {/* Back link */}
        <div className="mt-6">
          <Link
            to={`/practice/${pathSlug}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            ← Back to {path?.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PracticeSubtopicPage;
