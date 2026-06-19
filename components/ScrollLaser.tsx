import React, { useEffect, useRef } from 'react';
import { onLenisScroll } from '../utils/lenis';

const ScrollLaser: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return onLenisScroll((scroll) => {
      if (!barRef.current) return;

      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = windowHeight > 0
        ? Math.max(0, Math.min(100, (scroll / windowHeight) * 100))
        : 0;

      barRef.current.style.width = `${pct}%`;
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none mix-blend-screen">
      <div 
        ref={barRef}
        className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-white shadow-[0_0_15px_rgba(253,224,71,1),0_0_30px_rgba(253,224,71,0.5)] relative"
        style={{ width: '0%', willChange: 'width' }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[4px] shadow-[0_0_20px_rgba(255,255,255,1)] opacity-80" />
      </div>
    </div>
  );
};

export default ScrollLaser;
