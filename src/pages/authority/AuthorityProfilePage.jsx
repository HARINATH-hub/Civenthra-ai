import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DEPARTMENTS } from '../../data/mockData';
import {
  Shield,
  Building2,
  Mail,
  Phone,
  Sun,
  Moon,
  Check,
  Bell,
  Lock,
  UserCheck
} from 'lucide-react';

export default function AuthorityProfilePage() {
  const { user, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || 'Municipal Grievance Officer');
  const [designation, setDesignation] = useState(user?.designation || 'Review Engineer / Officer');
  const [department, setDepartment] = useState(user?.department || 'Public Works & Municipal Administration');
  const [phone, setPhone] = useState(user?.phone || '+91 98000 00000');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, designation, department, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Authority Profile & Division Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Municipal authority credentials, jurisdictional parameters, and notification triggers
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4" />
          Authority configuration updated successfully!
        </div>
      )}

      {/* Profile Overview Card */}
      <Card className="p-6 border space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-700/30 uppercase">
            {(name && name[0]) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Designated Municipal Officer
              </span>
            </div>
            <p className="text-xs text-slate-500">{designation}</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
              Account: {user?.email || 'authority@civenthra.demo'} • Role: Municipal Administrator
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Officer Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designation / Rank
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Division
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Emergency Hotline
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" size="md">
              Save Officer Credentials
            </Button>
          </div>
        </form>
      </Card>

      {/* System Theme & Notifications Preference */}
      <Card className="p-6 border space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          System Preferences
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Console Theme (Light / Dark)
            </p>
            <p className="text-[11px] text-slate-500">
              Toggle between municipal day mode and high-contrast control room dark mode
            </p>
          </div>
          <Button
            onClick={toggleTheme}
            variant="secondary"
            size="sm"
            icon={isDark ? Sun : Moon}
          >
            {isDark ? 'Light' : 'Dark'}
          </Button>
        </div>

        <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Instant AI Verification Notifications
            </p>
            <p className="text-[11px] text-slate-500">
              Alert when after-fix image is ready for automated Computer Vision inspection
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
        </label>
      </Card>
    </div>
  );
}
