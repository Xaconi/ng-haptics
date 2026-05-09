import { HapticPulse } from '../types/haptics.types';
import { HapticsAdapter } from './haptics-adapter';
import { HAPTIC_PRESETS } from './haptic-presets';

function pulsesToVibratePattern(pulses: HapticPulse[]): number[] {
  if (pulses.length === 0) return [];

  const result: number[] = [];

  for (let i = 0; i < pulses.length; i++) {
    const { duration, intensity = 1.0, delay = 0 } = pulses[i];
    const effectiveDuration = Math.max(1, Math.round(duration * Math.min(1, Math.max(0, intensity))));

    if (i === 0) {
      if (delay > 0) result.push(0, delay);
    } else {
      result.push(delay > 0 ? delay : 1);
    }
    result.push(effectiveDuration);
  }

  return result;
}

export class WebVibrationAdapter implements HapticsAdapter {
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  light(): void { this.executePulses(HAPTIC_PRESETS.light); }
  medium(): void { this.executePulses(HAPTIC_PRESETS.medium); }
  heavy(): void { this.executePulses(HAPTIC_PRESETS.heavy); }
  success(): void { this.executePulses(HAPTIC_PRESETS.success); }
  warning(): void { this.executePulses(HAPTIC_PRESETS.warning); }
  error(): void { this.executePulses(HAPTIC_PRESETS.error); }
  selection(): void { this.executePulses(HAPTIC_PRESETS.selection); }

  pattern(pulses: HapticPulse[]): void {
    this.executePulses(pulses);
  }

  private executePulses(pulses: HapticPulse[]): void {
    const vibratePattern = pulsesToVibratePattern(pulses);
    if (vibratePattern.length > 0) navigator.vibrate(vibratePattern);
  }
}
