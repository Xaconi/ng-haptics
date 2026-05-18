import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NgHapticFormDirective } from './haptic-form.directive';
import { HapticsService } from '../service/haptics.service';
import { HAPTICS_ADAPTER, HAPTICS_CONFIG } from '../tokens/haptics.tokens';
import { NoopAdapter } from '../adapters/noop.adapter';

@Component({
    template: `
    <form [formGroup]="form" ngHapticForm successPreset="success" errorPreset="error" novalidate>
      <input formControlName="name" />
      <button type="submit">Submit</button>
    </form>
  `,
    standalone: true,
    imports: [NgHapticFormDirective, ReactiveFormsModule],
})
class ReactiveFormTestComponent {
    form = new FormGroup({ name: new FormControl('', { nonNullable: true }) });
}

@Component({
    template: `
    <form ngHapticForm successPreset="success" errorPreset="error" novalidate>
      <input name="name" ngModel required />
      <button type="submit">Submit</button>
    </form>
  `,
    standalone: true,
    imports: [NgHapticFormDirective, FormsModule],
})
class TemplateFormTestComponent { }

describe('NgHapticFormDirective', () => {

    it('triggers success preset on a valid reactive form submit', async () => {
        const adapter = new NoopAdapter();
        const { fixture } = await render(ReactiveFormTestComponent, {
            componentImports: [NgHapticFormDirective, ReactiveFormsModule],
            providers: [
                HapticsService,
                { provide: HAPTICS_ADAPTER, useValue: adapter },
                { provide: HAPTICS_CONFIG, useValue: { debug: false } },
            ],
        });

        const service = fixture.componentRef.injector.get(HapticsService);
        const successSpy = vi.spyOn(service, 'success');

        const component = fixture.componentInstance;
        component.form.get('name')?.setValue('Test');
        fixture.detectChanges();

        const button = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(button);

        expect(successSpy).toHaveBeenCalledTimes(1);
    });

    it('triggers error preset on an invalid template-driven form submit', async () => {
        const adapter = new NoopAdapter();
        const { fixture } = await render(TemplateFormTestComponent, {
            componentImports: [NgHapticFormDirective, FormsModule],
            providers: [
                HapticsService,
                { provide: HAPTICS_ADAPTER, useValue: adapter },
                { provide: HAPTICS_CONFIG, useValue: { debug: false } },
            ],
        });

        const service = fixture.componentRef.injector.get(HapticsService);
        const errorSpy = vi.spyOn(service, 'error');

        const button = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(button);

        expect(errorSpy).toHaveBeenCalledTimes(1);
    });
});
