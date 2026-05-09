/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { HapticPulse } from '../types/haptics.types';
import { HapticsAdapter } from './haptics-adapter';

export class NoopAdapter implements HapticsAdapter {
  isSupported(): boolean {
    return false;
  }

  light(): void { }
  medium(): void { }
  heavy(): void { }
  success(): void { }
  warning(): void { }
  error(): void { }
  selection(): void { }
  pattern(_: HapticPulse[]): void { }
}
