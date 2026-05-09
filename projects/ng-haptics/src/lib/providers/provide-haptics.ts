import { EnvironmentProviders, PLATFORM_ID, makeEnvironmentProviders } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NoopAdapter } from '../adapters/noop.adapter';
import { WebVibrationAdapter } from '../adapters/web-vibration.adapter';
import { HapticsService } from '../service/haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { HapticsConfig } from '../types/haptics.types';

export function provideHaptics(config: HapticsConfig = {}): EnvironmentProviders {
  const resolvedConfig: Required<HapticsConfig> = {
    enabled: true,
    respectReducedMotion: true,
    debug: false,
    ...config,
  };

  return makeEnvironmentProviders([
    { provide: HAPTICS_CONFIG, useValue: resolvedConfig },
    {
      provide: HAPTICS_ADAPTER,
      useFactory: (platformId: object) => {
        if (!isPlatformBrowser(platformId)) {
          return new NoopAdapter();
        }
        if (resolvedConfig.enabled === false) {
          return new NoopAdapter();
        }
        if (!('vibrate' in navigator)) {
          return new NoopAdapter();
        }
        if (
          resolvedConfig.respectReducedMotion &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ) {
          return new NoopAdapter();
        }
        return new WebVibrationAdapter();
      },
      deps: [PLATFORM_ID],
    },
    HapticsService,
  ]);
}
