import React, { useRef, useState, useEffect } from 'react';
import { EXPERIENCE } from '../constants';
import { CursorContextType } from '../types';

interface ExperienceProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
  id?: string;
}

const Experience: React.FC<ExperienceProps> = ({ setCursorVariant, id }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={sectionRef} className="py-24 px-6 md:px-20 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 top-1/3 w-px h-1/2 bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent hidden md:block" />
      
      <div className="max-w-5xl mx-auto">
        <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-xs font-mono text-yellow-500 tracking-widest uppercase mb-2">
            Career Path
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Experience</span>
          </h2>
        </div>

        <div className="relative space-y-12 md:space-y-0">
            {/* Central Timeline Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 transform -translate-x-1/2"></div>

            {EXPERIENCE.map((job, idx) => (
                <div key={idx} className={`relative md:flex items-center justify-between group ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Timeline Dot */}
                    <div className={`hidden md:block absolute left-1/2 top-1/2 w-4 h-4 rounded-full border-2 border-yellow-500 bg-black transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ transitionDelay: `${idx * 200}ms` }}>
                        <div className="w-full h-full bg-yellow-500/50 rounded-full animate-ping" />
                    </div>

                    {/* Date Side (Desktop) */}
                    <div className={`hidden md:block w-5/12 text-center ${idx % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                        <span className={`inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-yellow-400 font-mono text-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : idx % 2 === 0 ? 'opacity-0 translate-x-10' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: `${idx * 200 + 200}ms` }}>
                            {job.start} — {job.end}
                        </span>
                    </div>

                    {/* Mobile Date */}
                    <div className="md:hidden mb-2 pl-4 border-l-2 border-yellow-500/50">
                        <span className="text-yellow-400 font-mono text-sm">
                            {job.start} — {job.end}
                        </span>
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-5/12">
                        <a 
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative block bg-[#111] border border-white/5 p-6 rounded-2xl transition-all duration-700 hover:border-yellow-500/30 hover:bg-[#151515] group/card flex items-center gap-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                            style={{ transitionDelay: `${idx * 200}ms` }}
                            onMouseEnter={() => setCursorVariant('button')}
                            onMouseLeave={() => setCursorVariant('default')}
                        >
                            {/* Company Logo */}
                            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-inner relative group-hover/card:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                            </div>
                            
                            {/* Role & Company Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 truncate group-hover/card:text-yellow-100 transition-colors flex items-center gap-2">
                                    {job.company}
                                    <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </h3>
                                <h4 className="text-sm md:text-base text-yellow-500 font-medium tracking-wide uppercase">{job.role}</h4>
                            </div>
                        </a>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;