import { Directive, HostListener, inject, input } from '@angular/core';
import { HapticPreset } from '../types/haptics.types';
import { HapticsService } from '../service/haptics.service';

@Directive({
  selector: '[ngHapticTap]',
  standalone: true,
})
export class NgHapticTapDirective {
  readonly ngHapticTap = input<HapticPreset>('medium');

  private readonly haptics = inject(HapticsService);

  @HostListener('pointerdown')
  onPointerDown(): void {
    this.haptics[this.ngHapticTap()]();
  }
}
