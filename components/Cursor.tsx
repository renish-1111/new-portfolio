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
    let prevPoints: {x: number, y: number}[] = [];
    
    const animateTrailer = () => {
      // Linear interpolation (Lerp) for smooth following
      const speed = 0.2; // Higher = faster catch up, Lower = smoother lag
      
      trailerX.current += (mouseX.current - trailerX.current) * speed;
      trailerY.current += (mouseY.current - trailerY.current) * speed;

      // Keep track of previous points for the trailing blur effect
      prevPoints.push({x: trailerX.current, y: trailerY.current});
      if(prevPoints.length > 8) prevPoints.shift();

      if (trailerRef.current) {
        trailerRef.current.style.transform = `translate3d(${trailerX.current}px, ${trailerY.current}px, 0) translate(-50%, -50%)`;
        
        // Calculate stretch/squeeze based on movement speed
        const deltaX = mouseX.current - trailerX.current;
        const deltaY = mouseY.current - trailerY.current;
        const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Squeeze cursor when moving fast
        if (cursorRef.current && variant === 'default') {
           const scaleY = Math.max(0.6, 1 - (velocity * 0.005));
           const scaleX = Math.min(1.4, 1 + (velocity * 0.005));
           
           // Calculate angle for the stretch
           const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
           
           cursorRef.current.style.transform = `translate3d(${mouseX.current}px, ${mouseY.current}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        }
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
  }, [isMobile, variant]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'w-16 h-16 bg-white mix-blend-difference opacity-100 border-none scale-100';
      case 'text':
        return 'w-24 h-24 border border-yellow-400 bg-yellow-500/10 backdrop-blur-[2px] opacity-100 scale-100 mix-blend-screen';
      default:
        return 'w-3 h-3 bg-white mix-blend-difference shadow-[0_0_15px_rgba(255,255,255,0.8)] opacity-100';
    }
  };

  // Do not render custom cursor on mobile devices
  if (hidden || isMobile) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full z-[9999] transition-[width,height,background-color,border-radius,backdrop-filter] duration-300 ease-out ${getVariantClasses()}`}
        style={{ 
            willChange: 'transform',
            top: 0,
            left: 0,
            transformOrigin: 'center'
        }}
      />
      
      {/* Trailing ring */}
      <div
        ref={trailerRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-white mix-blend-difference rounded-full pointer-events-none z-[9998] transition-[opacity,width,height] duration-300 ${variant === 'default' ? 'opacity-30' : 'opacity-0 scale-50'}`}
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
