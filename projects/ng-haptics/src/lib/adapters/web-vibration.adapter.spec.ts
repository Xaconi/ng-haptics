import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebVibrationAdapter } from './web-vibration.adapter';

describe('WebVibrationAdapter', () => {
  let adapter: WebVibrationAdapter;

  beforeEach(() => {
    adapter = new WebVibrationAdapter();
    Object.defineProperty(navigator, 'vibrate', {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  it('isSupported() returns true when navigator.vibrate exists', () => {
    expect(adapter.isSupported()).toBe(true);
  });

  // Presets: intensity scales duration (effectiveDuration = round(duration * intensity))
  it('selection() vibrates with scaled duration', () => {
    adapter.selection(); // { duration: 5, intensity: 0.3 } → round(5*0.3) = 2
    expect(navigator.vibrate).toHaveBeenCalledWith([2]);
  });

  it('light() vibrates with scaled duration', () => {
    adapter.light(); // { duration: 10, intensity: 0.5 } → round(10*0.5) = 5
    expect(navigator.vibrate).toHaveBeenCalledWith([5]);
  });

  it('medium() vibrates with scaled duration', () => {
    adapter.medium(); // { duration: 20, intensity: 0.8 } → round(20*0.8) = 16
    expect(navigator.vibrate).toHaveBeenCalledWith([16]);
  });

  it('heavy() vibrates with full duration', () => {
    adapter.heavy(); // { duration: 40, intensity: 1.0 } → 40
    expect(navigator.vibrate).toHaveBeenCalledWith([40]);
  });

  it('success() vibrates with two-pulse pattern', () => {
    adapter.success(); // [{ duration:10, intensity:0.6 }, { delay:40, duration:20, intensity:1.0 }]
    // pulse1: round(10*0.6)=6, pulse2: delay=40, round(20*1.0)=20 → [6, 40, 20]
    expect(navigator.vibrate).toHaveBeenCalledWith([6, 40, 20]);
  });

  it('warning() vibrates with two-pulse pattern', () => {
    adapter.warning(); // [{ duration:20, intensity:0.9 }, { delay:30, duration:20, intensity:0.9 }]
    // pulse1: round(20*0.9)=18, pulse2: delay=30, 18 → [18, 30, 18]
    expect(navigator.vibrate).toHaveBeenCalledWith([18, 30, 18]);
  });

  it('error() vibrates with two-pulse pattern', () => {
    adapter.error(); // [{ duration:50, intensity:1.0 }, { delay:25, duration:50, intensity:1.0 }]
    expect(navigator.vibrate).toHaveBeenCalledWith([50, 25, 50]);
  });

  it('pattern() executes custom HapticPulse array', () => {
    adapter.pattern([
      { duration: 50, intensity: 1.0 },
      { delay: 30, duration: 50, intensity: 1.0 },
    ]);
    expect(navigator.vibrate).toHaveBeenCalledWith([50, 30, 50]);
  });

  it('pattern() respects intensity scaling', () => {
    adapter.pattern([{ duration: 40, intensity: 0.5 }]);
    expect(navigator.vibrate).toHaveBeenCalledWith([20]);
  });

  it('pattern() uses 1ms minimum gap when delay is 0 between pulses', () => {
    adapter.pattern([
      { duration: 20 },
      { duration: 20 }, // delay defaults to 0 → gets 1ms gap
    ]);
    expect(navigator.vibrate).toHaveBeenCalledWith([20, 1, 20]);
  });
});
