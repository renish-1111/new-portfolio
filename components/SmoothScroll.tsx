import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
  useEffect(() => {
    // Disable Lenis on mobile/touch devices — native momentum scroll is faster
    // and Lenis intercepts touch events causing jank
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 1024;

    if (isTouchDevice) {
      // Make sure __lenis is null so scroll helpers fall back to window.scrollY
      (window as any).__lenis = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return null;
};

export default SmoothScroll;
