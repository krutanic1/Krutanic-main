import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePracticeAuth } from '../context/PracticeAuthContext';
import MCQOption from '../components/MCQOption';
import DifficultyBadge from '../components/DifficultyBadge';
import { QuestionPageSkeleton } from '../components/Skeleton';
import {
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Menu, X,
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
      if (err.response?.status !== 401) {
        toast.error(err.response?.data?.message || 'Failed to submit answer.');
      }
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
    <div className="flex h-[calc(100vh-61px)] bg-[#1c1d22] text-slate-300 font-sans overflow-hidden">
      {/* LEFT PANE - Statement */}
      <div className="w-1/2 flex flex-col border-r border-white/10">
        {/* Tabs */}
        <div className="flex border-b border-white/10 px-4 pt-2">
          <button className="px-6 py-2 border-b-2 border-blue-500 text-sm font-semibold text-white">Statement</button>
          {/* <button className="px-6 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">AI Help</button> */}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-xl font-bold text-white mb-4 leading-snug">{question.title}</h2>
          
          <div className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap break-words">
            {question.statement}
          </div>

          {question.codeSnippet && (
            <div className="mb-6 rounded-lg overflow-hidden border border-white/10 bg-[#16171a]">
              <pre className="p-4 text-sm font-mono text-emerald-400 overflow-x-auto">
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE - Options & Actions */}
      <div className="w-1/2 flex flex-col bg-[#1c1d22]">
        <div className="flex-1 overflow-y-auto p-8">
          {question.type === 'mcq' && (
            <>
              <h3 className="text-base font-medium text-slate-200 mb-6">Select one of the following options:</h3>
              <div className="space-y-4" role="radiogroup" aria-label="Answer options">
                {(result?.options || question.options)?.map((option, idx) => {
                  const isSelected = selectedIndex === idx;
                  const showCorrect = isSubmitted && option.isCorrect;
                  const showWrong = isSubmitted && isSelected && !option.isCorrect;

                  let boxStyle = "border-white/10 hover:border-white/30 hover:bg-white/5";
                  let circleStyle = "border-slate-500";
                  
                  if (isSelected) {
                    boxStyle = "border-blue-500 bg-blue-500/10";
                    circleStyle = "border-blue-500 bg-blue-500";
                  }
                  
                  if (showCorrect) {
                    boxStyle = "border-emerald-500 bg-emerald-500/10";
                    circleStyle = "border-emerald-500 bg-emerald-500";
                  } else if (showWrong) {
                    boxStyle = "border-red-500 bg-red-500/10";
                    circleStyle = "border-red-500 bg-red-500";
                  }

                  return (
                    <button
                      key={option._id || idx}
                      disabled={submitting || isSubmitted}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-4 rounded-lg border ${boxStyle} transition-all flex items-start gap-4 disabled:cursor-default`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 ${circleStyle}`}>
                        {isSelected && <div className="w-full h-full bg-white rounded-full scale-[0.4]" />}
                      </div>
                      <span className="text-sm text-slate-300 flex-1 leading-snug">
                        {option.text}
                      </span>
                      {showCorrect && <CheckCircle2 size={18} className="text-emerald-500" />}
                      {showWrong && <XCircle size={18} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Explanation block if submitted */}
          {isSubmitted && (
            <div className="mt-8 rounded-lg border border-white/10 bg-[#25262c] overflow-hidden">
              <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className={result?.isCorrect ? 'text-emerald-400' : 'text-amber-400'} />
                  See Answer
                </div>
                {showExplanation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showExplanation && (
                <div className="p-4 border-t border-white/10 text-sm text-slate-300 bg-[#1e1f24]">
                  {result?.explanation || question.explanation || "No explanation provided."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-4 flex justify-between items-center bg-[#1c1d22]">
          <div className="text-xs font-mono text-slate-500">
             {navigation.currentIndex} / {navigation.total}
          </div>
          <div className="flex gap-4">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedIndex === null || submitting}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded transition-colors text-sm"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            ) : (
              navigation.next ? (
                <button
                  onClick={() => navigateToQuestion(navigation.next)}
                  className="px-8 py-2 bg-white text-black font-medium rounded hover:bg-slate-200 transition-colors text-sm"
                >
                  Next
                </button>
              ) : (
                <Link
                  to={`/practice/${pathSlug}`}
                  className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition-colors text-sm"
                >
                  Finish
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
