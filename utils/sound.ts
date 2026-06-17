let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Mechanical "tick" for hover
export const playHoverSound = () => {
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

// Clunky "gear shift" for click
export const playClickSound = () => {
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

// Car engine revving up (Acceleration) - EXTENDED TO 5 SECONDS
export const playPowerUpSound = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    
    const osc1 = ctx.createOscillator(); // Main engine tone
    const osc2 = ctx.createOscillator(); // Sub-octave for thickness
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Idle RPM (~40Hz) revving to High RPM (~300Hz) over 5 seconds
    osc1.frequency.setValueAtTime(40, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 5.0);
    
    osc2.frequency.setValueAtTime(20, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 5.0);

    // Lowpass filter opens up as engine revs
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 5.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Engine volume envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.2); // Quick fade in
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 4.5); // Hold steady
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5.0);   // Quick fade out at end of OVERDRIVE

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 5.0);
    osc2.stop(ctx.currentTime + 5.0);
  } catch (e) {}
};

// Car engine revving down (Deceleration) - EXTENDED TO 3 SECONDS
export const playPowerDownSound = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // High RPM dropping back to Idle over 3 seconds
    osc1.frequency.setValueAtTime(300, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 3.0);
    
    osc2.frequency.setValueAtTime(150, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 3.0);

    // Filter closes as RPM drops
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 3.0);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Engine volume envelope fading out over 3 seconds
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.0);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 3.0);
    osc2.stop(ctx.currentTime + 3.0);
  } catch (e) {}
};
