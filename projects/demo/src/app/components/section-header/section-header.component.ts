import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  template: `
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-zinc-100 mb-2">{{ title() }}</h2>
      @if (description()) {
        <p class="text-zinc-400">{{ description() }}</p>
      }
    </div>
  `,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
