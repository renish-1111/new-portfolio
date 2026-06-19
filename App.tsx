import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

import Cursor from './components/Cursor';
import SmoothScroll from './components/SmoothScroll';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';
import MagneticButton from './components/MagneticButton';
import ScrollLaser from './components/ScrollLaser';
import { CursorContextType } from './types';
import { SOCIAL_LINKS } from './constants';
import { onLenisScroll } from './utils/lenis';

const App: React.FC = () => {
  const [cursorVariant, setCursorVariant] = useState<CursorContextType['cursorVariant']>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onLenisScroll((scroll) => setScrolled(scroll > 50)), []);

  // Lock body scroll when mobile menu is open, handle escape key and focus trap
  useEffect(() => {
    if (isMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        
        // Basic focus trap
        if (e.key === 'Tab' && menuRef.current) {
          const focusableElements = menuRef.current.querySelectorAll('a[href]');
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      // Focus first link on open
      setTimeout(() => {
        const firstLink = menuRef.current?.querySelector('a');
        firstLink?.focus();
      }, 100);
      
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'About', path: '#about' },
    { name: 'Experience', path: '#experience' },
    { name: 'Projects', path: '#projects' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (path === '#') {
      (window as any).__lenis?.scrollTo(0, { immediate: false });
    } else {
      (window as any).__lenis?.scrollTo(path, { immediate: false });
    }
  };

  return (
    <div className="bg-transparent min-h-screen text-white overflow-x-hidden relative selection:bg-yellow-500/30 selection:text-yellow-200">
        <Preloader />
        
        {/* Global Noise Texture */}
        <div className="bg-noise"></div>

        <Cursor variant={cursorVariant} />
        <SmoothScroll />
        <ScrollLaser />
        
        {/* Navigation Header - Floating Island Style */}
        <div className="fixed top-0 left-0 w-full z-[70] flex justify-center pointer-events-none">
          <header 
              className={`pointer-events-auto transition-all duration-700 ease-in-out mt-4 md:mt-6 ${
                scrolled 
                  ? 'w-[90%] md:w-auto glass rounded-full px-6 py-3' 
                  : 'w-full bg-transparent px-6 py-6'
              }`}
          >
              <div className={`flex justify-between items-center ${scrolled ? 'gap-12' : 'max-w-7xl mx-auto'}`}>
                  {/* Logo */}
                  <a 
                      href="#" 
                      onClick={(e) => handleNavClick(e, '#')}
                      className="font-bold text-xl tracking-tight transition-colors relative z-50 group"
                      onMouseEnter={() => setCursorVariant('button')} 
                      onMouseLeave={() => setCursorVariant('default')}
                  >
                      <span className="text-white">RENISH</span>
                      <span className="text-yellow-500 inline-block transform group-hover:scale-150 transition-transform duration-700">.</span>
                      <span className="text-gray-400 font-light">DEV</span>
                  </a>

                  {/* Desktop Nav */}
                  <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                      {navLinks.map((link) => (
                      <MagneticButton 
                          key={link.name}
                          href={link.path}
                          onClick={(e) => handleNavClick(e, link.path)}
                          className="transition-colors relative text-gray-300 hover:text-white"
                          onMouseEnter={() => setCursorVariant('button')} 
                          onMouseLeave={() => setCursorVariant('default')}
                      >
                          {link.name}
                      </MagneticButton>
                      ))}
                      <MagneticButton 
                          href="/resume.pdf"
                          className="text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
                          onMouseEnter={() => setCursorVariant('button')} 
                          onMouseLeave={() => setCursorVariant('default')}
                      >
                          Resume
                      </MagneticButton>
                  </nav>

                  {/* Mobile Menu Toggle */}
                  <button 
                      ref={menuButtonRef}
                      className="md:hidden text-white relative z-50 p-2 focus:outline-none"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      onMouseEnter={() => setCursorVariant('button')} 
                      onMouseLeave={() => setCursorVariant('default')}
                      aria-label="Toggle Menu"
                      aria-expanded={isMenuOpen}
                  >
                      <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                      <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                      <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                  </button>
              </div>
          </header>
        </div>

        {/* Mobile Nav Overlay */}
        <div 
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className={`fixed inset-0 glass z-[60] flex flex-col items-center justify-center space-y-8 transition-all duration-700 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="text-3xl font-bold tracking-tight hover:text-yellow-400 transition-colors"
                  onMouseEnter={() => setCursorVariant('button')} 
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {link.name}
                </a>
              ))}
              <a 
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xl font-bold tracking-widest uppercase px-8 py-4 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                  onMouseEnter={() => setCursorVariant('button')} 
                  onMouseLeave={() => setCursorVariant('default')}
              >
                  Download Resume
              </a>
        </div>

        <main>
          <Suspense fallback={null}>
          <section id="home">
            <Home setCursorVariant={setCursorVariant} />
          </section>
          <section id="about">
            <About setCursorVariant={setCursorVariant} />
          </section>
          <section id="experience">
            <ExperiencePage setCursorVariant={setCursorVariant} />
          </section>
          <section id="projects">
            <ProjectsPage setCursorVariant={setCursorVariant} />
          </section>
          <section id="contact">
            <ContactPage setCursorVariant={setCursorVariant} />
          </section>
          </Suspense>

          <footer className="py-12 text-center text-gray-600 text-sm border-t border-white/5 bg-transparent">
              <div className="flex justify-center gap-6 mb-8">
                  {/* Footer Socials */}
                  {Object.entries(SOCIAL_LINKS).map(([key, url]) => (
                      key !== 'email' && key !== 'leetcode' && (
                          <MagneticButton key={key} href={url} className="text-gray-500 hover:text-yellow-500 transition-colors uppercase text-xs font-mono tracking-widest p-2">
                              {key}
                          </MagneticButton>
                      )
                  ))}
              </div>
              &copy; {new Date().getFullYear()} Renish Developer. All rights reserved.
          </footer>
        </main>
        
      </div>
  );
};

export default App;
