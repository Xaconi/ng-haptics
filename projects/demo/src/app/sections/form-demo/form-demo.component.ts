import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { NgHapticFormDirective } from 'ng-haptics';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-form-demo',
    standalone: true,
    imports: [SectionHeaderComponent, NgHapticFormDirective, ReactiveFormsModule],
    template: `
    <section id="form-directive" class="mb-6">
      <app-section-header
        title="Form Directive"
        description="Trigger success or error haptics automatically when a form is submitted."
      />
      <form
        [formGroup]="form"
        ngHapticForm
        successPreset="success"
        errorPreset="error"
        novalidate
        class="grid gap-3 max-w-md"
      >
        <label class="grid gap-2 text-sm">
          <span class="text-zinc-300">Email</span>
          <input
            formControlName="email"
            type="email"
            placeholder="you@example.com"
            class="input-field text-zinc-600"
          />
        </label>

        <button type="submit" class="haptic-btn glass rounded-xl px-5 py-3">Submit</button>

        @if(form.invalid) {
          <p class="text-xs text-rose-300">
            Fill in a valid email to trigger success haptics.
          </p>
        }
      </form>
    </section>
  `,
})
export class FormDemoComponent {
    readonly form = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });
}


