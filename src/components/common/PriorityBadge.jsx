import React from 'react';
import { AlertTriangle, AlertCircle, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority = 'MEDIUM', size = 'sm', className = '' }) {
  const norm = (priority || 'MEDIUM').toUpperCase();

  const configs = {
    HIGH: {
      label: 'HIGH',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertTriangle
    },
    MEDIUM: {
      label: 'MEDIUM',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertCircle
    },
    LOW: {
      label: 'LOW',
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      icon: ArrowDown
    }
  };

  const config = configs[norm] || configs.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-0.5 text-xs gap-1 font-semibold',
    md: 'px-3 py-1 text-sm gap-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
