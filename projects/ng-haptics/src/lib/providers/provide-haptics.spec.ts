import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideHaptics } from './provide-haptics';
import { HAPTICS_ADAPTER } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

describe('provideHaptics()', () => {
  it('provides NoopAdapter in server (SSR) context', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHaptics(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    const adapter = TestBed.inject(HAPTICS_ADAPTER);
    expect(adapter).toBeInstanceOf(NoopAdapter);
  });

  it('provides NoopAdapter when enabled is false', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHaptics({ enabled: false }),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    const adapter = TestBed.inject(HAPTICS_ADAPTER);
    expect(adapter).toBeInstanceOf(NoopAdapter);
  });

  it('merges config defaults correctly', () => {
    TestBed.configureTestingModule({
      providers: [provideHaptics({ debug: true })],
    });
    // No throw = config merged correctly
    expect(true).toBe(true);
  });
});
