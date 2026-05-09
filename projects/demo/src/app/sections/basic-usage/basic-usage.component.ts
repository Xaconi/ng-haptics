import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';

@Component({
  selector: 'app-basic-usage',
  standalone: true,
  imports: [SectionHeaderComponent, CodeBlockComponent],
  template: `
    <section id="usage">
      <app-section-header
        title="Basic Usage"
        description="Inject HapticsService and call haptic presets anywhere in your app."
      />

      <div class="space-y-4">
        <app-code-block label="component.ts" [code]="serviceUsage" />
        <app-code-block label="template.html — declarative directives" [code]="directiveUsage" />
        <app-code-block label="sequence API" [code]="sequenceUsage" />
      </div>
    </section>
  `,
})
export class BasicUsageComponent {
  readonly serviceUsage = `import { HapticsService } from 'ng-haptics';

@Component({ ... })
export class MyComponent {
  private readonly haptics = inject(HapticsService);

  onSave() {
    // do the save...
    this.haptics.success();
  }

  onDelete() {
    this.haptics.error();
  }

  onSelect(item: Item) {
    this.haptics.selection();
  }
}`;

  readonly directiveUsage = `<!-- Triggers on click -->
<button [ngHaptic]="'success'">Save</button>

<!-- Triggers on pointerdown (faster feedback) -->
<button [ngHapticTap]="'medium'">Submit</button>

<!-- Experimental: triggers on hover -->
<div [ngHapticHover]="'light'">Hover me</div>

<!-- Custom vibration pattern -->
<button (click)="haptics.pattern([50, 30, 50, 30, 50])">
  Custom pattern
</button>`;

  readonly sequenceUsage = `// Sequence API (async)
await haptics.sequence([
  'light',
  { delay: 40 },
  'medium',
  { delay: 60 },
  'success',
]);`;
}
