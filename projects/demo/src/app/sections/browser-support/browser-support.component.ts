import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';

interface BrowserRow {
  browser: string;
  icon: string;
  support: 'full' | 'none' | 'limited';
  note: string;
}

@Component({
  selector: 'app-browser-support',
  standalone: true,
  imports: [SectionHeaderComponent],
  template: `
    <section id="browser-support">
      <app-section-header
        title="Browser Support"
        description="ng-haptics uses the Web Vibration API. Unsupported environments silently fall back to a no-op."
      />

      <div class="glass rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-zinc-800">
              <th class="px-4 py-3 text-left text-zinc-400 font-medium">Browser / Platform</th>
              <th class="px-4 py-3 text-left text-zinc-400 font-medium">Support</th>
              <th class="px-4 py-3 text-left text-zinc-400 font-medium hidden sm:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.browser; let last = $last) {
              <tr [class.border-b]="!last" class="border-zinc-800/50">
                <td class="px-4 py-3">
                  <span class="font-medium text-zinc-200">{{ row.icon }} {{ row.browser }}</span>
                </td>
                <td class="px-4 py-3">
                  @switch (row.support) {
                    @case ('full') {
                      <span class="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Supported
                      </span>
                    }
                    @case ('limited') {
                      <span class="inline-flex items-center gap-1 text-yellow-400 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        Limited
                      </span>
                    }
                    @case ('none') {
                      <span class="inline-flex items-center gap-1 text-zinc-500 text-xs font-medium">
                        <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                        No-op
                      </span>
                    }
                  }
                </td>
                <td class="px-4 py-3 text-zinc-500 text-xs hidden sm:table-cell">{{ row.note }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-zinc-600 text-center">
        Unsupported environments silently use NoopAdapter — no errors, no console warnings.
      </p>
    </section>
  `,
})
export class BrowserSupportComponent {
  readonly rows: BrowserRow[] = [
    { browser: 'Android Chrome', icon: '🟢', support: 'full', note: 'Full Vibration API support' },
    { browser: 'Android Firefox', icon: '🟢', support: 'full', note: 'Full Vibration API support' },
    { browser: 'iOS Safari', icon: '🟡', support: 'none', note: 'navigator.vibrate not supported' },
    { browser: 'iOS Chrome', icon: '🟡', support: 'none', note: 'Same WebKit limitations as Safari' },
    { browser: 'Desktop Chrome', icon: '⚪', support: 'none', note: 'API exists but no hardware haptics' },
    { browser: 'Desktop Firefox', icon: '⚪', support: 'none', note: 'API disabled for desktop' },
    { browser: 'Desktop Safari', icon: '⚪', support: 'none', note: 'API not implemented' },
    { browser: 'SSR / Node.js', icon: '✅', support: 'none', note: 'NoopAdapter — safe, no errors' },
  ];
}
