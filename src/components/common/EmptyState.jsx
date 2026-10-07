import React from 'react';
import { Inbox, PlusCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no active civic issues matching your current criteria.',
  icon: Icon = Inbox,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} icon={PlusCircle} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
