/* eslint-disable @typescript-eslint/no-empty-function */

import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HapticsService } from './haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

describe('HapticsService', () => {
  function setup(adapterOverrides: Partial<NoopAdapter> = {}, configOverrides: Partial<any> = {}) {
    const adapter = Object.assign(new NoopAdapter(), adapterOverrides);
    const config = { enabled: true, debug: false, respectReducedMotion: true, cooldown: 0, ...configOverrides };
    const spies = {
      light: vi.spyOn(adapter, 'light'),
      medium: vi.spyOn(adapter, 'medium'),
      heavy: vi.spyOn(adapter, 'heavy'),
      success: vi.spyOn(adapter, 'success'),
      warning: vi.spyOn(adapter, 'warning'),
      error: vi.spyOn(adapter, 'error'),
      selection: vi.spyOn(adapter, 'selection'),
      pattern: vi.spyOn(adapter, 'pattern'),
    };

    TestBed.configureTestingModule({
      providers: [
        HapticsService,
        { provide: HAPTICS_ADAPTER, useValue: adapter },
        { provide: HAPTICS_CONFIG, useValue: config },
      ],
    });

    return { service: TestBed.inject(HapticsService), spies };
  }

  it('isSupported reflects adapter', () => {
    const { service } = setup({}, {});
    expect(service.isSupported).toBe(false);
  });

  it('delegates light() to adapter', () => {
    const { service, spies } = setup({}, {});
    service.light();
    expect(spies.light).toHaveBeenCalled();
  });

  it('delegates success() to adapter', () => {
    const { service, spies } = setup({}, {});
    service.success();
    expect(spies.success).toHaveBeenCalled();
  });

  it('delegates pattern() to adapter', () => {
    const { service, spies } = setup({}, {});
    service.pattern([{ duration: 10 }, { duration: 20, delay: 30 }]);
    expect(spies.pattern).toHaveBeenCalledWith([{ duration: 10 }, { duration: 20, delay: 30 }]);
  });

  it('sequence() calls presets and respects delays', async () => {
    const { service, spies } = setup({}, {});
    await service.sequence(['light', { delay: 10 }, 'success']);
    expect(spies.light).toHaveBeenCalled();
    expect(spies.success).toHaveBeenCalled();
  });

  it('logs to console when debug is true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    TestBed.configureTestingModule({
      providers: [
        HapticsService,
        { provide: HAPTICS_ADAPTER, useValue: new NoopAdapter() },
        { provide: HAPTICS_CONFIG, useValue: { debug: true } },
      ],
    });
    const service = TestBed.inject(HapticsService);
    service.light();
    expect(consoleSpy).toHaveBeenCalledWith('[ng-haptics]', 'light');
    consoleSpy.mockRestore();
  });

  it('support() returns unsupported in SSR context', () => {
    TestBed.configureTestingModule({
      providers: [
        HapticsService,
        { provide: HAPTICS_ADAPTER, useValue: new NoopAdapter() },
        { provide: HAPTICS_CONFIG, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'server' }, // Mock SSR
      ],
    });
    const service = TestBed.inject(HapticsService);
    const result = service.support();
    expect(result).toEqual({
      supported: false,
      platform: 'unknown',
      method: 'unsupported',
      browser: 'unknown',
      reducedMotion: false,
    });
  });

  it('respects cooldown between triggers', () => {
    vi.useFakeTimers();
    const { service, spies } = setup({}, { cooldown: 100 });
    service.light();
    expect(spies.light).toHaveBeenCalledTimes(1);

    service.medium(); // Should be prevented
    expect(spies.medium).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    service.medium(); // Should work now
    expect(spies.medium).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('logs cooldown prevention when debug is true', () => {
    vi.useFakeTimers();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [
        HapticsService,
        { provide: HAPTICS_ADAPTER, useValue: new NoopAdapter() },
        { provide: HAPTICS_CONFIG, useValue: { debug: true, cooldown: 50 } },
      ],
    });
    const service = TestBed.inject(HapticsService);
    service.light();
    service.medium(); // Prevented
    expect(consoleSpy).toHaveBeenCalledWith('[ng-haptics] Cooldown prevented vibration');
    consoleSpy.mockRestore();
    vi.useRealTimers();
  });
});
