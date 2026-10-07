import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { AlertCircle, RefreshCw, Database, User, Shield, CheckCircle2 } from 'lucide-react';

export default function DemoBanner() {
  const { user, role, logout } = useAuth();
  const { isDemoMode, loadDemoData, resetDemoData, complaints } = useComplaints();
  const navigate = useNavigate();

  return (
    <aside
      aria-label="System data status banner"
      className={`text-xs border-b transition-colors ${
        isDemoMode
          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                DEMO MODE — Sample data is being displayed ({complaints.length} sample items)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Clean System Mode ({complaints.length} recorded complaints)
              </span>
            </div>
          )}

          {/* Current Session Info */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px] pl-2 border-l border-slate-700">
            <span>Session:</span>
            {user ? (
              <span className="font-semibold text-white flex items-center gap-1">
                {role === 'authority' ? (
                  <Shield className="w-3 h-3 text-amber-400" />
                ) : (
                  <User className="w-3 h-3 text-cyan-400" />
                )}
                {user.name} ({user.email})
              </span>
            ) : (
              <span className="italic text-slate-500">Not logged in (Guest)</span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {complaints.length > 0 && (
            <button
              onClick={() => {
                resetDemoData();
              }}
              className="bg-rose-600/90 hover:bg-rose-600 text-white font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors text-[11px]"
              title="Reset complaints to empty state"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Clean State</span>
            </button>
          )}

          {!isDemoMode && (
            <button
              onClick={() => {
                loadDemoData();
              }}
              className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors text-[11px]"
              title="Populate sample demo complaints"
            >
              <Database className="w-3 h-3" />
              <span>Load Demo Data</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-slate-400 hover:text-white text-[11px] px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
