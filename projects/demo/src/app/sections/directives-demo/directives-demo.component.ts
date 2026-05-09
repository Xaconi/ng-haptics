import { Component, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { NgHapticDirective, NgHapticTapDirective, NgHapticHoverDirective } from 'ng-haptics';

@Component({
  selector: 'app-directives-demo',
  standalone: true,
  imports: [SectionHeaderComponent, NgHapticDirective, NgHapticTapDirective, NgHapticHoverDirective],
  template: `
    <section id="directives" class="mb-6">
      <app-section-header
        title="Directives"
        description="Drop-in directives for declarative haptic feedback — no service injection needed."
      />

      <div class="grid sm:grid-cols-3 gap-4">
        <!-- ngHaptic -->
        <div class="glass rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded">[ngHaptic]</span>
          </div>
          <p class="text-sm text-zinc-400">Fires on <code class="text-zinc-300">click</code></p>
          <button
            class="haptic-btn w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
            [ngHaptic]="'success'"
            (click)="log('ngHaptic → success')"
          >
            Click me
          </button>
        </div>

        <!-- ngHapticTap -->
        <div class="glass rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">[ngHapticTap]</span>
          </div>
          <p class="text-sm text-zinc-400">Fires on <code class="text-zinc-300">pointerdown</code></p>
          <button
            class="haptic-btn w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors"
            [ngHapticTap]="'medium'"
            (pointerdown)="log('ngHapticTap → medium')"
          >
            Tap me
          </button>
        </div>

        <!-- ngHapticHover -->
        <div class="glass rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded">[ngHapticHover]</span>
            <span class="text-xs text-zinc-600">experimental</span>
          </div>
          <p class="text-sm text-zinc-400">Fires on <code class="text-zinc-300">pointerenter</code></p>
          <div
            class="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition-colors text-center cursor-pointer select-none"
            [ngHapticHover]="'light'"
            (pointerenter)="log('ngHapticHover → light')"
          >
            Hover me
          </div>
        </div>
      </div>

      @if (lastLog()) {
        <p class="mt-4 text-xs text-zinc-500 font-mono text-center">
          → {{ lastLog() }}
        </p>
      }
    </section>
  `,
})
export class DirectivesDemoComponent {
  readonly lastLog = signal('');

  log(msg: string): void {
    this.lastLog.set(msg);
    setTimeout(() => this.lastLog.set(''), 2000);
  }
}
