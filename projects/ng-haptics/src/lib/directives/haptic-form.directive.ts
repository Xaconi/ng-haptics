import { Directive, HostListener, inject, input } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HapticPreset } from '../types/haptics.types';
import { HapticsService } from '../service/haptics.service';

@Directive({
    selector: '[ngHapticForm]',
    standalone: true,
})
export class NgHapticFormDirective {
    readonly successPreset = input<HapticPreset>('success');
    readonly errorPreset = input<HapticPreset>('error');

    private readonly haptics = inject(HapticsService);
    private readonly formGroupDirective = inject(FormGroupDirective, { optional: true });
    private readonly ngForm = inject(NgForm, { optional: true });

    @HostListener('submit', ['$event'])
    onSubmit(event: SubmitEvent): void {
        const form = event.currentTarget as HTMLFormElement | null;
        const isValid = this.isFormValid(form);
        this.haptics[isValid ? this.successPreset() : this.errorPreset()]();
    }

    private isFormValid(form: HTMLFormElement | null): boolean {
        if (this.formGroupDirective) {
            return !!this.formGroupDirective.valid;
        }

        if (this.ngForm) {
            return !!this.ngForm.valid;
        }

        return form?.checkValidity() ?? false;
    }
}
