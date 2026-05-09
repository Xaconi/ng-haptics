import { Component, inject, PLATFORM_ID, OnInit, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { HapticsService } from 'ng-haptics';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [QrCodeComponent],
  template: `
    <section class="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6">
      <!-- Background glow -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <!-- Left: text content -->
          <div class="flex-1 text-center lg:text-left">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              Angular 19 · Zero dependencies · SSR-safe
            </div>

            <h1 class="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              <span class="text-gradient">ng-haptics</span>
            </h1>

            <p class="text-lg text-zinc-400 mb-8 max-w-lg mx-auto lg:mx-0">
              The modern, Angular-native way to add haptic feedback to web applications.
              Declarative, SSR-safe, and zero dependencies.
            </p>

            <!-- CTA buttons -->
            <div class="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
              <a
                href="https://github.com/Xaconi/ng-haptics"
                target="_blank"
                rel="noopener"
                class="haptic-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                (click)="haptics.medium()"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/ng-haptics"
                target="_blank"
                rel="noopener"
                class="haptic-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                (click)="haptics.light()"
              >
                <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0v24h24V0H0zm13.333 20H10.667V8H5.333v12H2.667V4h10.666v16zm8 0H18.667V8H16v12h-2.667V4H21.333v16z"/></svg>
                npm
              </a>
              <button
                class="haptic-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors glow"
                (click)="tryHaptics()"
              >
                Try it now
              </button>
            </div>

            <!-- Haptic feedback indicator -->
            @if (feedbackMessage()) {
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs animate-fade-in">
                <span>✓</span>
                {{ feedbackMessage() }}
              </div>
            }
          </div>

          <!-- Right: QR code -->
          <div class="glass rounded-2xl p-6 flex flex-col items-center gap-4">
            <app-qr-code [size]="180" />
            <p class="text-xs text-zinc-500">Scan to test on your phone</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent implements OnInit {
  readonly haptics = inject(HapticsService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly feedbackMessage = signal('');
  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Welcome haptic on first visit
      setTimeout(() => this.haptics.light(), 800);
    }
  }

  tryHaptics(): void {
    this.haptics.success();
    this.showFeedback('Haptic fired! Check your phone.');
  }

  private showFeedback(msg: string): void {
    this.feedbackMessage.set(msg);
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => this.feedbackMessage.set(''), 2500);
  }
}
