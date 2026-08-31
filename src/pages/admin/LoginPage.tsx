import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput.trim() || !password.trim()) {
      setError('Please enter both your User ID / Email and Password.');
      return;
    }

    setLoading(true);

    const result = await login(loginInput, password);
    setLoading(false);

    if (result.success && result.defaultPath) {
      navigate(result.defaultPath);
    } else {
      setError(result.error || 'Invalid credentials. Access Denied.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-brand-500 selection:text-white relative transition-colors duration-200">
      
      {/* TOP HEADER CONTROLS (BACK TO HOME & THEME TOGGLE) */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>

        <ThemeToggle />
      </div>

      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 dark:bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-7 shadow-2xl backdrop-blur relative z-10 text-left my-12">
        
        {/* BRAND LOGO & HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-2xl shadow-glow-brand mx-auto">
            V
          </div>
          <div>
            <h1 className="text-2xl font-black text-black dark:text-white font-display tracking-tight uppercase logo-brand-text">
              VELAMETRIC GLOBAL
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Protected Enterprise Dashboard Login</p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-semibold text-xs leading-relaxed flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">User ID OR Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. SUPERADMIN-001 or superadmin@example.com"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Account Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-brand-600" />
              Remember device
            </label>
            <a href="#forgot" onClick={() => alert('Password reset verification has been dispatched to your email.')} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-glow-brand transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In To Dashboard →'}
          </button>
        </form>

      </div>
    </div>
  );
};
