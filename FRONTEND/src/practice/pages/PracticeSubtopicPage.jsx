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

  useEffect(() => {
    if (data && data.questions && data.questions.length > 0) {
      // Automatically redirect to the first question
      const firstQuestion = data.questions[0];
      navigate(`/practice/${pathSlug}/${topicSlug}/${subtopicSlug}/${firstQuestion.slug}`, { replace: true });
    }
  }, [data, pathSlug, topicSlug, subtopicSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1d22] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  if (data.questions?.length === 0) {
    return (
      <div className="min-h-screen bg-[#1c1d22] flex items-center justify-center text-slate-400">
        No questions available for this subtopic yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1d22] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default PracticeSubtopicPage;
