import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import DemoBanner from '../../components/common/DemoBanner';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, Building2, KeyRound, AlertCircle } from 'lucide-react';

export default function AuthorityLoginPage() {
  const { loginAuthority } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('authority@civenthra.demo');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAuthority({ email, password });
      setLoading(false);
      navigate('/authority/dashboard');
    }, 400);
  };

  const handleUseDemoAuthority = () => {
    loginAuthority();
    navigate('/authority/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <DemoBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <Logo size="lg" />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Municipal Authority Administration</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Official Grievance Control Console
            </h1>
            <p className="text-xs text-slate-400">
              Departmental assignment, field resolution, and Computer Vision verification
            </p>
          </div>

          {/* CLEARLY LABELED DEMO AUTHORITY ACCOUNT BOX */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Demo Authority Account (For Evaluation & Development)
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded">
                DEMO ROLE
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <p>
                <strong>Email:</strong> <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">authority@civenthra.demo</code>
              </p>
              <p className="text-[11px] text-slate-400">
                Provides municipal administrator access to inspect grievances, allocate departments, and trigger Computer Vision re-verification.
              </p>
            </div>
            <Button
              onClick={handleUseDemoAuthority}
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold border-none mt-1"
            >
              Sign In as Demo Authority Account
            </Button>
          </div>

          {/* Manual Authority Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Authority Email / Official ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              >
                Access Authority Control Console
              </Button>
            </form>

            <div className="border-t border-slate-800 pt-4 text-center">
              <Link to="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                ← Return to Citizen Portal Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
