export type HapticPreset = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export interface HapticsConfig {
  enabled?: boolean;
  respectReducedMotion?: boolean;
  debug?: boolean;
}

export type SequenceEntry = HapticPreset | { delay: number };

export interface HapticPulse {
  duration: number;
  intensity?: number; // 0–1, default 1.0
  delay?: number;     // ms pause BEFORE this pulse
}
