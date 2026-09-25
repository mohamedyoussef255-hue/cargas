// Audio Notification & Background System Notification Service
// Provides realistic audio ringtones via Web Audio API and system notifications (inside & outside the app)

export type SoundType = 'ringtone' | 'chime' | 'urgent';

const SOUND_STORAGE_KEY = 'cng_sound_notifications_enabled';
const VOLUME_STORAGE_KEY = 'cng_notification_volume';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Check if audio notifications are enabled (default: true)
export function isSoundNotificationEnabled(): boolean {
  try {
    const saved = localStorage.getItem(SOUND_STORAGE_KEY);
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
}

export function setSoundNotificationEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {}
}

export function getNotificationVolume(): number {
  try {
    const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
    return saved ? Math.min(1, Math.max(0.1, parseFloat(saved))) : 0.8;
  } catch {
    return 0.8;
  }
}

export function setNotificationVolume(vol: number): void {
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(vol));
  } catch {}
}

// Synthesize pleasant, clear, and loud ringtone using Web Audio API
export function playNotificationSound(type: SoundType = 'ringtone'): void {
  if (!isSoundNotificationEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const masterVol = getNotificationVolume();

  if (type === 'ringtone') {
    // Dual-tone executive telephone/intercom ringtone simulation
    // Pattern: 2 bursts of dual frequencies (659Hz + 880Hz), repeated
    const now = ctx.currentTime;
    const ringBursts = [0, 0.45, 1.2, 1.65];

    ringBursts.forEach((delay) => {
      const burstStart = now + delay;
      const duration = 0.32;

      // Frequency 1: E5 (659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, burstStart);

      gain1.gain.setValueAtTime(0, burstStart);
      gain1.gain.linearRampToValueAtTime(masterVol * 0.4, burstStart + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, burstStart + duration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(burstStart);
      osc1.stop(burstStart + duration);

      // Frequency 2: A5 (880Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, burstStart);

      gain2.gain.setValueAtTime(0, burstStart);
      gain2.gain.linearRampToValueAtTime(masterVol * 0.35, burstStart + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, burstStart + duration);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(burstStart);
      osc2.stop(burstStart + duration);
    });

  } else if (type === 'chime') {
    // 4-tone ascending bell chime: C5 -> E5 -> G5 -> C6
    const now = ctx.currentTime;
    const tones = [523.25, 659.25, 783.99, 1046.5];

    tones.forEach((freq, idx) => {
      const startTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(masterVol * 0.45, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });

  } else if (type === 'urgent') {
    // Pulsing high-visibility urgent warning beeps
    const now = ctx.currentTime;
    const pulses = [0, 0.15, 0.3, 0.5, 0.65, 0.8];

    pulses.forEach((delay) => {
      const start = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, start); // B5 note

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(masterVol * 0.5, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.12);
    });
  }
}

// Browser Background Notification API
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): NotificationPermission {
  if (!isBrowserNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowserNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

export interface SystemNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  soundType?: SoundType;
  url?: string;
  requireInteraction?: boolean;
  data?: any;
}

// Master function to trigger sound, vibration, and background system notification
export async function triggerSystemNotification(options: SystemNotificationOptions): Promise<void> {
  const {
    title,
    body,
    icon = '/cargas_ngv_logo.svg',
    soundType = 'ringtone',
    tag = 'cargas-notification-' + Date.now(),
    url = '/',
    requireInteraction = true,
    data = {}
  } = options;

  // 1. Play Synthesized Sound / Ringtone
  playNotificationSound(soundType);

  // 2. Vibrate mobile devices if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 400]);
    } catch {}
  }

  // 3. Dispatch to Service Worker or native Notification (visible even outside the app / in background)
  if (isBrowserNotificationSupported() && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'TRIGGER_NOTIFICATION',
          title,
          options: {
            body,
            icon,
            tag,
            requireInteraction,
            data: { url, ...data }
          }
        });
      } else {
        const notif = new Notification(title, {
          body,
          icon,
          tag,
          requireInteraction,
          data: { url, ...data }
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      }
    } catch (err) {
      console.warn('Native notification failed, fallback handled:', err);
    }
  }

  // 4. Broadcast to other open tabs via BroadcastChannel or storage event
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cargas_inapp_channel');
      channel.postMessage({
        type: 'NEW_INAPP_NOTIFICATION',
        payload: { title, body, soundType, timestamp: new Date().toISOString() }
      });
      channel.close();
    }
  } catch {}
}

// Register Service Worker helper
export function registerServiceWorkerForNotifications(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Cargas ServiceWorker registered for background notifications:', registration.scope);
        },
        (err) => {
          console.warn('Cargas ServiceWorker registration failed:', err);
        }
      );
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }
}

export function initNotificationAudioService(): void {
  registerServiceWorkerForNotifications();
}
