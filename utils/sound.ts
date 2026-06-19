// Sound is only active on desktop (pointer: fine)
const isDesktop =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!isDesktop || typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Throttle hover sound — max once per 80ms to avoid spamming AudioContext nodes
let lastHoverTime = 0;
export const playHoverSound = () => {
  if (!isDesktop) return;
  const now = Date.now();
  if (now - lastHoverTime < 80) return;
  lastHoverTime = now;

  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
};

export const playClickSound = () => {
  if (!isDesktop) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    filter.type = 'lowpass';
    
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
    
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

export const playPowerUpSound = () => {
  if (!isDesktop) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(40, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 5.0);
    
    osc2.frequency.setValueAtTime(20, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 5.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 5.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 4.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5.0);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 5.0);
    osc2.stop(ctx.currentTime + 5.0);
  } catch (e) {}
};

export const playPowerDownSound = () => {
  if (!isDesktop) return;
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(300, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 3.0);
    
    osc2.frequency.setValueAtTime(150, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 3.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 3.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.0);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 3.0);
    osc2.stop(ctx.currentTime + 3.0);
  } catch (e) {}
};
