// Audio feedback utility using Web Audio API for field surveyors
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

import { VehicleType } from '../types';

export function playVehicleBeep(type: VehicleType | 'ai_detected' | string): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Frequencies distinct by vehicle type
    const freqs: Record<string, number> = {
      private: 520,          // standard tone
      taxi: 660,             // bright taxi ding
      microbus: 440,         // deeper bass tone
      van: 740,              // van tone
      minibus: 490,          // minibus tone
      pickup: 390,           // pickup bass
      bus: 320,              // heavy bus tone
      motorcycle: 820,       // motorcycle high pitch
      suzuki_van: 780,       // crisp tone
      peugeot_station: 380,  // low solid tone
      ai_detected: 880,      // high AI recognition chime
    };

    const freq = freqs[type] || 520;
    osc.type = type === 'ai_detected' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    if (type === 'ai_detected') {
      // 2-tone chime
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else {
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio may be blocked before first user gesture
  }

  // Trigger haptic vibration on mobile if available
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(40);
    } catch {
      // ignore
    }
  }
}
