import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { QuickExamplesComponent } from './sections/quick-examples/quick-examples.component';
import { InstallationComponent } from './sections/installation/installation.component';
import { BasicUsageComponent } from './sections/basic-usage/basic-usage.component';
import { DirectivesDemoComponent } from './sections/directives-demo/directives-demo.component';
import { ConfigurationComponent } from './sections/configuration/configuration.component';
import { BrowserSupportComponent } from './sections/browser-support/browser-support.component';
import { WhyLibraryComponent } from './sections/why-library/why-library.component';
import { CustomPatternComponent } from './sections/custom-pattern/custom-pattern.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroComponent,
    QuickExamplesComponent,
    InstallationComponent,
    BasicUsageComponent,
    DirectivesDemoComponent,
    ConfigurationComponent,
    BrowserSupportComponent,
    WhyLibraryComponent,
    CustomPatternComponent,
  ],
  template: `
    <div class="min-h-screen">
      <app-hero />
      <main class="max-w-4xl mx-auto px-4 sm:px-6 pb-32 space-y-24">
        <app-quick-examples />
        <app-installation />
        <app-basic-usage />
        <app-directives-demo />
        <app-custom-pattern />
        <app-configuration />
        <app-browser-support />
        <app-why-library />
      </main>
      <footer class="border-t border-zinc-800 mt-24 py-12 text-center text-zinc-500 text-sm">
        <p>
          <span class="text-zinc-400 font-medium">ng-haptics</span> — MIT License —
          Built with ❤️ by <a href="https://github.com/Xaconi" target="_blank" class="text-violet-400 hover:underline">Xaconi</a>
        </p>
      </footer>
    </div>
  `,
})
export class AppComponent { }
