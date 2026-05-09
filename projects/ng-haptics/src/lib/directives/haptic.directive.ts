import { Directive, HostListener, Input, inject } from '@angular/core';
import { HapticPreset } from '../types/haptics.types';
import { HapticsService } from '../service/haptics.service';

@Directive({
  selector: '[ngHaptic]',
  standalone: true,
})
export class NgHapticDirective {
  @Input() ngHaptic: HapticPreset = 'medium';

  private readonly haptics = inject(HapticsService);

  @HostListener('click')
  onClick(): void {
    this.haptics[this.ngHaptic]();
  }
}
