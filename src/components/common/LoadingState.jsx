import React from 'react';
import { Cpu } from 'lucide-react';

export default function LoadingState({ message = 'Loading...', submessage = 'Fetching civic intelligence data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
        <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 absolute inset-0 m-auto" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {message}
      </h4>
      {submessage && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {submessage}
        </p>
      )}
    </div>
  );
}
