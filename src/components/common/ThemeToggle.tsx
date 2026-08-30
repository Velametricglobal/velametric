import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        aria-label={`Current theme: ${theme}. Click to switch theme`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm touch-target ${
          isDark
            ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-zinc-800 hover:border-amber-500/50'
            : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-200 hover:border-indigo-400'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform" />
          )}
        </div>
        <span className="capitalize font-mono text-[11px] font-extrabold">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  if (variant === 'expanded') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
          isDark
            ? 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:text-amber-400'
            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 hover:text-indigo-600'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-indigo-50 text-indigo-600'}`}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </div>
          <span>Theme Appearance</span>
        </div>
        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
          isDark ? 'bg-zinc-800 text-amber-400 border-zinc-700' : 'bg-slate-100 text-indigo-600 border-slate-300'
        }`}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
    );
  }

  // Default: Icon button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center touch-target group shadow-sm ${
        isDark
          ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-zinc-800 hover:border-amber-400/50 hover:shadow-amber-500/10'
          : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300 hover:border-indigo-400 hover:shadow-indigo-500/10'
      } ${className}`}
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-all" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600 transition-all" />
        )}
      </div>
    </button>
  );
};
