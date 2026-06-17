import React, { useEffect, useRef } from 'react';

const ScrollLaser: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      if (barRef.current) {
        // Use Lenis scroll if available for perfectly synced smooth scroll position, fallback to standard scroll
        const lenis = (window as any).__lenis;
        const totalScroll = lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop);
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        let scroll = 0;
        if (windowHeight > 0) {
          scroll = (totalScroll / windowHeight) * 100;
        }
        
        // Clamp between 0 and 100
        scroll = Math.max(0, Math.min(100, scroll));
        
        // Direct DOM manipulation is much faster and truly real-time compared to React state
        barRef.current.style.width = `${scroll}%`;
      }
      animationFrameId = requestAnimationFrame(updateScroll);
    };

    animationFrameId = requestAnimationFrame(updateScroll);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none mix-blend-screen">
      <div 
        ref={barRef}
        className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-white shadow-[0_0_15px_rgba(253,224,71,1),0_0_30px_rgba(253,224,71,0.5)] relative"
        style={{ width: '0%', willChange: 'width' }}
      >
        {/* Glow point at the end of the laser */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[4px] shadow-[0_0_20px_rgba(255,255,255,1)] opacity-80" />
      </div>
    </div>
  );
};

export default ScrollLaser;
