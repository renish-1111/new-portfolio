
import React, { useState, useEffect } from 'react';
import Hero3D from './components/Hero3D';
import Projects from './components/Projects';
import Skills from './components/Skills';
import LeetCode from './components/LeetCode';
import Experience from './components/Experience';
import AIChat from './components/AIChat';
import Cursor from './components/Cursor';
import { CursorContextType } from './types';
import { SOCIAL_LINKS } from './constants';

const App: React.FC = () => {
  const [cursorVariant, setCursorVariant] = useState<CursorContextType['cursorVariant']>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Helper to pass down cursor state
  const setCursor = (v: CursorContextType['cursorVariant']) => setCursorVariant(v);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden relative selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Global Noise Texture */}
      <div className="bg-noise"></div>

      <Cursor variant={cursorVariant} />
      
      {/* Navigation Header - Floating Island Style */}
      <div className="fixed top-0 left-0 w-full z-[70] flex justify-center pointer-events-none">
        <header 
            className={`pointer-events-auto transition-all duration-500 ease-huly mt-4 md:mt-6 ${
              scrolled 
                ? 'w-[90%] md:w-auto bg-[#111]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl px-6 py-3' 
                : 'w-full bg-transparent px-6 py-6'
            }`}
        >
            <div className={`flex justify-between items-center ${scrolled ? 'gap-12' : 'max-w-7xl mx-auto'}`}>
                {/* Logo */}
                <a 
                    href="#" 
                    onClick={(e) => handleNavClick(e, 'home')}
                    className="font-bold text-xl tracking-tight transition-colors relative z-50 group"
                    onMouseEnter={() => setCursor('button')} 
                    onMouseLeave={() => setCursor('default')}
                >
                    <span className="text-white">RENISH</span>
                    <span className="text-yellow-500 inline-block transform group-hover:scale-150 transition-transform duration-300">.</span>
                    <span className="text-gray-400 font-light">DEV</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-1 items-center">
                    {navLinks.map((link) => (
                    <a 
                        key={link.name}
                        href={`#${link.id}`} 
                        onClick={(e) => handleNavClick(e, link.id)}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                        onMouseEnter={() => setCursor('button')} 
                        onMouseLeave={() => setCursor('default')}
                    >
                        {link.name}
                    </a>
                    ))}
                </nav>

                 {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden text-white relative z-50 p-2 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    onMouseEnter={() => setCursor('button')} 
                    onMouseLeave={() => setCursor('default')}
                    aria-label="Toggle Menu"
                >
                    <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>
        </header>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center space-y-8 transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-3xl font-bold tracking-tight hover:text-yellow-400 transition-colors"
                onMouseEnter={() => setCursor('button')} 
                onMouseLeave={() => setCursor('default')}
              >
                {link.name}
              </a>
            ))}
      </div>

      <main>
        <Hero3D setCursorVariant={setCursor} />
        <Skills setCursorVariant={setCursor} id="about" />
        <Experience setCursorVariant={setCursor} id="experience" />
        <LeetCode setCursorVariant={setCursor} />
        <Projects setCursorVariant={setCursor} id="projects" />
        
        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tight">Let's Build Something <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Impossible</span>.</h2>
                <p className="text-gray-400 mb-12 max-w-lg mx-auto text-lg">
                    I'm currently available for freelance work and internship opportunities.
                </p>
                <a 
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="inline-block px-12 py-5 bg-white text-black rounded-full text-lg font-medium hover:bg-yellow-400 transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(234,179,8,0.5)]"
                    onMouseEnter={() => setCursor('button')}
                    onMouseLeave={() => setCursor('default')}
                >
                    Get In Touch
                </a>
            </div>
        </section>

        <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 bg-[#0a0a0a]">
            <div className="flex justify-center gap-6 mb-8">
                 {/* Footer Socials */}
                 {Object.entries(SOCIAL_LINKS).map(([key, url]) => (
                     key !== 'email' && key !== 'leetcode' && (
                        <a key={key} href={url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-yellow-500 transition-colors uppercase text-xs font-mono tracking-widest">
                            {key}
                        </a>
                     )
                 ))}
            </div>
            &copy; {new Date().getFullYear()} Renish Developer. All rights reserved.
        </footer>
      </main>

      <AIChat setCursorVariant={setCursor} />
      
    </div>
  );
};

export default App;
