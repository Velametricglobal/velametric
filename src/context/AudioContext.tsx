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

// High quality, reliable royalty-free ambient audio tracks with fallback URLs
const AMBIENT_AUDIO_SOURCES = [
  'https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
];

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [settings, setSettings] = useState<BackgroundMusicSettings | null>(null);
  const [volume, setVolumeState] = useState<number>(0.35); // Default 35% audible comfortable volume
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<any | null>(null);
  const oscillatorsRef = useRef<any[]>([]);
  const synthGainRef = useRef<GainNode | null>(null);
  const userManuallyPausedRef = useRef<boolean>(false);
  const isUsingSynthRef = useRef<boolean>(false);

  useEffect(() => {
    // Load Admin Music Settings
    settingsService.getMusicSettings().then(cfg => {
      setSettings(cfg);
      if (cfg) {
        const initialVol = (cfg.default_volume || 35) / 100;
        setVolumeState(initialVol);
      }
    }).catch(err => {
      console.warn('Error loading music settings:', err);
    });

    const storedPref = localStorage.getItem('website_music_enabled');
    if (storedPref === 'false') {
      userManuallyPausedRef.current = true;
    }
  }, []);

  // Initialize or update HTML5 Audio Element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = volume;

      const primaryUrl = settings?.audio_url || AMBIENT_AUDIO_SOURCES[0];
      audio.src = primaryUrl;

      audio.addEventListener('play', () => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      });

      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      audio.addEventListener('error', () => {
        console.warn('HTML5 Audio error on primary stream. Activating backup audio or synth engine...');
        // Fallback to secondary source or synth
        if (audio.src !== AMBIENT_AUDIO_SOURCES[1]) {
          audio.src = AMBIENT_AUDIO_SOURCES[1];
          if (!userManuallyPausedRef.current) {
            audio.play().catch(() => startSynthFallback());
          }
        } else {
          startSynthFallback();
        }
      });

      audioElementRef.current = audio;
    } else {
      audioElementRef.current.volume = volume;
      if (settings?.audio_url && audioElementRef.current.src !== settings.audio_url) {
        audioElementRef.current.src = settings.audio_url;
      }
    }

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      stopSynthFallback();
    };
  }, [settings]);

  // Fallback Harmonic Ambient Web Audio Synthesizer (Zero Network Required)
  const startSynthFallback = () => {
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

      stopSynthFallback();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0.1, volume * 0.3), ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Warm cinematic ambient chord (C major 9th pad: C3, G3, B3, D4, E4)
      const freqs = [130.81, 196.00, 246.94, 293.66, 329.63];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle organic shimmer
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.15 + idx * 0.05;
        lfoGain.gain.value = 2.0;
        lfo.connect(osc.frequency);
        lfo.start();

        noteGain.gain.setValueAtTime(0.01, ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.3 / freqs.length, ctx.currentTime + 1.5);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        oscillatorsRef.current.push({ osc, lfo });
      });

      isUsingSynthRef.current = true;
      setIsPlaying(true);
      setIsAutoplayBlocked(false);
    } catch (err) {
      console.warn('Synth fallback error:', err);
    }
  };

  const stopSynthFallback = () => {
    oscillatorsRef.current.forEach(({ osc, lfo }) => {
      try {
        osc.stop();
        osc.disconnect();
        lfo.stop();
        lfo.disconnect();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
    isUsingSynthRef.current = false;
  };

  const play = () => {
    userManuallyPausedRef.current = false;
    localStorage.setItem('website_music_enabled', 'true');

    if (audioElementRef.current) {
      audioElementRef.current.volume = volume;
      audioElementRef.current.play().then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      }).catch((err) => {
        console.warn('Audio play request blocked or failed:', err);
        startSynthFallback();
      });
    } else {
      startSynthFallback();
    }
  };

  const pause = () => {
    userManuallyPausedRef.current = true;
    localStorage.setItem('website_music_enabled', 'false');

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    stopSynthFallback();
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);

    if (audioElementRef.current) {
      audioElementRef.current.volume = clamped;
    }
    if (synthGainRef.current && audioCtxRef.current) {
      try {
        synthGainRef.current.gain.setValueAtTime(Math.max(0.05, clamped * 0.3), audioCtxRef.current.currentTime);
      } catch (e) {}
    }
  };

  // Smart Autoplay unlock on first user gesture (click, scroll, keypress)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userManuallyPausedRef.current && (!settings || settings.enabled !== false)) {
        if (!isPlaying) {
          play();
        }
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      cleanupListeners();
    };
  }, [settings, isPlaying]);

  return (
    <MusicAudioContext.Provider
      value={{
        isPlaying,
        isAutoplayBlocked,
        volume,
        trackTitle: settings?.track_title || 'Corporate Ambient Space',
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
