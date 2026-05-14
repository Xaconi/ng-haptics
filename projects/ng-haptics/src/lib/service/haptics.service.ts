import { DestroyRef, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { HapticPreset, HapticPulse, HapticsConfig, HapticsSupport, SequenceEntry } from '../types/haptics.types';
import { IosSwitchAdapter } from '../adapters/ios-switch.adapter';
import { WebVibrationAdapter } from '../adapters/web-vibration.adapter';
import { createReducedMotionTracker } from './reduced-motion';
import { debugLog } from './debug-log';
import { detectHapticsSupport } from './support-detection';

@Injectable()
export class HapticsService {
  private readonly adapter = inject(HAPTICS_ADAPTER);
  private readonly config = inject(HAPTICS_CONFIG) as Required<HapticsConfig>;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducedMotionTracker = createReducedMotionTracker(this.destroyRef, this.config.respectReducedMotion);
  private lastTrigger = 0;

  private log(message: string, payload?: unknown): void {
    debugLog(this.config.debug, message, payload);
  }

  private shouldBlockForReducedMotion(): boolean {
    return !!this.config.respectReducedMotion && this.reducedMotionTracker.value;
  }

  get isSupported(): boolean {
    return this.adapter.isSupported();
  }

  support(): HapticsSupport {
    const method = this.getAdapterMethod();
    const support = detectHapticsSupport(this.platformId, this.reducedMotionTracker.value, this.isSupported, method);
    this.log(`Support: ${support.supported ? 'supported' : 'unsupported'}`, support);
    return support;
  }

  private getAdapterMethod(): HapticsSupport['method'] {
    if (this.adapter instanceof WebVibrationAdapter) {
      return 'vibration-api';
    }
    if (this.adapter instanceof IosSwitchAdapter) {
      return 'ios-switch';
    }
    return 'noop';
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
    if (this.shouldBlockForReducedMotion()) {
      this.log('Reduced motion active, haptics disabled');
      return;
    }

    const now = Date.now();
    if (this.config.cooldown && now - this.lastTrigger < this.config.cooldown) {
      this.log('Cooldown prevented vibration');
      return;
    }
    this.lastTrigger = now;

    this.log('Triggered: pattern', pulses);
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
    if (this.shouldBlockForReducedMotion()) {
      this.log('Reduced motion active, haptics disabled');
      return;
    }

    const now = Date.now();
    if (this.config.cooldown && now - this.lastTrigger < this.config.cooldown) {
      this.log('Cooldown prevented vibration');
      return;
    }
    this.lastTrigger = now;

    this.log(`Triggered: ${preset}`);
    this.adapter[preset]();
  }
}
