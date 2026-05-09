import { HapticsAdapter } from './haptics-adapter';

export class WebVibrationAdapter implements HapticsAdapter {
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  light(): void {
    navigator.vibrate(10);
  }

  medium(): void {
    navigator.vibrate(20);
  }

  heavy(): void {
    navigator.vibrate(40);
  }

  success(): void {
    navigator.vibrate([10, 40, 20]);
  }

  warning(): void {
    navigator.vibrate([20, 30, 20]);
  }

  error(): void {
    navigator.vibrate([50, 30, 50]);
  }

  selection(): void {
    navigator.vibrate(5);
  }

  pattern(pattern: number[]): void {
    navigator.vibrate(pattern);
  }
}
