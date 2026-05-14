import { Injectable, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { HapticPreset, HapticPulse, HapticsConfig, HapticsSupport, SequenceEntry } from '../types/haptics.types';

@Injectable()
export class HapticsService implements OnDestroy {
  private readonly adapter = inject(HAPTICS_ADAPTER);
  private readonly config: HapticsConfig = inject(HAPTICS_CONFIG);
  private readonly platformId = inject(PLATFORM_ID);
  private lastTrigger = 0;
  private reducedMotion = false;
  private reducedMotionQuery: MediaQueryList | null = null;
  private reducedMotionListener: ((event: MediaQueryListEvent) => void) | null = null;

  constructor() {
    this.initializeReducedMotionListener();
  }

  private initializeReducedMotionListener(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.config.respectReducedMotion) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotionQuery = mediaQuery;
    this.reducedMotion = mediaQuery.matches;

    this.reducedMotionListener = (event: MediaQueryListEvent) => {
      this.reducedMotion = event.matches;
      this.log(`Reduced motion changed: ${this.reducedMotion}`);
    };

    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', this.reducedMotionListener);
    } else if ('addListener' in mediaQuery) {
      (mediaQuery as any).addListener(this.reducedMotionListener);
    }
  }

  ngOnDestroy(): void {
    if (!this.reducedMotionQuery || !this.reducedMotionListener) {
      return;
    }

    if ('removeEventListener' in this.reducedMotionQuery) {
      this.reducedMotionQuery.removeEventListener('change', this.reducedMotionListener);
    } else if ('removeListener' in this.reducedMotionQuery) {
      (this.reducedMotionQuery as any).removeListener(this.reducedMotionListener);
    }
  }

  private log(message: string, payload?: unknown): void {
    if (!this.config.debug) {
      return;
    }

    if (payload !== undefined) {
      console.log('[ng-haptics]', message, payload);
    } else {
      console.log('[ng-haptics]', message);
    }
  }

  private shouldBlockForReducedMotion(): boolean {
    return !!this.config.respectReducedMotion && this.reducedMotion;
  }

  get isSupported(): boolean {
    return this.adapter.isSupported();
  }

  support(): HapticsSupport {
    if (!isPlatformBrowser(this.platformId)) {
      return {
        supported: false,
        platform: 'unknown',
        method: 'unsupported',
        browser: 'unknown',
        reducedMotion: false,
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Platform detection
    let platform: HapticsSupport['platform'] = 'unknown';
    if (userAgent.includes('android')) {
      platform = 'android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
      platform = 'ios';
    } else if (userAgent.includes('mac') || userAgent.includes('windows') || userAgent.includes('linux')) {
      platform = 'desktop';
    }

    // Browser detection
    let browser: HapticsSupport['browser'] = 'unknown';
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      browser = 'chrome';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browser = 'safari';
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox';
    } else if (userAgent.includes('edg')) {
      browser = 'edge';
    }

    // Method detection
    let method: HapticsSupport['method'] = 'unsupported';
    if ('vibrate' in navigator) {
      method = 'vibration-api';
    } else {
      method = 'noop';
    }

    const supported = this.isSupported;
    const result: HapticsSupport = {
      supported,
      platform,
      method,
      browser,
      reducedMotion: this.reducedMotion,
    };

    this.log(`Support: ${supported ? 'supported' : 'unsupported'}`, result);

    return result;
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
