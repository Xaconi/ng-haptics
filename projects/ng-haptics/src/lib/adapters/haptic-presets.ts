import { HapticPreset, HapticPulse } from '../types/haptics.types';

export const HAPTIC_PRESETS: Record<HapticPreset, HapticPulse[]> = {
  selection: [{ duration: 10 }],
  light: [{ duration: 35, intensity: 0.4 }],
  medium: [{ duration: 35, intensity: 0.7 }, { delay: 30, duration: 35, intensity: 0.7 }],
  heavy: [{ duration: 35, intensity: 1.0 }, { delay: 30, duration: 35, intensity: 1.0 }, { delay: 20, duration: 35, intensity: 1.0 }],
  success: [{ duration: 40, intensity: 0.5 }, { delay: 100, duration: 40, intensity: 1.0 }],
  warning: [{ duration: 40, intensity: 0.8 }, { delay: 200, duration: 40, intensity: 0.7 }],
  error: [{ duration: 40, intensity: 0.7 }, { delay: 100, duration: 40, intensity: 0.7 }, { delay: 100, duration: 40, intensity: 0.9 }, { delay: 100, duration: 40, intensity: 0.6 }],
};
