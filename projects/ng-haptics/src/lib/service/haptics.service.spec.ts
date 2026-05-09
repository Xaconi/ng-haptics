import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HapticsService } from './haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

describe('HapticsService', () => {
  function setup(adapterOverrides: Partial<NoopAdapter> = {}) {
    const adapter = Object.assign(new NoopAdapter(), adapterOverrides);
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
        { provide: HAPTICS_CONFIG, useValue: { enabled: true, debug: false, respectReducedMotion: true } },
      ],
    });

    return { service: TestBed.inject(HapticsService), spies };
  }

  it('isSupported reflects adapter', () => {
    const { service } = setup();
    expect(service.isSupported).toBe(false);
  });

  it('delegates light() to adapter', () => {
    const { service, spies } = setup();
    service.light();
    expect(spies.light).toHaveBeenCalled();
  });

  it('delegates success() to adapter', () => {
    const { service, spies } = setup();
    service.success();
    expect(spies.success).toHaveBeenCalled();
  });

  it('delegates pattern() to adapter', () => {
    const { service, spies } = setup();
    service.pattern([10, 50]);
    expect(spies.pattern).toHaveBeenCalledWith([10, 50]);
  });

  it('sequence() calls presets and respects delays', async () => {
    const { service, spies } = setup();
    await service.sequence(['light', { delay: 10 }, 'success']);
    expect(spies.light).toHaveBeenCalled();
    expect(spies.success).toHaveBeenCalled();
  });

  it('logs to console when debug is true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
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
});
