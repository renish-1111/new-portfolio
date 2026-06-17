import React, { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../constants';
import { CursorContextType } from '../types';
import { 
  SiPython, 
  SiReact, 
  SiTypescript, 
  SiNodedotjs, 
  SiPostgresql, 
  SiMongodb, 
  SiDocker, 
  SiJenkins, 
  SiGit,
  SiFrappe,
  SiErpnext
} from 'react-icons/si';
import { FaServer } from 'react-icons/fa';


interface SkillsProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
  id?: string;
}

const getSkillIcon = (name: string) => {
  switch (name) {
    case 'Python': return <SiPython className="w-10 h-10" />;
    case 'React / Next.js': return <SiReact className="w-10 h-10" />;
    case 'TypeScript': return <SiTypescript className="w-10 h-10" />;
    case 'Node.js / Express': return <SiNodedotjs className="w-10 h-10" />;
    case 'Git / GitHub': return <SiGit className="w-10 h-10" />;
    case 'PostgreSQL': return <SiPostgresql className="w-10 h-10" />;
    case 'MongoDB': return <SiMongodb className="w-10 h-10" />;
    case 'Docker': return <SiDocker className="w-10 h-10" />;
    case 'Jenkins': return <SiJenkins className="w-10 h-10" />;
    case 'Frappe': return <SiFrappe className="w-10 h-10" />;
    case 'ERPNext': return <SiErpnext className="w-10 h-10" />;
    default: return <FaServer className="w-10 h-10" />;
  }
};

const Skills: React.FC<SkillsProps> = ({ setCursorVariant, id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
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
      className="pt-32 pb-10 px-4 md:px-20 bg-transparent relative z-10 overflow-hidden"
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
                    key={skill.name}
                    className={`group relative glass-card hover:border-yellow-500/30 p-5 transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                    style={{ transitionDelay: isVisible ? `${idx * 100}ms` : '0ms' }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                >
                    {/* Card Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-yellow-400/50 rounded-tl transition-colors duration-500" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-yellow-400/50 rounded-br transition-colors duration-500" />
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-yellow-500/70 tracking-wider uppercase">{skill.category}</span>
                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-100 transition-colors">{skill.name}</h3>
                        </div>
                        <div className="text-white/10 group-hover:text-yellow-500/50 transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                            {getSkillIcon(skill.name)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Proficiency</span>
                            <span className="text-yellow-400 font-mono">{skill.level}%</span>
                        </div>
                        
                        {/* Progress Bar Container */}
                        <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                            {/* Moving Gradient Fill */}
                            <div 
                                className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 relative overflow-hidden rounded-full"
                                style={{ 
                                    width: isVisible ? `${skill.level}%` : '0%',
                                    transition: `width 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${isVisible ? idx * 100 + 300 : 0}ms`
                                }}
                            >
                                {/* Shine effect inside bar using custom class */}
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