import { Component, inject, signal, computed } from '@angular/core';
import { HapticsService } from 'ng-haptics';
import type { HapticPulse } from 'ng-haptics';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

interface PulseStep {
  duration: number;
  intensity: number;
  delay: number;
}

@Component({
  selector: 'app-custom-pattern',
  standalone: true,
  imports: [SectionHeaderComponent],
  template: `
    <section id="custom-pattern" class="mb-6">
      <app-section-header
        title="Custom Pattern Builder"
        description="Design your own haptic pattern and fire it live on your phone."
      />

      <!-- Platform notes -->
      <div class="flex flex-wrap gap-3 mb-4">
        <div class="glass rounded-lg px-3 py-2 text-xs text-zinc-400 flex items-start gap-2">
          <span class="text-green-400 shrink-0">🤖</span>
          <span><span class="text-zinc-300 font-medium">Android</span> — each step = one vibration pulse. <span class="font-mono text-violet-400">duration</span> controls length, <span class="font-mono text-violet-400">intensity</span> scales it.</span>
        </div>
        <div class="glass rounded-lg px-3 py-2 text-xs text-zinc-400 flex items-start gap-2">
          <span class="text-blue-400 shrink-0">🍎</span>
          <span><span class="text-zinc-300 font-medium">iOS</span> — each step = one Taptic Engine tap. <span class="font-mono text-violet-400">delay</span> controls rhythm, <span class="font-mono text-violet-400">duration</span> & <span class="font-mono text-violet-400">intensity</span> are ignored.</span>
        </div>
      </div>

      <div class="space-y-3">
        @for (step of steps(); track $index; let i = $index) {
          <div class="glass rounded-xl p-4 flex flex-wrap items-center gap-4">
            <span class="text-zinc-600 text-xs font-mono w-5 shrink-0">{{ i + 1 }}</span>

            <!-- Delay -->
            <div class="flex flex-col gap-1">
              <label for="delay-{{i}}" class="text-xs text-zinc-500">Delay (ms)</label>
              <input
                id="delay-{{i}}"
                type="number"
                [value]="step.delay"
                (input)="updateStep(i, 'delay', toNum($event))"
                min="0" max="2000" step="10"
                class="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 text-sm"
              />
            </div>

            <!-- Duration -->
            <div class="flex flex-col gap-1">
              <label for="duration-{{i}}" class="text-xs text-zinc-500">Duration (ms)</label>
              <input
                id="duration-{{i}}"
                type="number"
                [value]="step.duration"
                (input)="updateStep(i, 'duration', toNum($event))"
                min="1" max="1000" step="5"
                class="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 text-sm"
              />
            </div>

            <!-- Intensity -->
            <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label for="intensity-{{i}}" class="text-xs text-zinc-500">
                Intensity — <span class="text-zinc-300">{{ (step.intensity * 100).toFixed(0) }}%</span>
              </label>
              <input
                id="intensity-{{i}}"
                type="range"
                [value]="step.intensity"
                (input)="updateStep(i, 'intensity', toNum($event))"
                min="0" max="1" step="0.05"
                class="w-full accent-violet-500"
              />
            </div>

            <!-- Remove -->
            @if (steps().length > 1) {
              <button
                (click)="removeStep(i)"
                class="text-zinc-600 hover:text-red-400 transition-colors text-xl leading-none ml-auto"
                aria-label="Remove step"
              >×</button>
            }
          </div>
        }
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3 mt-4">
        <button
          (click)="addStep()"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
        >
          + Add step
        </button>
        <button
          (click)="fire()"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors glow"
        >
          Fire pattern
        </button>
        @if (fired()) {
          <span class="inline-flex items-center gap-1.5 text-green-400 text-sm animate-fade-in">
            <span>✓</span> Fired!
          </span>
        }
      </div>

      <!-- JSON preview -->
      <div class="mt-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-zinc-500 font-mono">HapticPulse[]</span>
          <button
            (click)="copyJson()"
            class="text-xs text-zinc-500 hover:text-violet-400 transition-colors"
          >{{ copied() ? '✓ Copied' : 'Copy' }}</button>
        </div>
        <pre class="glass rounded-xl p-4 text-xs text-zinc-300 font-mono overflow-x-auto leading-relaxed">{{ jsonPreview() }}</pre>
      </div>
    </section>
  `,
})
export class CustomPatternComponent {
  private readonly haptics = inject(HapticsService);

  // Default: a 3-step "success" style pattern so the user can immediately feel
  // something non-trivial when they first open the section.
  readonly steps = signal<PulseStep[]>([
    { duration: 10, intensity: 1.0, delay: 0 },
    { duration: 15, intensity: 1.0, delay: 50 },
    { duration: 25, intensity: 1.0, delay: 30 },
  ]);

  readonly fired = signal(false);
  readonly copied = signal(false);
  private firedTimer: ReturnType<typeof setTimeout> | null = null;
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  readonly jsonPreview = computed(() => {
    const pulses: HapticPulse[] = this.steps().map(s => {
      const pulse: HapticPulse = { duration: s.duration };
      if (s.intensity !== 1.0) pulse.intensity = +s.intensity.toFixed(2);
      if (s.delay > 0) pulse.delay = s.delay;
      return pulse;
    });
    return JSON.stringify(pulses, null, 2);
  });

  toNum(event: Event): number {
    return +(event.target as HTMLInputElement).value;
  }

  addStep(): void {
    this.steps.update(steps => [...steps, { duration: 20, intensity: 1.0, delay: 20 }]);
  }

  removeStep(index: number): void {
    this.steps.update(steps => steps.filter((_, i) => i !== index));
  }

  updateStep(index: number, field: keyof PulseStep, value: number): void {
    this.steps.update(steps =>
      steps.map((s, i) => i === index ? { ...s, [field]: value } : s)
    );
  }

  fire(): void {
    const pulses: HapticPulse[] = this.steps().map(s => ({
      duration: s.duration,
      intensity: s.intensity,
      ...(s.delay > 0 ? { delay: s.delay } : {}),
    }));
    this.haptics.pattern(pulses);
    this.fired.set(true);
    if (this.firedTimer) clearTimeout(this.firedTimer);
    this.firedTimer = setTimeout(() => this.fired.set(false), 1500);
  }

  copyJson(): void {
    navigator.clipboard?.writeText(this.jsonPreview()).then(() => {
      this.copied.set(true);
      if (this.copiedTimer) clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
