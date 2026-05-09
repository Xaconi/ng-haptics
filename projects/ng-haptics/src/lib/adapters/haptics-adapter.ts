import { HapticPulse } from '../types/haptics.types';

export interface HapticsAdapter {
  isSupported(): boolean;
  light(): void;
  medium(): void;
  heavy(): void;
  success(): void;
  warning(): void;
  error(): void;
  selection(): void;
  pattern(pulses: HapticPulse[]): void;
}
