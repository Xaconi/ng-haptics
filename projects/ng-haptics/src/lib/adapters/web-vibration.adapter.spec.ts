import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebVibrationAdapter } from './web-vibration.adapter';

describe('WebVibrationAdapter', () => {
  let adapter: WebVibrationAdapter;
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vibrateSpy = vi.fn();
    // Mock navigator.vibrate using vi.stubGlobal
    vi.stubGlobal('navigator', {
      ...navigator,
      vibrate: vibrateSpy,
    });
    adapter = new WebVibrationAdapter();
  });

  it('isSupported() returns true when navigator.vibrate exists', () => {
    expect(adapter.isSupported()).toBe(true);
  });

  // Presets: intensity scales duration (effectiveDuration = round(duration * intensity))
  it('selection() vibrates with scaled duration', () => {
    adapter.selection(); // { duration: 10 } → 10
    expect(vibrateSpy).toHaveBeenCalledWith([10]);
  });

  it('light() vibrates with scaled duration', () => {
    adapter.light(); // { duration: 35, intensity: 0.4 } → round(35*0.4) = 14
    expect(vibrateSpy).toHaveBeenCalledWith([14]);
  });

  it('medium() vibrates with scaled duration', () => {
    adapter.medium(); // [{ duration: 35, intensity: 0.7 }, { delay: 30, duration: 35, intensity: 0.7 }]
    // pulse1: round(35*0.7)=25, pulse2: delay=30, 25 → [25, 30, 25]
    expect(vibrateSpy).toHaveBeenCalledWith([25, 30, 25]);
  });

  it('heavy() vibrates with full duration', () => {
    adapter.heavy(); // [{ duration: 35, intensity: 1.0 }, { delay: 30, duration: 35, intensity: 1.0 }, { delay: 20, duration: 35, intensity: 1.0 }]
    // pulse1: 35, pulse2: delay=30, 35, pulse3: delay=20, 35 → [35, 30, 35, 20, 35]
    expect(vibrateSpy).toHaveBeenCalledWith([35, 30, 35, 20, 35]);
  });

  it('success() vibrates with two-pulse pattern', () => {
    adapter.success(); // [{ duration:40, intensity:0.5 }, { delay:100, duration:40, intensity:1.0 }]
    // pulse1: round(40*0.5)=20, pulse2: delay=100, round(40*1.0)=40 → [20, 100, 40]
    expect(vibrateSpy).toHaveBeenCalledWith([20, 100, 40]);
  });

  it('warning() vibrates with two-pulse pattern', () => {
    adapter.warning(); // [{ duration:40, intensity:0.8 }, { delay:200, duration:40, intensity:0.7 }]
    // pulse1: round(40*0.8)=32, pulse2: delay=200, round(40*0.7)=28 → [32, 200, 28]
    expect(vibrateSpy).toHaveBeenCalledWith([32, 200, 28]);
  });

  it('error() vibrates with two-pulse pattern', () => {
    adapter.error(); // [{ duration:40, intensity:0.7 }, { delay:100, duration:40, intensity:0.7 }, { delay:100, duration:40, intensity:0.9 }, { delay:100, duration:40, intensity:0.6 }]
    // pulse1: round(40*0.7)=28, pulse2: delay=100, 28, pulse3: delay=100, round(40*0.9)=36, pulse4: delay=100, round(40*0.6)=24
    // → [28, 100, 28, 100, 36, 100, 24]
    expect(vibrateSpy).toHaveBeenCalledWith([28, 100, 28, 100, 36, 100, 24]);
  });

  it('pattern() executes custom HapticPulse array', () => {
    adapter.pattern([
      { duration: 50, intensity: 1.0 },
      { delay: 30, duration: 50, intensity: 1.0 },
    ]);
    expect(vibrateSpy).toHaveBeenCalledWith([50, 30, 50]);
  });

  it('pattern() respects intensity scaling', () => {
    adapter.pattern([{ duration: 40, intensity: 0.5 }]);
    expect(vibrateSpy).toHaveBeenCalledWith([20]);
  });

  it('pattern() uses 1ms minimum gap when delay is 0 between pulses', () => {
    adapter.pattern([
      { duration: 20 },
      { duration: 20 }, // delay defaults to 0 → gets 1ms gap
    ]);
    expect(vibrateSpy).toHaveBeenCalledWith([20, 1, 20]);
  });
});
