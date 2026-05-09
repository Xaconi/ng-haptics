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

  it('light() calls navigator.vibrate(10)', () => {
    adapter.light();
    expect(navigator.vibrate).toHaveBeenCalledWith(10);
  });

  it('medium() calls navigator.vibrate(20)', () => {
    adapter.medium();
    expect(navigator.vibrate).toHaveBeenCalledWith(20);
  });

  it('heavy() calls navigator.vibrate(40)', () => {
    adapter.heavy();
    expect(navigator.vibrate).toHaveBeenCalledWith(40);
  });

  it('success() calls navigator.vibrate with correct pattern', () => {
    adapter.success();
    expect(navigator.vibrate).toHaveBeenCalledWith([10, 40, 20]);
  });

  it('warning() calls navigator.vibrate with correct pattern', () => {
    adapter.warning();
    expect(navigator.vibrate).toHaveBeenCalledWith([20, 30, 20]);
  });

  it('error() calls navigator.vibrate with correct pattern', () => {
    adapter.error();
    expect(navigator.vibrate).toHaveBeenCalledWith([50, 30, 50]);
  });

  it('selection() calls navigator.vibrate(5)', () => {
    adapter.selection();
    expect(navigator.vibrate).toHaveBeenCalledWith(5);
  });

  it('pattern() calls navigator.vibrate with given pattern', () => {
    adapter.pattern([100, 50, 100]);
    expect(navigator.vibrate).toHaveBeenCalledWith([100, 50, 100]);
  });
});
