import React, { useEffect, useState, useRef } from 'react';
import { LEETCODE_USERNAME, SOCIAL_LINKS } from '../constants';
import { CursorContextType } from '../types';

interface LeetCodeProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

interface LeetCodeData {
  status: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
}

// Helper component for animated numbers with start trigger
const AnimatedCounter = ({ value, duration = 2000, start = false }: { value: number; duration?: number; start?: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    if (!start) {
        setCount(0); // Reset count when not visible to allow replay
        return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      if (progress < duration) {
        // Cubic Ease Out
        const progressRatio = progress / duration;
        const ease = 1 - Math.pow(1 - progressRatio, 3);
        
        if (isMounted) setCount(Math.floor(ease * value));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (isMounted) setCount(value);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, start]);

  return <>{count}</>;
};

const LeetCode: React.FC<LeetCodeProps> = ({ setCursorVariant }) => {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/profile`, {
          signal: controller.signal
        });
        const result = await response.json();
        if (result.errors || !result.totalSolved) {
          setError(true);
        } else {
          const totalSubs = result.totalSubmissions?.[0]?.submissions || 1;
          const acceptedSubs = result.matchedUserStats?.acSubmissionNum?.[0]?.submissions || 0;
          const acceptanceRate = Math.round((acceptedSubs / totalSubs) * 100);
          setData({ ...result, acceptanceRate });
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('Failed to fetch LeetCode data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // Intersection Observer to trigger animations EVERY time it is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (error) return null;

  const SocialIcon = ({ href, path, label }: { href: string; path: string, label: string }) => (
      <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-500 group"
      onMouseEnter={() => setCursorVariant('button')}
      onMouseLeave={() => setCursorVariant('default')}
      aria-label={label}
    >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d={path} />
        </svg>
    </a>
  );

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
          
          {/* Text & Social Section */}
          <div className="flex-1 text-center lg:text-left w-full flex flex-col justify-center">
            <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-xs font-mono text-yellow-500 tracking-[0.2em] uppercase mb-4 animate-pulse">
                Continuous Improvement
                </h2>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                Code <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Stats</span> <br className="hidden lg:block"/> & Socials
                </h2>
                <p className="text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-10 border-l-2 border-yellow-500/50 pl-4 text-lg">
                I actively solve algorithmic challenges to improve my problem-solving skills and optimize code performance. Follow my journey across platforms.
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    {/* LeetCode */}
                    <a
                    href={SOCIAL_LINKS.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 hover:border-yellow-500/50 rounded-full transition-all duration-500 group"
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode" className="w-5 h-5 filter brightness-0 invert" />
                    <span className="font-mono text-sm tracking-widest text-gray-300 group-hover:text-yellow-400 transition-colors">LeetCode</span>
                    </a>

                    {/* GitHub */}
                    <SocialIcon 
                        label="GitHub"
                        href={SOCIAL_LINKS.github} 
                        path="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" 
                    />
                    
                    {/* LinkedIn */}
                    <SocialIcon 
                        label="LinkedIn"
                        href={SOCIAL_LINKS.linkedin} 
                        path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
                    />

                    {/* X (Twitter) */}
                    <SocialIcon 
                        label="X (Twitter)"
                        href={SOCIAL_LINKS.x} 
                        path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
                    />
                </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="w-full lg:w-1/2 max-w-xl mx-auto lg:mx-0">
            <div className="relative group/spotlight w-full">
              {/* Spotlight border pseudo-element */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-transparent to-transparent rounded-[24px] z-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100" style={{
                  background: 'radial-gradient(circle 250px at var(--x) var(--y), rgba(250, 204, 21, 0.4), transparent 80%)'
              }}></div>
              
              <div 
                  onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.style.setProperty('--x', `${x}px`);
                          e.currentTarget.parentElement.style.setProperty('--y', `${y}px`);
                      }
                  }}
                  className={`relative w-full bg-[#0a0a0a] rounded-[24px] p-8 md:p-10 z-10 transition-all duration-700 hover:bg-[#111] border border-white/5 shadow-2xl ${
                    isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                  }`}
                  onMouseEnter={() => setCursorVariant('text')}
                  onMouseLeave={() => setCursorVariant('default')}
              >
                 {loading ? (
                   <div className="animate-pulse space-y-6 py-4">
                     <div className="h-16 bg-white/5 rounded-lg w-1/2 mb-8"></div>
                     <div className="h-4 bg-white/5 rounded w-full"></div>
                     <div className="h-4 bg-white/5 rounded w-full"></div>
                     <div className="h-4 bg-white/5 rounded w-full"></div>
                   </div>
                 ) : data ? (
                   <div className="flex flex-col gap-8 relative z-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                      
                      {/* Header Stats */}
                      <div className="flex justify-between items-end border-b border-white/10 pb-6 relative">
                          <div>
                              <span className="text-gray-500 text-xs uppercase tracking-[0.2em] font-mono">Total Solved</span>
                              <div className="text-6xl md:text-7xl font-bold text-white mt-2 font-mono tracking-tighter">
                                  <AnimatedCounter value={data.totalSolved} start={isInView} />
                              </div>
                          </div>
                          <div className="text-right">
                              <span className="text-gray-500 text-xs uppercase tracking-[0.2em] font-mono">Global Rank</span>
                              <div className="text-xl md:text-2xl font-bold text-yellow-400 mt-2">
                                  #<AnimatedCounter value={data.ranking} start={isInView} />
                              </div>
                          </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-6">
                          {/* Easy */}
                          <div>
                              <div className="flex justify-between text-xs mb-2">
                                  <span className="text-teal-400 font-bold tracking-wider">EASY</span>
                                  <span className="text-gray-400 font-mono">
                                      <span className="text-white"><AnimatedCounter value={data.easySolved} start={isInView} /></span> 
                                      <span className="opacity-50"> / {data.totalEasy}</span>
                                  </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-1000 ease-out" 
                                      style={{ width: isInView ? `${(data.easySolved / data.totalEasy) * 100}%` : '0%' }}
                                  ></div>
                              </div>
                          </div>
                          {/* Medium */}
                          <div>
                              <div className="flex justify-between text-xs mb-2">
                                  <span className="text-yellow-400 font-bold tracking-wider">MEDIUM</span>
                                  <span className="text-gray-400 font-mono">
                                      <span className="text-white"><AnimatedCounter value={data.mediumSolved} start={isInView} /></span>
                                      <span className="opacity-50"> / {data.totalMedium}</span>
                                  </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out delay-100" 
                                      style={{ width: isInView ? `${(data.mediumSolved / data.totalMedium) * 100}%` : '0%' }}
                                  ></div>
                              </div>
                          </div>
                          {/* Hard */}
                          <div>
                              <div className="flex justify-between text-xs mb-2">
                                  <span className="text-red-400 font-bold tracking-wider">HARD</span>
                                  <span className="text-gray-400 font-mono">
                                      <span className="text-white"><AnimatedCounter value={data.hardSolved} start={isInView} /></span>
                                      <span className="opacity-50"> / {data.totalHard}</span>
                                  </span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out delay-200" 
                                      style={{ width: isInView ? `${(data.hardSolved / data.totalHard) * 100}%` : '0%' }}
                                  ></div>
                              </div>
                          </div>
                      </div>

                      {/* Acceptance Rate - Right Aligned */}
                      <div className="flex justify-end pt-4">
                          <div className="text-right">
                              <span className="text-xs text-gray-500 block mb-1 font-mono uppercase tracking-wider">Acceptance</span>
                              <span className="text-2xl font-bold text-white">{data.acceptanceRate}%</span>
                          </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-red-400 py-10 text-center">Stats unavailable</div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeetCode;
