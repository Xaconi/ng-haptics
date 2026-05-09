import { Component, inject, signal } from '@angular/core';
import { HapticsService, HapticPreset } from 'ng-haptics';
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
  imports: [SectionHeaderComponent],
  template: `
    <section id="examples">
      <app-section-header
        title="Quick Examples"
        description="Tap any button to feel the haptic feedback on your mobile device."
      />

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        @for (btn of buttons; track btn.preset) {
          <button
            class="haptic-btn glass rounded-xl p-4 flex flex-col items-start gap-2 transition-all hover:border-white/20 active:scale-95 text-left"
            [class.ring-1]="lastFired() === btn.preset"
            [class.ring-violet-500]="lastFired() === btn.preset"
            (click)="fire(btn.preset)"
          >
            <span class="text-xl">{{ btn.description }}</span>
            <span class="text-sm font-medium text-zinc-200">{{ btn.label }}</span>
            <span class="text-xs text-zinc-500 font-mono">haptics.{{ btn.preset }}()</span>
          </button>
        }
      </div>

      @if (lastFired()) {
        <p class="mt-4 text-center text-sm text-zinc-500">
          Last fired: <code class="text-violet-400">{{ lastFired() }}()</code>
        </p>
      }
    </section>
  `,
})
export class QuickExamplesComponent {
  private readonly haptics = inject(HapticsService);
  readonly lastFired = signal<HapticPreset | ''>('');

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
    this.lastFired.set(preset);
    setTimeout(() => this.lastFired.set(''), 1500);
  }
}
