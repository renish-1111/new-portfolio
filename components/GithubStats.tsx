import React, { useState, useEffect, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { SOCIAL_LINKS } from '../constants';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const GithubStats: React.FC<Props> = ({ setCursorVariant }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Extract username from github link
  const githubUsername = SOCIAL_LINKS.github.split('/').pop() || 'renish-1111';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = windowWidth < 768;
  const blockSize = isMobile ? 10 : 12;
  const blockMargin = isMobile ? 3 : 5;
  const fontSize = isMobile ? 10 : 12;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current || !contentRef.current || isMobile) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    contentRef.current.style.transform = 'translateZ(30px)';
    
    glowRef.current.style.opacity = '1';
    glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(234,179,8,0.2), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current || !contentRef.current || isMobile) return;
    
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    contentRef.current.style.transform = 'translateZ(0px)';
    glowRef.current.style.opacity = '0';
    setCursorVariant('default');
  };

  return (
    <div 
      ref={sectionRef} 
      className={`py-12 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
      <style>
        {`
          @keyframes waveIn {
            0% { opacity: 0; transform: scale(0.1) translateY(10px); }
            50% { opacity: 1; transform: scale(1.2) translateY(-2px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          @keyframes blockShine {
            0% { filter: brightness(1) drop-shadow(0 0 0 rgba(234,179,8,0)); }
            50% { filter: brightness(1.5) drop-shadow(0 0 6px rgba(234,179,8,0.9)); }
            100% { filter: brightness(1) drop-shadow(0 0 0 rgba(234,179,8,0)); }
          }
          
          ${isVisible ? Array.from({ length: 55 }).map((_, i) => `
            .react-activity-calendar svg > g > g:nth-child(${i + 1}) rect {
              animation: waveIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                         blockShine 0.8s ease-in-out forwards;
              animation-delay: ${i * 0.03}s, ${i * 0.03 + 0.3}s;
              opacity: 0;
              transform-origin: center;
              transform-box: fill-box;
              rx: 2px;
              ry: 2px;
            }
          `).join('') : ''}
          
          /* Fallback if rects are flat */
          ${isVisible ? Array.from({ length: 370 }).map((_, i) => `
            .react-activity-calendar svg > g > rect:nth-child(${i + 1}) {
              animation: waveIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                         blockShine 0.8s ease-in-out forwards;
              animation-delay: ${(i % 53) * 0.03 + (i % 7) * 0.015}s, ${(i % 53) * 0.03 + (i % 7) * 0.015 + 0.3}s;
              opacity: 0;
              transform-origin: center;
              transform-box: fill-box;
              rx: 2px;
              ry: 2px;
            }
          `).join('') : ''}

          .react-activity-calendar text {
            fill: #a3a3a3 !important;
            font-family: 'Space Grotesk', sans-serif !important;
          }
        `}
      </style>

      <div className="flex flex-col items-center text-center mb-8 md:mb-12 relative">
          {/* Ambient background glow for title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />

          <h2 className="text-xs font-mono text-yellow-500 tracking-[0.2em] uppercase mb-4 animate-pulse">
              Daily Grind
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Contributions</span>
          </h2>
          <div className="w-px h-10 bg-gradient-to-b from-yellow-500/50 to-transparent"></div>
      </div>

      <div className="relative w-full" style={{ perspective: '1000px' }}>
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setCursorVariant('text')}
          className="relative glass-card p-4 md:p-10 w-full overflow-hidden flex justify-center group hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.2)] transition-transform duration-300 ease-out transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Hover Spotlight Glow */}
          <div 
              ref={glowRef}
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 opacity-0 mix-blend-screen"
          />

          <div 
            ref={contentRef}
            className="relative z-10 w-full overflow-x-auto md:overflow-x-visible overflow-y-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent flex justify-start lg:justify-center transition-transform duration-300 ease-out"
          >
            <div className="min-w-max pr-4 md:pr-0">
              <GitHubCalendar 
                username={githubUsername} 
                year={new Date().getFullYear()}
                colorScheme="dark"
                theme={{
                  light: ['rgba(255,255,255,0.05)', '#fde047', '#eab308', '#ca8a04', '#a16207'],
                  dark: ['rgba(255,255,255,0.05)', 'rgba(253, 224, 71, 0.4)', 'rgba(234, 179, 8, 0.6)', 'rgba(202, 138, 4, 0.8)', 'rgba(161, 98, 7, 1)']
                }}
                fontSize={fontSize}
                blockSize={blockSize}
                blockMargin={blockMargin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubStats;
