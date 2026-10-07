import React from 'react';
import { AlertCircle, Clock, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const normalized = (status || 'ACTIVE').toUpperCase();

  const configs = {
    ACTIVE: {
      label: 'ACTIVE',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
      icon: AlertCircle
    },
    IN_PROGRESS: {
      label: 'IN PROGRESS',
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      dot: 'bg-blue-500',
      icon: Clock
    },
    AWAITING_VERIFICATION: {
      label: 'AWAITING VERIFICATION',
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      dot: 'bg-purple-500',
      icon: ShieldCheck
    },
    RESOLVED: {
      label: 'RESOLVED',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: CheckCircle2
    },
    VERIFICATION_FAILED: {
      label: 'VERIFICATION FAILED',
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
      icon: XCircle
    }
  };

  const config = configs[normalized] || configs.ACTIVE;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-xs ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
      <span>{config.label}</span>
    </span>
  );
}
