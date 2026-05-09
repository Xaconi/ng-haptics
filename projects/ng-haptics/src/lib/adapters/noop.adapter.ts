import { HapticPulse } from '../types/haptics.types';
import { HapticsAdapter } from './haptics-adapter';

export class NoopAdapter implements HapticsAdapter {
  isSupported(): boolean {
    return false;
  }

  light(): void {}
  medium(): void {}
  heavy(): void {}
  success(): void {}
  warning(): void {}
  error(): void {}
  selection(): void {}
  pattern(_pulses: HapticPulse[]): void {}
}
