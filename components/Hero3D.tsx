
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CursorContextType } from '../types';

interface HeroProps {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+[]{}|;:,.<>?";

const Hero3D: React.FC<HeroProps> = ({ setCursorVariant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayText, setDisplayText] = useState("RENISH DEV");
  const targetText = "RENISH DEV";

  // --- Scramble Text Effect ---
  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3; // Speed of decoding
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

    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    interface Bolt {
      path: {x: number, y: number}[];
      opacity: number;
      width: number;
      life: number;
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
        const startY = -50; // Start slightly above screen
        
        const path = [{x: startX, y: startY}];
        let currX = startX;
        let currY = startY;
        
        // Generate jagged path down the screen
        while(currY < h + 50) {
            currY += random(15, 45);
            currX += random(-30, 30);
            path.push({x: currX, y: currY});
            
            // Occasional horizontal jolt / branch point
            if(Math.random() < 0.1) {
                 currX += random(-50, 50);
                 path.push({x: currX, y: currY});
            }
        }

        bolts.push({
            path,
            opacity: 1,
            width: random(2, 4),
            life: random(10, 20)
        });

        // Trigger yellow screen flash
        flashIntensity = 0.15;
    };

    const draw = () => {
        // Clear Canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
        
        // Draw Flash Overlay
        if (flashIntensity > 0) {
            ctx.fillStyle = `rgba(253, 224, 71, ${flashIntensity})`; // Yellow-400 color
            ctx.fillRect(0, 0, w, h);
            flashIntensity *= 0.85; // Fast decay
            if(flashIntensity < 0.01) flashIntensity = 0;
        }
        
        // Randomly Spawn Lightning
        if (Math.random() < 0.015) { // ~1.5% chance per frame
           createBolt();
        }

        // Draw Bolts
        bolts.forEach((bolt) => {
            ctx.beginPath();
            if (bolt.path.length > 0) {
                ctx.moveTo(bolt.path[0].x, bolt.path[0].y);
                for (let i = 1; i < bolt.path.length; i++) {
                    ctx.lineTo(bolt.path[i].x, bolt.path[i].y);
                }
            }

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Glow Effect
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#FACC15'; // Yellow-400 glow
            
            // Core Line
            ctx.strokeStyle = `rgba(255, 255, 240, ${bolt.opacity})`;
            ctx.lineWidth = bolt.width;
            ctx.stroke();
            
            // Reset shadow for next operations
            ctx.shadowBlur = 0;
            
            bolt.opacity -= 0.05; // Fade out
        });

        // Remove dead bolts
        bolts = bolts.filter(b => b.opacity > 0);

        animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black">
      {/* Interactive Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        onMouseEnter={() => setCursorVariant('default')}
      />
      
      {/* Geometric Accents - Updated to Yellow/Amber Theme */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Main Content Interface */}
      <div className="z-10 relative p-6 md:p-20 border-x border-white/5 bg-black/10 backdrop-blur-[2px] flex flex-col items-center text-center max-w-5xl w-full mx-4 md:mx-0">
        
        {/* Decorative Top HUD */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-20 h-1 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            <div className="w-2 h-1 bg-white/50"></div>
            <div className="w-2 h-1 bg-white/50"></div>
        </div>

        <h2 className="text-yellow-500 font-mono text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.8em] uppercase mb-6 animate-pulse">
          System Online // V.11.11
        </h2>
        
        <h1 
          className="text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-mono font-bold text-white leading-none tracking-tighter select-none mix-blend-overlay break-words max-w-full min-h-[1.1em]"
          onMouseEnter={() => {
            scramble();
            setCursorVariant('text');
          }}
          onMouseLeave={() => setCursorVariant('default')}
        >
          {displayText}
        </h1>

        <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-8 opacity-50" />

        <p className="text-gray-300 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-10">
          <span className="text-yellow-400 font-bold">&gt;</span> Full Stack Engineer.<br/>
          <span className="text-yellow-400 font-bold">&gt;</span> AI/ML Enthusiast.<br/>
          <span className="text-yellow-400 font-bold">&gt;</span> Creative Problem Solver.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
          <a 
            href="#projects"
            className="group relative w-full sm:w-auto px-8 py-4 bg-transparent rounded-full border border-white/10 overflow-hidden transition-all hover:border-yellow-500/50 hover:scale-105 active:scale-95 text-center ease-huly duration-500"
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
          >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <span className="relative text-yellow-400 font-mono text-sm uppercase tracking-widest group-hover:text-yellow-300">
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

        {/* Decorative Bottom HUD */}
        <div className="absolute bottom-0 right-0 p-4 flex flex-col items-end gap-1 opacity-50 hidden sm:flex">
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
