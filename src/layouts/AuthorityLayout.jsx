import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import DemoBanner from '../components/common/DemoBanner';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Building2,
  UserCheck,
  Wrench,
  ShieldCheck,
  BarChart3,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';

export default function AuthorityLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, switchToRole } = useAuth();
  const { stats, complaints } = useComplaints();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { name: 'Dashboard', path: '/authority/dashboard', icon: LayoutDashboard },
    { name: 'Complaints', path: '/authority/complaints', icon: ClipboardList, badge: stats.active },
    { name: 'Map View', path: '/authority/map', icon: Map },
    { name: 'Departments', path: '/authority/departments', icon: Building2 },
    {
      name: 'Resolution & Fix',
      path: complaints.length > 0 ? `/authority/resolution/${complaints[0].id}` : '/authority/complaints',
      icon: Wrench
    },
    { name: 'CV Verification', path: '/authority/verification', icon: ShieldCheck, badge: stats.awaitingVerification, badgeColor: 'bg-purple-500' },
    { name: 'Analytics', path: '/authority/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/authority/settings', icon: Settings },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/authority/complaints?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
          {/* Authority Portal Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/authority/dashboard" className="flex items-center gap-2">
              <Logo size="md" showBadge={false} />
            </Link>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/30">
              OFFICIAL
            </span>
          </div>

          {/* Officer Jurisdiction Badge */}
          <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              <Shield className="w-5 h-5 text-indigo-200" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Authority Officer'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.designation || 'Municipal Grievance Officer'}</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">Municipal Corporation</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Authority Workflows
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const itemBase = item.path.split('/').slice(0, 3).join('/');
              const isActive = location.pathname === item.path || (item.path !== '/authority/dashboard' && location.pathname.startsWith(itemBase));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || 'bg-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Switch button */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => {
                switchToRole('citizen');
                navigate('/citizen/dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Switch to Citizen View</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 transition-colors">
            {/* Mobile menu trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Logo size="sm" showBadge={false} />
            </div>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Ticket ID (CIV-2026-...), issue, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </form>

            {/* Right Tools */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Link
                to="/authority/verification"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                title="Awaiting CV Verification"
              >
                <Bell className="w-4 h-4" />
                {stats.awaitingVerification > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                )}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {/* Authority Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'A'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {user?.name || 'Authority Officer'}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      {user?.designation || 'Municipal Officer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Municipal Officer'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email || 'authority@civenthra.demo'}</p>
                      <span className="inline-block mt-1 text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20">
                        {user?.isDemoAccount ? 'Demo Authority Account' : 'Official Reviewer'}
                      </span>
                    </div>

                    <Link
                      to="/authority/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Authority Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/authority/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 text-white flex flex-col z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <Logo size="sm" showBadge={false} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
