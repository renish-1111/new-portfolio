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
        
        setCount(Math.floor(ease * value));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
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
    const fetchData = async () => {
      try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
        const result = await response.json();
        if (result.status === 'success') {
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer to trigger animations EVERY time it is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting); // Update state based on visibility
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
      rel="noreferrer"
      className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 group"
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
    <section ref={sectionRef} className="py-20 px-6 md:px-20 bg-[#0f0f0f] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          
          {/* Text & Social Section */}
          <div className="flex-1 text-center md:text-left w-full">
            <h2 className="text-xs font-mono text-yellow-500 tracking-widest uppercase mb-2">
              Continuous Improvement
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Code <span className="text-yellow-400">Stats</span> & Socials
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              I actively solve algorithmic challenges to sharpen my problem-solving skills. 
              Connect with me on social platforms or check my coding activity.
            </p>
            
            {/* Social Icons Row */}
            <div className="flex gap-4 justify-center md:justify-start mb-8">
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
                {/* Instagram */}
                <SocialIcon 
                    label="Instagram"
                    href={SOCIAL_LINKS.instagram} 
                    path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                />
                {/* X (Twitter) */}
                <SocialIcon 
                    label="X (Twitter)"
                    href={SOCIAL_LINKS.x} 
                    path="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" 
                />
            </div>
            
            <a 
              href={`https://leetcode.com/${LEETCODE_USERNAME}`} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white border-b border-yellow-500 pb-1 hover:text-yellow-400 transition-colors group"
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <span className="font-mono uppercase tracking-wider text-sm">View Full Profile</span>
              <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Stats Card */}
          <div className="flex-1 w-full md:w-auto md:min-w-[400px]">
            <div 
                className="bg-[#161616] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden hover:border-yellow-500/30 transition-colors duration-500 shadow-2xl group"
                onMouseEnter={() => setCursorVariant('default')}
            >
               {/* Dynamic Background Animation */}
               <div className={`absolute top-0 -right-20 w-80 h-80 bg-yellow-600/10 rounded-full blur-[80px] pointer-events-none animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-700 ${isInView ? 'scale-100' : 'scale-90'}`} />
               <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none group-hover:animate-pulse group-hover:bg-orange-600/20 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

               {loading ? (
                 <div className="animate-pulse space-y-6">
                   <div className="h-10 bg-white/5 rounded w-1/3"></div>
                   <div className="space-y-3">
                    <div className="h-2 bg-white/5 rounded w-full"></div>
                    <div className="h-2 bg-white/5 rounded w-2/3"></div>
                   </div>
                 </div>
               ) : data ? (
                 <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <span className="text-gray-500 text-xs uppercase tracking-[0.2em] font-mono">Total Solved</span>
                            <div className="text-6xl font-bold text-white mt-2 font-mono tracking-tighter">
                                <AnimatedCounter value={data.totalSolved} start={isInView} />
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-500 text-xs uppercase tracking-[0.2em] font-mono">Global Rank</span>
                            <div className="text-xl font-bold text-yellow-400 mt-2">
                                #<AnimatedCounter value={data.ranking} start={isInView} />
                            </div>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-5">
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
                                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-[1500ms] ease-out" 
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
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-[1500ms] ease-out delay-100" 
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
                                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-[1500ms] ease-out delay-200" 
                                    style={{ width: isInView ? `${(data.hardSolved / data.totalHard) * 100}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Acceptance Rate - Right Aligned */}
                    <div className="flex justify-end pt-2">
                        <div className="text-right">
                            <span className="text-xs text-gray-500 block mb-1 font-mono uppercase tracking-wider">Acceptance</span>
                            <span className="text-lg font-bold text-white">{data.acceptanceRate}%</span>
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
    </section>
  );
};

export default LeetCode;