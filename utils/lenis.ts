type LenisInstance = {
  scroll: number;
  on: (event: string, callback: (args: { scroll: number }) => void) => void;
  off: (event: string, callback: (args: { scroll: number }) => void) => void;
};

export function getLenis(): LenisInstance | undefined {
  return (window as Window & { __lenis?: LenisInstance }).__lenis ?? undefined;
}

export function onLenisScroll(callback: (scroll: number) => void): () => void {
  let detach: (() => void) | undefined;

  const attachLenis = () => {
    const lenis = getLenis();
    if (!lenis) return false;
    const handler = ({ scroll }: { scroll: number }) => callback(scroll);
    lenis.on('scroll', handler);
    callback(lenis.scroll);
    detach = () => lenis.off('scroll', handler);
    return true;
  };

  // Native scroll fallback for mobile (when Lenis is disabled)
  const attachNative = () => {
    const handler = () => callback(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    callback(window.scrollY);
    detach = () => window.removeEventListener('scroll', handler);
  };

  // If Lenis is already available, attach immediately
  if (attachLenis()) {
    return () => detach?.();
  }

  // Poll briefly to see if Lenis starts up; if not, fall back to native scroll
  let attempts = 0;
  const intervalId = window.setInterval(() => {
    attempts++;
    if (attachLenis()) {
      window.clearInterval(intervalId);
    } else if (attempts >= 10) {
      // Lenis not coming — use native scroll
      window.clearInterval(intervalId);
      attachNative();
    }
  }, 50);

  return () => {
    window.clearInterval(intervalId);
    detach?.();
  };
}
