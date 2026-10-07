import React from 'react';

export default function Logo({ size = 'md', showBadge = true, className = '' }) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon combining Pin + AI Neural Nodes + City Skyline */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-500/20 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Civic Location Pin Outer Path */}
          <path
            d="M16 3C10.477 3 6 7.477 6 13C6 19.5 14.5 28.5 16 29C17.5 28.5 26 19.5 26 13C26 7.477 21.523 3 16 3Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white opacity-95"
          />
          {/* Smart City Skyline Base */}
          <path
            d="M11 17V12M14 17V10M18 17V8M21 17V13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="text-blue-200"
          />
          {/* AI Neural Connection Nodes */}
          <circle cx="16" cy="8" r="1.5" fill="#38BDF8" />
          <circle cx="11" cy="12" r="1.2" fill="#38BDF8" />
          <circle cx="21" cy="13" r="1.2" fill="#38BDF8" />
          <path
            d="M11 12L16 8L21 13"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeDasharray="1 1"
          />
        </svg>

        {/* Ambient AI indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            Civenthra
          </span>
          <span className={`font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${textSizes[size]}`}>
            AI
          </span>
        </div>
        {showBadge && (
          <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase mt-0.5">
            Civic Vision & Grievance AI
          </span>
        )}
      </div>
    </div>
  );
}
