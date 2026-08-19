import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

const statusIcon = (status) => {
  if (status === 'solved') return <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />;
  if (status === 'attempted') return <Circle size={14} className="text-amber-400 flex-shrink-0" />;
  return <Circle size={14} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />;
};

const SidebarNav = ({ topics = [], progressMap = {}, activeQuestionSlug = '', onClose }) => {
  const { pathSlug, topicSlug, subtopicSlug } = useParams();
  const [expandedTopics, setExpandedTopics] = React.useState(() => {
    // Auto-expand the active topic
    const initial = {};
    topics.forEach((t) => { initial[t._id] = true; });
    return initial;
  });
  const [expandedSubtopics, setExpandedSubtopics] = React.useState(() => {
    const initial = {};
    topics.forEach((t) => {
      (t.subtopics || []).forEach((s) => { initial[s._id] = true; });
    });
    return initial;
  });

  const toggleTopic = (id) =>
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleSubtopic = (id) =>
    setExpandedSubtopics((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav className="w-full h-full overflow-y-auto" aria-label="Practice navigation">
      {topics.map((topic) => (
        <div key={topic._id} className="mb-1">
          {/* Topic header */}
          <button
            onClick={() => toggleTopic(topic._id)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-expanded={expandedTopics[topic._id]}
          >
            <span className="truncate pr-1">{topic.title}</span>
            {expandedTopics[topic._id] ? (
              <ChevronDown size={14} className="flex-shrink-0" />
            ) : (
              <ChevronRight size={14} className="flex-shrink-0" />
            )}
          </button>

          {expandedTopics[topic._id] && (
            <div className="mt-0.5 space-y-0.5">
              {(topic.subtopics || []).map((sub) => (
                <div key={sub._id} className="ml-2">
                  {/* Subtopic header */}
                  <button
                    onClick={() => toggleSubtopic(sub._id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold rounded-lg transition-colors ${
                      subtopicSlug === sub.slug
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                    aria-expanded={expandedSubtopics[sub._id]}
                  >
                    <span className="truncate pr-1">{sub.title}</span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-slate-400 text-xs">{sub.questionCount || ''}</span>
                      {expandedSubtopics[sub._id] ? (
                        <ChevronDown size={12} />
                      ) : (
                        <ChevronRight size={12} />
                      )}
                    </span>
                  </button>

                  {expandedSubtopics[sub._id] && sub.questions && (
                    <div className="ml-3 mt-0.5 space-y-0.5">
                      {sub.questions.map((q) => {
                        const prog = progressMap[q._id] || {};
                        const isActive = activeQuestionSlug === q.slug;
                        return (
                          <Link
                            key={q._id}
                            to={`/practice/${pathSlug}/${topic.slug}/${sub.slug}/${q.slug}`}
                            onClick={onClose}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            {statusIcon(prog.status)}
                            <span className="truncate">{q.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
