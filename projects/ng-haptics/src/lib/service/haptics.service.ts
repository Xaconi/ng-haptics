import { Injectable, inject } from '@angular/core';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { HapticPreset, HapticPulse, HapticsConfig, SequenceEntry } from '../types/haptics.types';

@Injectable()
export class HapticsService {
  private readonly adapter = inject(HAPTICS_ADAPTER);
  private readonly config: HapticsConfig = inject(HAPTICS_CONFIG);

  get isSupported(): boolean {
    return this.adapter.isSupported();
  }

  light(): void {
    this.trigger('light');
  }

  medium(): void {
    this.trigger('medium');
  }

  heavy(): void {
    this.trigger('heavy');
  }

  success(): void {
    this.trigger('success');
  }

  warning(): void {
    this.trigger('warning');
  }

  error(): void {
    this.trigger('error');
  }

  selection(): void {
    this.trigger('selection');
  }

  pattern(pulses: HapticPulse[]): void {
    if (this.config.debug) {
      console.log('[ng-haptics] pattern:', pulses);
    }
    this.adapter.pattern(pulses);
  }

  async sequence(entries: SequenceEntry[]): Promise<void> {
    for (const entry of entries) {
      if (typeof entry === 'string') {
        this.trigger(entry);
      } else {
        await new Promise<void>(resolve => setTimeout(resolve, entry.delay));
      }
    }
  }

  private trigger(preset: HapticPreset): void {
    if (this.config.debug) {
      console.log('[ng-haptics]', preset);
    }
    this.adapter[preset]();
  }
}
