import MagneticButton from './MagneticButton';

import React, { useRef, useEffect, useCallback } from 'react';
import SkillOrbit from './SkillOrbit';
import { CursorContextType } from '../types';

interface HeroProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?";

const Hero3D: React.FC<HeroProps> = ({ setCursorVariant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const targetText = "RENISH DEV";

  const scramble = useCallback(() => {
    const el = titleRef.current;
    if (!el) return;

    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = targetText
        .split("")
        .map((_, index) => {
          if (index < iteration) return targetText[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration >= targetText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  }, [targetText]);

  useEffect(() => {
    // Trigger scramble on mount
    scramble();
  }, [scramble]);


  // --- Lightning Effect ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduce effect intensity on mobile for performance
    const isMobile = window.innerWidth < 768;
    // On mobile, spawn bolts less frequently
    const boltChance = isMobile ? 0.006 : 0.015;

    let animationFrameId: number;
    let isRunning = false;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    interface Bolt {
      path: {x: number, y: number}[];
      opacity: number;
      width: number;
    }

    let bolts: Bolt[] = [];
    let flashIntensity = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const createBolt = () => {
        const startX = random(0, w);
        const startY = -50;
        
        const path = [{x: startX, y: startY}];
        let currX = startX;
        let currY = startY;
        
        while(currY < h + 50) {
            currY += random(15, 45);
            currX += random(-30, 30);
            path.push({x: currX, y: currY});
            
            if(Math.random() < 0.1) {
                 currX += random(-50, 50);
                 path.push({x: currX, y: currY});
            }
        }

        bolts.push({
            path,
            opacity: 1,
            width: random(2, 4),
        });

        flashIntensity = 0.15;
    };

    const draw = () => {
        if (!isRunning) return;

        ctx.clearRect(0, 0, w, h);
        
        if (flashIntensity > 0) {
            ctx.fillStyle = `rgba(253, 224, 71, ${flashIntensity})`;
            ctx.fillRect(0, 0, w, h);
            flashIntensity *= 0.85;
            if(flashIntensity < 0.01) flashIntensity = 0;
        }
        
        if (Math.random() < boltChance) {
           createBolt();
        }

        let writeIndex = 0;
        for (let i = 0; i < bolts.length; i++) {
            const bolt = bolts[i];
            ctx.beginPath();
            if (bolt.path.length > 0) {
                ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
                for (let j = 1; j < bolt.path.length; j++) {
                    ctx.lineTo(bolt.path[j].x, bolt.path[j].y);
                }
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = `rgba(255, 255, 240, ${bolt.opacity})`;
            ctx.lineWidth = bolt.width;
            ctx.stroke();
            
            bolt.opacity -= 0.05;
            if (bolt.opacity > 0) bolts[writeIndex++] = bolt;
        }
        bolts.length = writeIndex;

        animationFrameId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      draw();
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      bolts.length = 0;
      flashIntensity = 0;
      ctx.clearRect(0, 0, w, h);
    };

    const section = canvas.parentElement;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? start() : stop(),
      { threshold: 0 }
    );
    if (section) observer.observe(section);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) start();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    window.addEventListener('resize', resize);
    start();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      stop();
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-transparent">
      {/* Interactive Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        onMouseEnter={() => setCursorVariant('default')}
      />
      
      {/* Geometric Accents - Updated to Yellow/Amber Theme */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Main Content Interface - 2 Column on Large Screens */}
      <div className="z-10 relative p-6 md:p-20 w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-7xl mx-auto gap-8 lg:gap-8 mt-16 lg:mt-0">
        
        {/* Decorative Top HUD */}
        <div className="absolute top-10 lg:top-1/4 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-20 -translate-y-1/2 flex gap-2">
            <div className="w-20 h-1 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            <div className="w-2 h-1 bg-white/50"></div>
            <div className="w-2 h-1 bg-white/50"></div>
        </div>

        {/* Left Column: Text & CTAs */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 z-20">
          <h2 className="text-yellow-500 font-mono text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.8em] uppercase mb-4 animate-pulse">
            System Online // V.11.11
          </h2>
          
          <h1 
            ref={titleRef}
            onMouseEnter={() => setCursorVariant('text')}
            onMouseLeave={() => setCursorVariant('default')}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-mono font-bold text-white leading-none tracking-tighter select-none mix-blend-overlay break-words max-w-full mb-6 lg:mb-4 drop-shadow-2xl"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}
          >
            {targetText}
          </h1>

          <p className="text-gray-400 font-mono text-xs md:text-sm tracking-wider max-w-md mb-8 leading-relaxed border-l-2 border-yellow-500/50 pl-4">
            <span className="text-yellow-400 font-bold">&gt;</span> Full Stack Engineer.<br/>
            <span className="text-yellow-400 font-bold">&gt;</span> AI/ML Enthusiast.<br/>
            <span className="text-yellow-400 font-bold">&gt;</span> Creative Problem Solver.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a 
              href="#projects"
              className="group relative px-8 py-4 rounded-full overflow-hidden w-full sm:w-auto text-center hover:scale-105 active:scale-95 ease-huly duration-500 shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] border border-yellow-500/50"
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <div className="absolute inset-0 bg-yellow-500 transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity duration-300" />
              <span className="relative z-10 text-black font-bold tracking-widest text-sm uppercase">
                Initialize Projects
              </span>
            </a>
            
            <a 
              href="#contact"
              className="group w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white font-mono text-sm uppercase tracking-widest text-center hover:scale-105 active:scale-95 ease-huly duration-500"
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Contact Protocol
            </a>
          </div>
        </div>

        {/* Right Column: 3D Orbit — hidden on small mobile, shown on md+ */}
        <div className="hidden md:flex w-full lg:w-1/2 items-center justify-center z-10 scale-75 md:scale-90 lg:scale-100 mt-6 lg:mt-0">
           <SkillOrbit />
        </div>

        {/* Decorative Bottom HUD */}
        <div className="absolute bottom-10 right-10 p-4 flex flex-col items-end gap-1 opacity-50 hidden lg:flex">
            <div className="text-[10px] text-yellow-500 font-mono">POWER: MAX</div>
            <div className="flex gap-1 mt-1">
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;
