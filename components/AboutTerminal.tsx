import React, { useState, useEffect, useRef } from 'react';
import { CursorContextType } from '../types';
import { playClickSound, playHoverSound } from '../utils/sound';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
  id?: string;
}

const COMMANDS: Record<string, string | JSX.Element> = {
  'help': 'Available commands: whoami, skills, clear, exit',
  'whoami': 'Renish Developer. Full Stack Engineer & AI Enthusiast.',
  'skills': 'React, Node.js, Python, PostgreSQL, TypeScript...',
  'clear': '',
};

const AboutTerminal: React.FC<Props> = ({ setCursorVariant, id }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; res: string | JSX.Element }[]>([
    { cmd: 'whoami', res: COMMANDS['whoami'] }
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      playClickSound();
      
      if (cmd === 'clear') {
        setHistory([]);
      } else if (cmd === 'exit') {
        setHistory(prev => [...prev, { cmd, res: 'Terminal session terminated.' }]);
        // Optional: Trigger something else
      } else if (COMMANDS[cmd]) {
        setHistory(prev => [...prev, { cmd, res: COMMANDS[cmd] }]);
      } else if (cmd !== '') {
        setHistory(prev => [...prev, { cmd, res: `Command not found: ${cmd}. Type 'help' for available commands.` }]);
      }
      setInput('');
    }
  };

  return (
    <section id={id} ref={containerRef} className="py-24 px-6 md:px-20 bg-transparent relative overflow-hidden flex flex-col items-center">
      
      <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-xs font-mono text-yellow-500 tracking-[0.2em] uppercase mb-4">
            System Identity
        </h2>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Me</span>
        </h2>
      </div>

      <div 
        className={`w-full max-w-3xl glass-card rounded-xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(234,179,8,0.1)] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        onClick={() => inputRef.current?.focus()}
        onMouseEnter={() => { setCursorVariant('text'); playHoverSound(); }}
        onMouseLeave={() => setCursorVariant('default')}
      >
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-black/40 border-b border-white/5 gap-2">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto text-xs text-gray-500 font-mono">guest@renish-dev:~</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-sm md:text-base h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500/20 scrollbar-track-transparent">
            {history.map((item, i) => (
                <div key={i} className="mb-4">
                    <div className="text-yellow-400 mb-1">
                        <span className="text-green-400">guest@renish-dev</span>
                        <span className="text-white">:</span>
                        <span className="text-blue-400">~</span>$ {item.cmd}
                    </div>
                    <div className="text-gray-300 pl-4">{item.res}</div>
                </div>
            ))}
            
            <div className="flex items-center text-yellow-400">
                <span className="text-green-400">guest@renish-dev</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>$ 
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none border-none text-gray-300 ml-2 focus:ring-0"
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
      </div>
    </section>
  );
};

export default AboutTerminal;
