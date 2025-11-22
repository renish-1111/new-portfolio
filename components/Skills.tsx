import React, { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../constants';
import { CursorContextType } from '../types';

interface SkillsProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
  id?: string;
}

const Skills: React.FC<SkillsProps> = ({ setCursorVariant, id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Update visibility state whenever intersection changes to trigger animation replay
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id={id}
      ref={sectionRef} 
      className="py-32 px-4 md:px-20 bg-[#0a0a0a] relative z-10 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-yellow-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className={`text-center mb-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">Arsenal</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
                A curated list of technologies I use to build digital products.
            </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill, idx) => (
            <div 
                key={idx}
                className={`group relative bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-yellow-500/30 rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: isVisible ? `${idx * 100}ms` : '0ms' }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
            >
                {/* Card Corner Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 group-hover:border-yellow-400/50 rounded-tl transition-colors duration-300" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 group-hover:border-yellow-400/50 rounded-br transition-colors duration-300" />
                
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <span className="text-xs font-mono text-yellow-500/70 tracking-wider uppercase">{skill.category}</span>
                        <h3 className="text-2xl font-bold text-white group-hover:text-yellow-100 transition-colors">{skill.name}</h3>
                    </div>
                    <div className="text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors font-mono">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Proficiency</span>
                        <span className="text-yellow-400 font-mono">{skill.level}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                        {/* Moving Gradient Fill */}
                        <div 
                            className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 relative overflow-hidden rounded-full"
                            style={{ 
                                width: isVisible ? `${skill.level}%` : '0%',
                                transition: `width 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${isVisible ? idx * 100 + 300 : 0}ms`
                            }}
                        >
                            {/* Shine effect inside bar using custom class */}
                            <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;