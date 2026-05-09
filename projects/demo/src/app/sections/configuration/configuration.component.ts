import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [SectionHeaderComponent, CodeBlockComponent],
  template: `
    <section id="configuration" class="mb-6">
      <app-section-header
        title="Configuration"
        description="Customize ng-haptics behavior globally via provideHaptics()."
      />

      <div class="space-y-4">
        <app-code-block label="HapticsConfig interface" [code]="configInterface" class="mb-6 w-full flex flex-col" />
        <app-code-block label="provideHaptics() options" [code]="configUsage" class="mb-6 w-full flex flex-col" />
        <app-code-block label="SSR safety" [code]="ssrNote" class="mb-6 w-full flex flex-col" />
      </div>
    </section>
  `,
})
export class ConfigurationComponent {
  readonly configInterface = `export interface HapticsConfig {
  enabled?: boolean;              // default: true
  respectReducedMotion?: boolean; // default: true
  debug?: boolean;                // default: false
}`;

  readonly configUsage = `// Enable debug logging in development
provideHaptics({ debug: !environment.production })

// Disable globally (e.g. for E2E tests)
provideHaptics({ enabled: false })

// Ignore prefers-reduced-motion (not recommended)
provideHaptics({ respectReducedMotion: false })`;

  readonly ssrNote = `// ng-haptics is SSR-safe out of the box.
// It uses isPlatformBrowser() internally — no window/navigator
// access happens on the server. NoopAdapter is selected automatically.

// Angular SSR setup — no extra config needed:
export const appConfig: ApplicationConfig = {
  providers: [
    provideHaptics(), // works on server and browser
  ],
};`;
}
