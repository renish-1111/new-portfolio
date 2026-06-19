import React, { useEffect, useState } from 'react';

const BOOT_MESSAGES = [
  "[OK] Boot sequence initiated...",
  "[OK] Loading kernel modules...",
  "[OK] Mounting root file system...",
  "Starting network interface...",
  "[OK] Network interface established.",
  "Fetching remote dependencies...",
  "Initializing WebGL context...",
  "[OK] WebGL ready.",
  "Loading 3D assets...",
  "Waking up AI core...",
  "Bypassing mainframe security...",
  "[WARNING] Security breach detected.",
  "Ignoring warning. Proceeding...",
  "Loading complete."
];

// On mobile: faster tick so the preloader clears quicker
const isMobile =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

const TICK_MS = isMobile ? 60 : 120;           // interval between progress steps
const MSG_TICK_MS = isMobile ? 120 : 250;      // interval between terminal messages
const DISMISS_DELAY = isMobile ? 300 : 800;    // how long to wait after 100% before hiding

const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    let messageIndex = 0;

    const progressInterval = setInterval(() => {
      const increment = currentProgress > 70
        ? Math.floor(Math.random() * (isMobile ? 30 : 20)) + (isMobile ? 15 : 10)
        : Math.floor(Math.random() * (isMobile ? 15 : 10)) + (isMobile ? 5 : 2);

      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(currentProgress);
        clearInterval(progressInterval);
        setMessages(prev => [...prev, BOOT_MESSAGES[BOOT_MESSAGES.length - 1]]);

        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => {
            document.body.style.overflow = 'unset';
          }, 600);
        }, DISMISS_DELAY);
      } else {
        setProgress(currentProgress);
      }
    }, TICK_MS);

    const messageInterval = setInterval(() => {
      if (messageIndex < BOOT_MESSAGES.length - 1 && currentProgress < 100) {
        setMessages(prev => {
          const newMessages = [...prev, BOOT_MESSAGES[messageIndex]];
          return newMessages.length > 6 ? newMessages.slice(newMessages.length - 6) : newMessages;
        });
        messageIndex++;
      }
    }, MSG_TICK_MS);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] origin-top ${isLoaded ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Noise texture — skip on mobile to reduce paint work */}
      {!isMobile && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
      )}

      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col justify-end h-full pb-24 sm:pb-32">

        {/* Terminal messages — hidden on mobile to reduce DOM updates */}
        {!isMobile && (
          <div className="flex flex-col gap-1 mb-8 font-mono text-[10px] sm:text-xs text-green-500/80 text-left h-32 justify-end overflow-hidden">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`animate-[waveIn_0.2s_ease-out_forwards] ${msg.includes('[WARNING]') ? 'text-red-500' : ''}`}
              >
                <span className="text-gray-600 mr-2">{new Date().toISOString().split('T')[1].slice(0, -1)}</span>
                {msg}
              </div>
            ))}
            <div className="animate-pulse w-2 h-3 bg-green-500 mt-1" />
          </div>
        )}

        {/* Mobile: simple label instead of terminal */}
        {isMobile && (
          <div className="mb-8 font-mono text-xs text-yellow-500/70 text-left animate-pulse">
            {messages[messages.length - 1] ?? '[OK] Initializing...'}
          </div>
        )}

        <div className="flex justify-between items-end mb-2">
          <span className="font-mono text-sm tracking-widest text-gray-400 uppercase">
            {isMobile ? 'Loading' : 'System Init'}
          </span>
          <span className="font-mono text-yellow-500 font-bold">{progress}%</span>
        </div>

        <div className="w-full h-[2px] bg-white/10 overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-yellow-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full h-px bg-yellow-500/20 blur-sm mt-1" />
      </div>
    </div>
  );
};

export default Preloader;
