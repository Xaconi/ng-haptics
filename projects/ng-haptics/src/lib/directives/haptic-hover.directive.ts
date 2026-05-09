import { Directive, HostListener, inject, input } from '@angular/core';
import { HapticPreset } from '../types/haptics.types';
import { HapticsService } from '../service/haptics.service';

/**
 * Experimental: triggers haptic feedback on hover (pointerenter).
 * A 500ms throttle prevents spamming vibration during continuous movement.
 */
@Directive({
  selector: '[ngHapticHover]',
  standalone: true,
})
export class NgHapticHoverDirective {
  readonly ngHapticHover = input<HapticPreset>('light');

  private readonly haptics = inject(HapticsService);
  private lastFired = 0;

  @HostListener('pointerenter')
  onPointerEnter(): void {
    const now = Date.now();
    if (now - this.lastFired < 500) return;
    this.lastFired = now;
    this.haptics[this.ngHapticHover()]();
  }
}
