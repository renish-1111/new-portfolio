import React, { useEffect, useRef, useState } from 'react';

interface CursorProps {
  variant: 'default' | 'text' | 'button';
}

const Cursor: React.FC<CursorProps> = ({ variant }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use refs to track position mutable state without triggering re-renders
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const trailerX = useRef(0);
  const trailerY = useRef(0);

  useEffect(() => {
    // Check if device is mobile/tablet or has touch input
    const checkMobile = () => {
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 1024; // Disable on tablets and smaller
      setIsMobile(hasCoarsePointer || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Initialize positions center screen to prevent jump
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    
    mouseX.current = startX;
    mouseY.current = startY;
    trailerX.current = startX;
    trailerY.current = startY;

    // Direct DOM update for the main cursor (Instant response, no lag)
    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);

    // Animation loop for the smooth trailing effect
    let animationFrameId: number;
    
    const animateTrailer = () => {
      // Linear interpolation (Lerp) for smooth following
      const speed = 0.15; // Higher = faster catch up, Lower = smoother lag
      
      trailerX.current += (mouseX.current - trailerX.current) * speed;
      trailerY.current += (mouseY.current - trailerY.current) * speed;

      if (trailerRef.current) {
        trailerRef.current.style.transform = `translate3d(${trailerX.current}px, ${trailerY.current}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animateTrailer);
    };

    animateTrailer();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        // mix-blend-difference ensures high visibility on any background
        return 'w-16 h-16 bg-white mix-blend-difference opacity-100 border-none';
      case 'text':
        return 'w-24 h-24 border-2 border-yellow-400 bg-transparent opacity-100';
      default:
        return 'w-4 h-4 bg-yellow-400 opacity-80';
    }
  };

  // Do not render custom cursor on mobile devices
  if (hidden || isMobile) return null;

  return (
    <>
      {/* Main cursor dot - Updates instantly via Event Listener */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full z-[9999] transition-[width,height,background-color,opacity,border] duration-300 ease-out ${getVariantClasses()}`}
        style={{ 
            willChange: 'transform',
            top: 0,
            left: 0
        }}
      />
      
      {/* Trailing ring - Updates via RAF Loop */}
      <div
        ref={trailerRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-yellow-400/50 rounded-full pointer-events-none z-[9998] transition-opacity duration-300 ${variant === 'default' ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
            willChange: 'transform',
            top: 0,
            left: 0
        }}
      />
    </>
  );
};

export default Cursor;