import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { BackgroundMusicSettings } from '../types/database.types';
import { settingsService } from '../services/settingsService';

interface AudioContextType {
  isPlaying: boolean;
  isAutoplayBlocked: boolean;
  volume: number;
  trackTitle: string;
  artistName: string;
  settings: BackgroundMusicSettings | null;
  togglePlayPause: () => void;
  pause: () => void;
  play: () => void;
  setVolume: (vol: number) => void;
}

const MusicAudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [settings, setSettings] = useState<BackgroundMusicSettings | null>(null);
  const [volume, setVolumeState] = useState<number>(0.2); // Default 20%
  
  const audioCtxRef = useRef<any | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const userManuallyPausedRef = useRef<boolean>(false);

  useEffect(() => {
    // Load Admin Music Settings
    settingsService.getMusicSettings().then(cfg => {
      setSettings(cfg);
      if (cfg) {
        setVolumeState((cfg.default_volume || 20) / 100);
      }
    }).catch(err => {
      console.error('Error loading music settings:', err);
    });

    const storedPref = localStorage.getItem('website_music_enabled');
    if (storedPref === 'false') {
      userManuallyPausedRef.current = true;
    }
  }, []);

  const startSoundSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Clear existing active oscillators
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      oscillatorsRef.current = [];

      // Create master gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Pentatonic warm atmospheric chord frequencies (E minor ambient pad)
      const freqs = [164.81, 196.00, 246.94, 293.66, 329.63];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const noteGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow gentle frequency modulation (vibrato / warmth)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1 + idx * 0.05;
        lfoGain.gain.value = 1.5;
        lfo.connect(osc.frequency);
        lfo.start();

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.2 / freqs.length, ctx.currentTime + 3);

        if (panner) {
          panner.pan.value = (idx - 2) * 0.35;
          osc.connect(noteGain);
          noteGain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(noteGain);
          noteGain.connect(masterGain);
        }

        osc.start();
        oscillatorsRef.current.push(osc);
      });

      setIsPlaying(true);
      setIsAutoplayBlocked(false);
    } catch (err) {
      console.warn('Audio Autoplay policy / Synth initialization blocked:', err);
      setIsAutoplayBlocked(true);
      setIsPlaying(false);
    }
  };

  const stopSoundSynth = () => {
    try {
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      oscillatorsRef.current = [];
      setIsPlaying(false);
    } catch (e) {
      console.error('Error stopping synth:', e);
    }
  };

  const play = () => {
    userManuallyPausedRef.current = false;
    localStorage.setItem('website_music_enabled', 'true');
    startSoundSynth();
  };

  const pause = () => {
    userManuallyPausedRef.current = true;
    localStorage.setItem('website_music_enabled', 'false');
    stopSoundSynth();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setValueAtTime(vol * 0.15, audioCtxRef.current.currentTime);
      } catch (e) {}
    }
  };

  // Listen to unlock audio on first user gesture
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userManuallyPausedRef.current && settings?.enabled && settings?.autoplay && !isPlaying) {
        startSoundSynth();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      stopSoundSynth();
    };
  }, [settings]);

  return (
    <MusicAudioContext.Provider
      value={{
        isPlaying,
        isAutoplayBlocked,
        volume,
        trackTitle: settings?.track_title || 'Corporate Ambient',
        artistName: settings?.artist_name || 'Velametric Sound Studio',
        settings,
        togglePlayPause,
        pause,
        play,
        setVolume
      }}
    >
      {children}
    </MusicAudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(MusicAudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
};
