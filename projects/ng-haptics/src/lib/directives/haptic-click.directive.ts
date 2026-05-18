import { Directive, HostListener, inject, Input } from '@angular/core';
import { HapticPreset } from '../types/haptics.types';
import { HapticsService } from '../service/haptics.service';

@Directive({
    selector: '[ngHapticClick]'
})
export class NgHapticClickDirective {
    private preset: HapticPreset = 'light';

    @Input() set ngHapticClick(value: HapticPreset | '') {
        this.preset = (value || 'light') as HapticPreset;
    }

    private readonly haptics = inject(HapticsService);

    @HostListener('pointerup', ['$event'])
    @HostListener('click', ['$event'])
    @HostListener('touchend', ['$event'])
    onActivate(_: Event): void {
        this.haptics[this.preset]();
    }
}
