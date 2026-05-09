import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-installation',
  standalone: true,
  imports: [SectionHeaderComponent, CodeBlockComponent],
  template: `
    <section id="installation">
      <app-section-header
        title="Installation"
        description="Add ng-haptics to your Angular project in seconds."
      />

      <div class="space-y-4">
        <app-code-block label="npm" [code]="npmInstall" />
        <app-code-block label="app.config.ts" [code]="providerCode" />
      </div>
    </section>
  `,
})
export class InstallationComponent {
  readonly npmInstall = `npm install ng-haptics`;

  readonly providerCode = `import { provideHaptics } from 'ng-haptics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHaptics(),
    // ...
  ],
};`;
}
