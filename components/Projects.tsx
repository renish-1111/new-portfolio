
import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { CursorContextType, Project } from '../types';

interface ProjectsProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
  id?: string;
}

interface ProjectCardProps {
    project: Project;
    index: number;
    setCursorVariant: CursorContextType['setCursorVariant'];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, setCursorVariant }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current || !contentRef.current || !imageRef.current) return;
    
    // Disable tilt on small screens
    if (window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (reduced intensity for high-end feel)
    const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg
    const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg

    // Direct DOM manipulation for performance (No React Render Cycle)
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Move Spotlight Glow
    glowRef.current.style.opacity = '1';
    glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 80%)`;

    // Parallax Content
    contentRef.current.style.transform = `translateZ(20px)`;
    imageRef.current.style.transform = `scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current || !contentRef.current || !imageRef.current) return;
    
    // Reset transforms
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glowRef.current.style.opacity = '0';
    contentRef.current.style.transform = 'translateZ(0px)';
    imageRef.current.style.transform = 'scale(1.0)';
    
    setCursorVariant('default');
  };

  const handleMouseEnter = () => {
    setCursorVariant('button');
  };

  return (
    <div
      className={`relative w-full transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="group relative w-full bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl hover:shadow-yellow-900/10 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Spotlight Glow Overlay */}
        <div 
            ref={glowRef}
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 opacity-0 mix-blend-overlay"
        />

        {/* Image Section (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video overflow-hidden border-b border-white/5 bg-[#1a1a1a]">
            <div className="absolute inset-0 bg-gray-800 animate-pulse z-0" /> {/* Loading placeholder */}
            <img 
                ref={imageRef}
                src={project.image} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 will-change-transform"
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent opacity-60 z-10" />
            
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 opacity-50" />
        </div>

        {/* Content Section */}
        <div ref={contentRef} className="p-6 md:p-8 relative z-10 bg-[#0f0f0f] transition-transform duration-300 ease-out">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">{project.title}</h3>
                <a 
                    href={project.link}
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 group-hover:rotate-45"
                    aria-label="View Project"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors">
                {project.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                    <span 
                        key={t} 
                        className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-yellow-500/80 bg-yellow-900/10 border border-yellow-500/10 rounded-full group-hover:border-yellow-500/30 transition-colors"
                    >
                        {t}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC<ProjectsProps> = ({ setCursorVariant, id }) => {
  return (
    <section id={id} className="py-24 px-6 md:px-20 bg-[#0a0a0a] relative overflow-hidden">
        
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-yellow-900/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="flex flex-col items-center text-center mb-20">
                <h2 className="text-xs font-mono text-yellow-500 tracking-[0.2em] uppercase mb-4">
                    Selected Works
                </h2>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Projects</span>
                </h2>
                <div className="w-px h-16 bg-gradient-to-b from-yellow-500/50 to-transparent"></div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {PROJECTS.map((project, index) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={index} 
                        setCursorVariant={setCursorVariant} 
                    />
                ))}
            </div>
        </div>
    </section>
  );
};

export default Projects;
