import { HapticPreset, HapticPulse } from '../types/haptics.types';

/**
 * Preset definitions shared by all adapters.
 *
 * Design rules:
 *  - iOS (Taptic Engine via switch trick): can only vary the NUMBER of clicks
 *    and their TIMING — one HapticPulse = one click. Intensity is ignored
 *    (hardware limitation). Differentiation comes from click count + rhythm.
 *  - Android (navigator.vibrate): duration controls motor time.
 *    Durations below ~15ms are below the motor threshold on most devices.
 *
 * Pattern reference (mirrors web-haptics):
 *   selection — 1 click, 10ms
 *   light     — 1 click, 15ms
 *   medium    — 2 clicks, 30ms apart | 20ms each
 *   heavy     — 3 clicks, 20ms gaps  | 25ms each
 *   success   — 3 clicks at 0/50/80ms, escalating durations
 *   warning   — 2 clicks, 40ms apart | 20ms each
 *   error     — 3 clicks at 0/25/60ms | 25ms each
 */
export const HAPTIC_PRESETS: Record<HapticPreset, HapticPulse[]> = {
  selection: [{ duration: 10 }],
  light: [{ duration: 35, intensity: 0.4 }],
  medium: [{ duration: 35, intensity: 0.7 }, { delay: 30, duration: 35, intensity: 0.7 }],
  heavy: [{ duration: 35, intensity: 1.0 }, { delay: 30, duration: 35, intensity: 1.0 }, { delay: 20, duration: 35, intensity: 1.0 }],
  success: [{ duration: 40, intensity: 0.5 }, { delay: 100, duration: 40, intensity: 1.0 }],
  warning: [{ duration: 40, intensity: 0.8 }, { delay: 200, duration: 40, intensity: 0.7 }],
  error: [{ duration: 40, intensity: 0.7 }, { delay: 100, duration: 40, intensity: 0.7 }, { delay: 100, duration: 40, intensity: 0.9 }, { delay: 100, duration: 40, intensity: 0.6 }],
};
