import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import DemoBanner from '../components/common/DemoBanner';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { loginCitizen, registeredUsersCount } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        loginCitizen({ email, password });
        setLoading(false);
        navigate('/citizen/dashboard');
      } catch (err) {
        setError(err.message || 'Login failed. Please verify your credentials.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <Logo size="lg" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Citizen Portal Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to your registered account to report and track civic issues
            </p>
          </div>

          {/* Clean system notice if no accounts yet */}
          {registeredUsersCount === 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2 text-indigo-900 dark:text-indigo-200">
              <p className="font-bold flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                First Time Here?
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                The application starts with a clean database. Please register a citizen account to get started.
              </p>
              <Link to="/register">
                <Button size="sm" className="w-full mt-1 font-semibold" icon={ArrowRight} iconPosition="right">
                  Register New Citizen Account
                </Button>
              </Link>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full font-semibold shadow-md shadow-indigo-600/20"
              >
                Sign In to Citizen Dashboard
              </Button>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Register here
                </Link>
              </p>
              <p className="text-xs text-slate-500">
                Municipal Authority Officer?{' '}
                <Link to="/authority/login" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                  Authority Portal Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
