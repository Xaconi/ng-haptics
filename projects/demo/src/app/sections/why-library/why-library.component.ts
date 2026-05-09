import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

interface Reason {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-why-library',
  standalone: true,
  imports: [SectionHeaderComponent],
  template: `
    <section id="why">
      <app-section-header
        title="Why ng-haptics?"
        description="Not another vibration wrapper. A first-class Angular experience."
      />

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (reason of reasons; track reason.title) {
          <div class="glass rounded-xl p-5 space-y-2">
            <div class="text-2xl">{{ reason.icon }}</div>
            <h3 class="font-semibold text-zinc-100">{{ reason.title }}</h3>
            <p class="text-sm text-zinc-400 leading-relaxed">{{ reason.description }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class WhyLibraryComponent {
  readonly reasons: Reason[] = [
    {
      icon: '🅰️',
      title: 'Angular-native',
      description: 'Built with Angular DI, standalone APIs, and Signals in mind. Feels like Angular, not a port.',
    },
    {
      icon: '🌐',
      title: 'SSR-safe',
      description: 'Uses isPlatformBrowser() internally. Works with Angular Universal and zoneless apps out of the box.',
    },
    {
      icon: '📦',
      title: 'Zero dependencies',
      description: 'No Capacitor, no Ionic, no wrappers. Pure Web Vibration API under a clean Angular abstraction.',
    },
    {
      icon: '🎯',
      title: 'Declarative',
      description: 'Use [ngHaptic], [ngHapticTap], or inject HapticsService. The right abstraction for every use case.',
    },
    {
      icon: '♿',
      title: 'Accessible',
      description: 'Respects prefers-reduced-motion by default. Haptics are silently disabled for users who opt out.',
    },
    {
      icon: '🔬',
      title: 'Testable',
      description: 'Adapter pattern makes testing trivial. Swap WebVibrationAdapter for NoopAdapter in any test.',
    },
    {
      icon: '🪶',
      title: 'Tiny bundle',
      description: 'Tree-shakeable, side-effect free, and targets <10kb gzip. Your users won\'t notice it.',
    },
    {
      icon: '🔷',
      title: 'Fully typed',
      description: 'TypeScript strict mode throughout. HapticPreset union type prevents invalid preset names at compile time.',
    },
    {
      icon: '⚡',
      title: 'Signals-ready',
      description: 'Zoneless-friendly and compatible with the Angular Signals model. No Zone.js dependency.',
    },
  ];
}
