import { Component, input } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="relative rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      @if (label()) {
        <div class="px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
          <span class="text-xs text-zinc-500 font-mono">{{ label() }}</span>
        </div>
      }
      <pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="text-zinc-300 font-mono">{{ code() }}</code></pre>
    </div>
  `,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly label = input<string>('');
}
