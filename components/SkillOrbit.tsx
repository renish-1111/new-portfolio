import React, { useState, useEffect, useRef } from 'react';
import {
  SiPython, SiReact, SiTypescript, SiNodedotjs,
  SiPostgresql, SiMongodb, SiDocker, SiJenkins,
  SiGit, SiFrappe, SiErpnext, SiTailwindcss
} from 'react-icons/si';
import { playPowerUpSound, playPowerDownSound, playHoverSound } from '../utils/sound';

const CX = 250;
const CY = 250;
const RX = 210;
const RY = 75;
const SVG_SIZE = 500;
const ICON_BOX = 36;
const ICON_SIZE = 20;

interface IconOnOrbit {
  icon: React.ReactElement;
  color: string;
  shadow: string;
  startAngle: number;
}

interface OrbitDef {
  rotateDeg: number;
  baseSpeed: number; // radians per ms at speed=1
  strokeOpacity: number;
  strokeDash?: string;
  icons: IconOnOrbit[];
}

const ORBITS: OrbitDef[] = [
  {
    rotateDeg: 0,
    baseSpeed: 0.00065,
    strokeOpacity: 0.25,
    icons: [
      { icon: <SiReact />,      color: '#60a5fa', shadow: '0 0 12px rgba(96,165,250,0.8)',  startAngle: 0 },
      { icon: <SiPython />,     color: '#fbbf24', shadow: '0 0 12px rgba(251,191,36,0.8)',  startAngle: Math.PI / 2 },
      { icon: <SiTypescript />, color: '#3b82f6', shadow: '0 0 12px rgba(59,130,246,0.8)',  startAngle: Math.PI },
      { icon: <SiNodedotjs />,  color: '#22c55e', shadow: '0 0 12px rgba(34,197,94,0.8)',   startAngle: (3 * Math.PI) / 2 },
    ],
  },
  {
    rotateDeg: 60,
    baseSpeed: -0.00045,
    strokeOpacity: 0.18,
    strokeDash: '6 5',
    icons: [
      { icon: <SiGit />,        color: '#f97316', shadow: '0 0 12px rgba(249,115,22,0.8)',  startAngle: Math.PI / 4 },
      { icon: <SiPostgresql />, color: '#60a5fa', shadow: '0 0 12px rgba(96,165,250,0.8)',  startAngle: Math.PI * 3 / 4 },
      { icon: <SiMongodb />,    color: '#4ade80', shadow: '0 0 12px rgba(74,222,128,0.8)',  startAngle: Math.PI * 5 / 4 },
      { icon: <SiDocker />,     color: '#38bdf8', shadow: '0 0 12px rgba(56,189,248,0.8)',  startAngle: Math.PI * 7 / 4 },
    ],
  },
  {
    rotateDeg: 120,
    baseSpeed: 0.00055,
    strokeOpacity: 0.12,
    icons: [
      { icon: <SiFrappe />,      color: '#818cf8', shadow: '0 0 12px rgba(129,140,248,0.8)', startAngle: Math.PI / 6 },
      { icon: <SiErpnext />,     color: '#38bdf8', shadow: '0 0 12px rgba(56,189,248,0.8)',  startAngle: Math.PI * 2 / 3 },
      { icon: <SiJenkins />,     color: '#f87171', shadow: '0 0 12px rgba(248,113,113,0.8)', startAngle: Math.PI * 7 / 6 },
      { icon: <SiTailwindcss />, color: '#22d3ee', shadow: '0 0 12px rgba(34,211,238,0.8)',  startAngle: Math.PI * 5 / 3 },
    ],
  },
];

function getPos(startAngle: number, orbitAngle: number, rotateDeg: number) {
  const a = startAngle + orbitAngle;
  const rotRad = (rotateDeg * Math.PI) / 180;
  const ex = RX * Math.cos(a);
  const ey = RY * Math.sin(a);
  const x = CX + ex * Math.cos(rotRad) - ey * Math.sin(rotRad);
  const y = CY + ex * Math.sin(rotRad) + ey * Math.cos(rotRad);
  return { x, y };
}

const SkillOrbit: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHyperSpeed, setIsHyperSpeed] = useState(false);
  const isHyperSpeedRef = useRef(false);
  const speedRef = useRef(1);
  const iconScaleRef = useRef(1);       // current lerped scale
  const targetScaleRef = useRef(1);     // 1 or 1.3
  const glowRadiusRef = useRef(100);    // current lerped glow radius
  const targetGlowRef = useRef(100);    // 100 normal, 180 hyper
  const glowCircleRef = useRef<SVGCircleElement>(null);
  const orbitAngles = useRef([0, 0, 0]);
  // refs to each icon DOM node: [orbitIdx][iconIdx]
  const iconRefs = useRef<(HTMLDivElement | null)[][]>(ORBITS.map(o => o.icons.map(() => null)));

  const handleCoreClick = () => {
    if (isHyperSpeedRef.current) return;
    setIsHyperSpeed(true);
    isHyperSpeedRef.current = true;
    targetScaleRef.current = 1.3;
    targetGlowRef.current = 180;
    playPowerUpSound();
    setTimeout(() => {
      setIsHyperSpeed(false);
      isHyperSpeedRef.current = false;
      targetScaleRef.current = 1;
      targetGlowRef.current = 100;
      playPowerDownSound();
    }, 5000);
  };

  useEffect(() => {
    let animFrame = 0;
    let lastTime = performance.now();
    let isRunning = false;

    const update = (time: number) => {
      if (!isRunning) return;

      const delta = time - lastTime;
      lastTime = time;

      const targetSpeed = isHyperSpeedRef.current ? 8 : 1;
      speedRef.current += (targetSpeed - speedRef.current) * 0.05;
      const s = speedRef.current;

      iconScaleRef.current += (targetScaleRef.current - iconScaleRef.current) * 0.04;
      const sc = iconScaleRef.current;

      glowRadiusRef.current += (targetGlowRef.current - glowRadiusRef.current) * 0.04;
      if (glowCircleRef.current) {
        glowCircleRef.current.setAttribute('r', String(Math.round(glowRadiusRef.current)));
      }

      ORBITS.forEach((o, oi) => {
        orbitAngles.current[oi] += o.baseSpeed * s * delta;

        o.icons.forEach((ic, ii) => {
          const el = iconRefs.current[oi][ii];
          if (!el) return;
          const { x, y } = getPos(ic.startAngle, orbitAngles.current[oi], o.rotateDeg);
          el.style.transform = `translate(${x - ICON_BOX / 2}px, ${y - ICON_BOX / 2}px) scale(${sc})`;
        });
      });

      animFrame = requestAnimationFrame(update);
    };

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      lastTime = performance.now();
      animFrame = requestAnimationFrame(update);
    };

    const stopLoop = () => {
      isRunning = false;
      cancelAnimationFrame(animFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
      { threshold: 0 }
    );

    const container = containerRef.current;
    if (container) observer.observe(container);

    startLoop();

    return () => {
      observer.disconnect();
      stopLoop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none"
      style={{ width: SVG_SIZE, height: SVG_SIZE, maxWidth: '100%' }}
    >
      {/* SVG rings */}
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle ref={glowCircleRef} cx={CX} cy={CY} r={100} fill="url(#coreGlow)" />
        {ORBITS.map((o, i) => (
          <ellipse
            key={i}
            cx={CX}
            cy={CY}
            rx={RX}
            ry={RY}
            fill="none"
            stroke="white"
            strokeOpacity={o.strokeOpacity}
            strokeWidth={1}
            strokeDasharray={o.strokeDash}
            transform={`rotate(${o.rotateDeg} ${CX} ${CY})`}
          />
        ))}
      </svg>

      {/* Icon containers — absolutely positioned, moved via transform in rAF */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {ORBITS.map((o, oi) =>
          o.icons.map((ic, ii) => {
            const { x, y } = getPos(ic.startAngle, 0, o.rotateDeg);
            return (
              <div
                key={`${oi}-${ii}`}
                ref={el => { iconRefs.current[oi][ii] = el; }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: ICON_BOX,
                  height: ICON_BOX,
                  transform: `translate(${x - ICON_BOX / 2}px, ${y - ICON_BOX / 2}px)`,
                  willChange: 'transform',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ic.color,
                    boxShadow: ic.shadow,
                  }}
                >
                  {React.cloneElement(ic.icon, { size: ICON_SIZE })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Central Core */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: CX, top: CY, transform: 'translate(-50%,-50%)', zIndex: 20 }}
      >
        <div
          className={`absolute rounded-full blur-[28px] w-20 h-20 transition-all duration-500 ${
            isHyperSpeed ? 'bg-orange-500/50 animate-ping' : 'bg-yellow-500/25 animate-pulse'
          }`}
        />
        <div
          onClick={handleCoreClick}
          onMouseEnter={playHoverSound}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center border cursor-pointer hover:scale-105 transition-all duration-300 backdrop-blur-xl ${
            isHyperSpeed
              ? 'border-orange-500/60 shadow-[0_0_60px_rgba(249,115,22,0.7),inset_0_0_30px_rgba(255,255,255,0.15)]'
              : 'border-white/20 shadow-[0_0_40px_rgba(234,179,8,0.35),inset_0_0_20px_rgba(255,255,255,0.08)]'
          }`}
          style={{ background: 'rgba(10,10,10,0.9)' }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div
            className={`absolute inset-[2px] rounded-full border transition-colors duration-500 ${
              isHyperSpeed ? 'border-orange-500/50' : 'border-yellow-500/25'
            }`}
          />
          <div className="relative flex flex-col items-center justify-center text-center z-10">
            <span
              className={`font-mono text-[8px] tracking-[0.18em] mb-0.5 transition-colors duration-500 ${
                isHyperSpeed ? 'text-orange-400 font-bold' : 'text-yellow-500'
              }`}
            >
              {isHyperSpeed ? 'MAX' : 'SYSTEM'}
            </span>
            <span className="font-bold text-white text-base tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {isHyperSpeed ? 'OVERDRIVE' : 'CORE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillOrbit;
