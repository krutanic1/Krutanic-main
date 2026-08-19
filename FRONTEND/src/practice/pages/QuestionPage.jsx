import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import MCQOption from '../components/MCQOption';
import DifficultyBadge from '../components/DifficultyBadge';
import { QuestionPageSkeleton } from '../components/Skeleton';
import {
  ChevronRight, ChevronLeft, ChevronUp, Menu, X,
  Code2, CheckCircle2, XCircle, Lightbulb, BookOpen, Trophy
} from 'lucide-react';
import toast from 'react-hot-toast';

const QuestionPage = () => {
  const { pathSlug, topicSlug, subtopicSlug, questionSlug } = useParams();
  const { practiceApi, isAuthenticated } = usePracticeAuth();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { isCorrect, explanation, options, correctOptionIndex }
  const [showExplanation, setShowExplanation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      setSelectedIndex(null);
      setIsSubmitted(false);
      setResult(null);
      setShowExplanation(false);

      const res = await practiceApi.get(`/practice/question/${questionSlug}`);
      setQuestionData(res.data);

      // If already submitted, pre-fill state
      if (res.data.hasSubmitted && res.data.progress) {
        setSelectedIndex(res.data.progress.selectedOptionIndex);
        setIsSubmitted(true);
        setResult({
          isCorrect: res.data.progress.isCorrect,
          explanation: res.data.question.explanation,
          options: res.data.question.options,
          correctOptionIndex: res.data.question.options?.findIndex((o) => o.isCorrect),
        });
      }
    } catch (err) {
      toast.error('Failed to load question.');
      navigate(`/practice/${pathSlug}`);
    } finally {
      setLoading(false);
    }
  }, [questionSlug, practiceApi, pathSlug, navigate]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  // Keyboard navigation for options (1-4 keys)
  useEffect(() => {
    if (isSubmitted || !questionData) return;
    const handleKey = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= (questionData.question.options?.length || 0)) {
        setSelectedIndex(num - 1);
      }
      if ((e.key === 'Enter' || e.key === ' ') && selectedIndex !== null) {
        handleSubmit();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isSubmitted, questionData, selectedIndex]);

  const handleSubmit = async () => {
    if (selectedIndex === null) {
      toast.error('Please select an option first.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await practiceApi.post(`/practice/question/${questionData.question._id}/submit`, {
        selectedOptionIndex: selectedIndex,
      });
      setResult(res.data);
      if (res.data.isCorrect) {
        setIsSubmitted(true);
        toast.success('Correct! 🎉');
        if (questionData.navigation.next) {
          setTimeout(() => {
            navigateToQuestion(questionData.navigation.next);
          }, 1500);
        }
      } else {
        toast.error('Incorrect. Try again!');
        setSelectedIndex(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToQuestion = (q) => {
    navigate(`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}/${q.slug}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <QuestionPageSkeleton />
      </div>
    );
  }

  if (!questionData) return null;

  const { question, navigation, progress } = questionData;
  const typeBadge = question.type === 'mcq'
    ? <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-semibold">MCQ</span>
    : <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold">Coding</span>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Breadcrumb / Nav Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-[61px] z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs flex-wrap" aria-label="Breadcrumb">
            <Link to="/practice" className="text-slate-400 hover:text-slate-600 transition-colors">Practice</Link>
            <ChevronRight size={11} className="text-slate-300" />
            <Link to={`/practice/${pathSlug}`} className="text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[70px]">
              {question.practicePath?.title}
            </Link>
            <ChevronRight size={11} className="text-slate-300" />
            <Link to={`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}`} className="text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[80px]">
              {question.subtopic?.title}
            </Link>
            <ChevronRight size={11} className="text-slate-300" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[100px]">{question.title}</span>
          </nav>

          {/* Progress pill */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">
              {navigation.currentIndex} / {navigation.total}
            </span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={16} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Questions</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">{navigation.currentIndex} of {navigation.total}</p>
            <div className="space-y-1">
              <Link
                to={`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}`}
                className="block text-xs text-blue-600 dark:text-blue-400 hover:underline mb-3"
                onClick={() => setSidebarOpen(false)}
              >
                ← View all questions
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {typeBadge}
              <DifficultyBadge difficulty={question.difficulty} />
              {/* Progress indicator */}
              <span className="ml-auto text-xs text-slate-400 font-mono">
                {navigation.currentIndex} / {navigation.total}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
              {question.title}
            </h1>
          </div>

          {/* Question Body */}
          <div className="px-6 py-5">
            {/* Statement */}
            <div className="mb-5">
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line break-words break-all">
                {question.statement}
              </p>
            </div>

            {/* Code Snippet */}
            {question.codeSnippet && (
              <div className="mb-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-400 font-mono">{question.codeLanguage || 'python'}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <pre className="bg-slate-900 px-5 py-4 text-sm text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                  <code>{question.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* MCQ Options */}
            {question.type === 'mcq' && (
              <div className="space-y-3" role="radiogroup" aria-label="Answer options">
                {(result?.options || question.options)?.map((option, idx) => (
                  <MCQOption
                    key={option._id || idx}
                    option={option}
                    index={idx}
                    selectedIndex={selectedIndex}
                    isSubmitted={isSubmitted}
                    onSelect={setSelectedIndex}
                    disabled={submitting}
                  />
                ))}
              </div>
            )}

            {/* Submit / See Answer */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!isSubmitted ? (
                isAuthenticated ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selectedIndex === null || submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    Submit Answer
                  </button>
                ) : (
                  <Link
                    to="/practice/login"
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors"
                  >
                    Sign in to Submit
                  </Link>
                )
              ) : (
                <div className="flex items-center gap-2">
                  {result?.isCorrect ? (
                    <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                      <CheckCircle2 size={18} />
                      Correct!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500 dark:text-red-400 font-semibold text-sm">
                      <XCircle size={18} />
                      Incorrect
                    </span>
                  )}
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-semibold rounded-xl text-xs transition-colors"
                  >
                    <Lightbulb size={13} />
                    {showExplanation ? 'Hide' : 'See'} Explanation
                  </button>
                </div>
              )}
            </div>

            {/* Explanation */}
            {isSubmitted && showExplanation && (result?.explanation || question.explanation) && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={15} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Explanation</span>
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  {result?.explanation || question.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={() => navigation.prev && navigateToQuestion(navigation.prev)}
              disabled={!navigation.prev}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Previous question"
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            <Link
              to={`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}`}
              className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">All questions</span>
            </Link>

            {navigation.next ? (
              <button
                onClick={() => navigateToQuestion(navigation.next)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Next question"
              >
                Next
                <ChevronRight size={15} />
              </button>
            ) : (
              <Link
                to={`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Finish & View Score
                <Trophy size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* Keyboard hint */}
        {!isSubmitted && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">1</kbd>–
            <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">4</kbd> to select, then <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> to submit.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
