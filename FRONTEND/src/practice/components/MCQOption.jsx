import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const MCQOption = ({
  option,
  index,
  selectedIndex,
  isSubmitted,
  onSelect,
  disabled = false,
}) => {
  const isSelected = selectedIndex === index;
  const isCorrect = option.isCorrect;

  let baseClasses =
    'group relative flex items-start gap-3 w-full px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

  let stateClasses = '';

  if (!isSubmitted) {
    // Before submission
    if (isSelected) {
      stateClasses =
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-sm shadow-blue-100 dark:shadow-none';
    } else {
      stateClasses =
        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer';
    }
  } else {
    // After submission: reveal correct/wrong
    if (isCorrect) {
      stateClasses =
        'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500';
    } else if (isSelected && !isCorrect) {
      stateClasses =
        'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500';
    } else {
      stateClasses =
        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-70';
    }
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${(disabled || isSubmitted) ? 'cursor-not-allowed pointer-events-none' : ''}`}
      onClick={() => !(disabled || isSubmitted) && onSelect(index)}
      disabled={disabled || isSubmitted}
      aria-pressed={isSelected}
      aria-label={`Option ${optionLabels[index]}: ${option.text}`}
    >
      {/* Option label circle */}
      <span
        className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-colors ${
          isSubmitted && isCorrect
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : isSubmitted && isSelected && !isCorrect
            ? 'border-red-400 bg-red-400 text-white'
            : isSelected
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 group-hover:border-blue-400'
        }`}
      >
        {optionLabels[index]}
      </span>

      {/* Option text */}
      <span className={`flex-1 text-sm font-medium leading-relaxed ${
        isSubmitted && isCorrect
          ? 'text-emerald-700 dark:text-emerald-400'
          : isSubmitted && isSelected && !isCorrect
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-700 dark:text-slate-200'
      }`}>
        {option.text}
      </span>

      {/* Result icon */}
      {isSubmitted && isCorrect && (
        <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-500 mt-0.5" aria-label="Correct answer" />
      )}
      {isSubmitted && isSelected && !isCorrect && (
        <XCircle size={18} className="flex-shrink-0 text-red-400 mt-0.5" aria-label="Wrong answer" />
      )}
    </button>
  );
};

export default MCQOption;
