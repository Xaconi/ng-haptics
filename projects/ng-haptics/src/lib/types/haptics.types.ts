export type HapticPreset = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export interface HapticsConfig {
  enabled?: boolean;
  respectReducedMotion?: boolean;
  debug?: boolean;
}

export type SequenceEntry = HapticPreset | { delay: number };
