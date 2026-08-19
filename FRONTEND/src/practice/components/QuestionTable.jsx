import React from 'react';
import { Link, useParams } from 'react-router-dom';
import DifficultyBadge from './DifficultyBadge';
import { CheckCircle2, Circle, MinusCircle, PlayCircle, ArrowRight } from 'lucide-react';

const statusConfig = {
  not_started: {
    label: 'Not started',
    icon: <Circle size={14} className="text-slate-300 dark:text-slate-600" />,
    textClass: 'text-slate-400',
  },
  attempted: {
    label: 'Attempted',
    icon: <MinusCircle size={14} className="text-amber-400" />,
    textClass: 'text-amber-600 dark:text-amber-400',
  },
  solved: {
    label: 'Solved',
    icon: <CheckCircle2 size={14} className="text-emerald-500" />,
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
};

const typeConfig = {
  mcq: { label: 'MCQ', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  coding: { label: 'Coding', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

const QuestionTable = ({ questions = [], pathSlug, topicSlug, subtopicSlug }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <Circle size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium">No questions in this subtopic yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-8">#</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Problem</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Difficulty</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Status</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {questions.map((q, idx) => {
            const status = statusConfig[q.status] || statusConfig['not_started'];
            const type = typeConfig[q.type] || typeConfig['mcq'];
            const href = `/practice/${pathSlug}/${topicSlug}/${subtopicSlug}/${q.slug}`;
            const actionLabel = q.status === 'not_started' ? 'Solve' : q.status === 'attempted' ? 'Continue' : 'Review';

            return (
              <tr
                key={q._id}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-slate-400 dark:text-slate-600 text-xs font-mono">{idx + 1}</td>
                <td className="px-4 py-3">
                  <Link to={href} className="font-medium text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {q.title}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${type.className}`}>
                    {type.label}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <DifficultyBadge difficulty={q.difficulty} size="xs" />
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${status.textClass}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={href}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {actionLabel}
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;
