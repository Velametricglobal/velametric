import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { Pause, Play, Music } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const { isPlaying, settings, togglePlayPause, trackTitle } = useAudio();
  const [isHovered, setIsHovered] = useState(false);

  if (!settings || !settings.enabled) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
      {/* Floating Track Info Tooltip */}
      <div
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border text-xs font-bold transition-all duration-300 pointer-events-none ${
          isHovered || isPlaying
            ? 'opacity-100 translate-x-0 bg-white/95 dark:bg-zinc-900/90 text-slate-900 dark:text-amber-400 border-amber-400/40'
            : 'opacity-0 translate-x-3'
        }`}
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-500' : 'text-amber-600 dark:text-amber-400'}`} />
        <span className="text-[11px] font-mono whitespace-nowrap">
          {isPlaying ? `Playing: ${trackTitle}` : 'Play Background Music'}
        </span>
      </div>

      <button
        onClick={togglePlayPause}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        title={isPlaying ? `Pause Music — ${trackTitle}` : `Play Music — ${trackTitle}`}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative group focus:outline-none focus:ring-4 focus:ring-amber-400/50 hover:scale-105 active:scale-95 border-2 ${
          isPlaying
            ? 'bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 text-slate-950 shadow-amber-500/40 dark:from-zinc-900 dark:to-zinc-800 dark:border-amber-500/60 dark:text-amber-400'
            : 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-400 border-amber-200 text-slate-950 shadow-amber-500/30 hover:shadow-amber-500/50 dark:from-zinc-900 dark:to-zinc-950 dark:border-zinc-700 dark:text-amber-400 dark:hover:border-amber-500'
        }`}
      >
        {/* Subtle Glowing Ring Animation when Playing */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-amber-500/40 dark:bg-amber-500/20 animate-ping pointer-events-none" />
        )}

        {isPlaying ? (
          <Pause className="w-5 h-5 fill-slate-950 text-slate-950 dark:fill-amber-400 dark:text-amber-400 relative z-10" />
        ) : (
          <Play className="w-5 h-5 fill-slate-950 text-slate-950 ml-0.5 relative z-10 dark:fill-amber-400 dark:text-amber-400" />
        )}
      </button>
    </div>
  );
};

