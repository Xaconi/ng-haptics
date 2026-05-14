import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HapticsService, HapticsSupport } from 'ng-haptics';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

@Component({
    selector: 'app-device-support',
    standalone: true,
    imports: [SectionHeaderComponent],
    template: `
    <section id="device-support" class="mb-6">
      <app-section-header
        title="Device Support"
        description="Live haptics capability detection for this device and browser."
      />

      <div class="glass rounded-2xl p-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div class="grid gap-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/60">
              <p class="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Platform</p>
              <p class="text-2xl font-semibold text-zinc-100">{{ support?.platform || 'Checking…' }}</p>
            </div>

            <div class="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/60">
              <p class="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Browser</p>
              <p class="text-2xl font-semibold text-zinc-100">{{ support?.browser || 'Checking…' }}</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/60">
              <p class="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Support</p>
              <p class="text-2xl font-semibold text-zinc-100">{{ support ? (support.supported ? 'Full' : 'Limited') : 'Checking…' }}</p>
            </div>

            <div class="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/60">
              <p class="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Reduced Motion</p>
              <p class="text-2xl font-semibold text-zinc-100">
                {{ support ? (support.reducedMotion ? 'Enabled' : 'Disabled') : 'Checking…' }}
              </p>
            </div>
          </div>

          <div class="rounded-2xl border border-zinc-800 p-5 bg-zinc-950/60">
            <p class="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">Method</p>
            <p class="text-base font-medium text-zinc-100">{{ support?.method || 'Checking…' }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-zinc-800 p-6 bg-zinc-950/60 flex flex-col justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-violet-400 font-semibold mb-3">Works best on mobile</p>
            <h2 class="text-2xl font-semibold text-zinc-100 mb-3">Open this demo on your phone</h2>
            <p class="text-sm leading-7 text-zinc-400">
              The library is optimized for mobile haptic feedback. On desktop, unsupported environments silently fall back to a safe no-op adapter.
            </p>
          </div>

          <p class="mt-6 text-xs text-zinc-500">
            This panel is generated at runtime with <code>HapticsService.support()</code>, so you can see how the current browser behaves.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class DeviceSupportComponent implements OnInit {
    private readonly haptics = inject(HapticsService);
    private readonly platformId = inject(PLATFORM_ID);

    support: HapticsSupport | null = null;

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.support = this.haptics.support();
        }
    }
}
