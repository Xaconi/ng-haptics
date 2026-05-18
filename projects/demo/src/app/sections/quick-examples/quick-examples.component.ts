import {
  Component, inject
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HapticsService, HapticPreset, NgHapticClickDirective, NgHapticFormDirective } from 'ng-haptics';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

interface HapticButton {
  preset: HapticPreset;
  label: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-quick-examples',
  standalone: true,
  imports: [SectionHeaderComponent, NgHapticClickDirective, NgHapticFormDirective, ReactiveFormsModule],
  template: `
    <section id="examples">
      <app-section-header
        title="Quick Examples"
        description="Tap any button to feel the haptic feedback on your mobile device."
      />

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        @for (btn of buttons; track btn.preset) {
          <button
            class="haptic-btn glass rounded-xl p-4 flex flex-col items-start gap-2 transition-all hover:border-white/20 active:scale-95 text-left"
            (click)="fire(btn.preset)"
          >
            <span class="text-xl">{{ btn.description }}</span>
            <span class="text-sm font-medium text-zinc-200">{{ btn.label }}</span>
            <span class="text-xs text-zinc-500 font-mono">haptics.{{ btn.preset }}()</span>
          </button>
        }
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Declarative Click Directive</h3>
        <div class="flex gap-3">
          <button ngHapticClick class="haptic-btn glass rounded-xl p-3">Default (light)</button>
          <button ngHapticClick="success" class="haptic-btn glass rounded-xl p-3">Success</button>
          <button ngHapticClick="error" class="haptic-btn glass rounded-xl p-3">Error</button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Forms Feedback</h3>
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
              class="input-field"
            />
          </label>

          <button type="submit" class="haptic-btn glass rounded-xl px-5 py-3">Submit</button>

          @if(form.invalid) {
            <p class="text-xs text-rose-300">
              Fill in a valid email to trigger success haptics.
            </p>
          }
        </form>
      </div>
    </section>
  `,
})
export class QuickExamplesComponent {
  private readonly haptics = inject(HapticsService);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly buttons: HapticButton[] = [
    { preset: 'light', label: 'Light', description: '🫧', color: 'zinc' },
    { preset: 'medium', label: 'Medium', description: '✋', color: 'zinc' },
    { preset: 'heavy', label: 'Heavy', description: '🔨', color: 'zinc' },
    { preset: 'success', label: 'Success', description: '✅', color: 'green' },
    { preset: 'warning', label: 'Warning', description: '⚠️', color: 'yellow' },
    { preset: 'error', label: 'Error', description: '❌', color: 'red' },
    { preset: 'selection', label: 'Selection', description: '👆', color: 'violet' },
  ];

  fire(preset: HapticPreset): void {
    this.haptics[preset]();
  }
}
