import { HapticsAdapter } from './haptics-adapter';

/**
 * iOS haptic feedback via the WebKit `<input type="checkbox" switch>` trick.
 *
 * Clicking a <label> wrapping a switch-styled checkbox fires the Taptic Engine
 * on iOS Safari/Chrome. Keys to make it work:
 *  - input.style.all = 'initial' (reset all styles)
 *  - input.style.appearance = 'auto' (native switch rendering)
 *  - click the <label>, not the input directly
 *  - element must be in the DOM (display:none is fine)
 *
 * Uses requestAnimationFrame to schedule multi-pulse patterns while staying
 * within the user-gesture context.
 */
export class IosSwitchAdapter implements HapticsAdapter {
  private label: HTMLLabelElement | null = null;
  private static idCounter = 0;

  isSupported(): boolean {
    if (typeof navigator === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  light(): void {
    this.pulse([]);
  }

  medium(): void {
    this.pulse([30]);
  }

  heavy(): void {
    this.pulse([20, 20]);
  }

  success(): void {
    this.pulse([50, 30]);
  }

  warning(): void {
    this.pulse([40]);
  }

  error(): void {
    this.pulse([25, 35]);
  }

  selection(): void {
    this.pulse([]);
  }

  pattern(gaps: number[]): void {
    this.pulse(gaps);
  }

  private getLabel(): HTMLLabelElement {
    if (!this.label) {
      const id = `ng-haptics-switch-${++IosSwitchAdapter.idCounter}`;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      input.id = id;
      input.style.all = 'initial';
      (input.style as CSSStyleDeclaration & { appearance: string }).appearance = 'auto';

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.style.display = 'none';
      label.appendChild(input);

      document.body.appendChild(label);
      this.label = label;
    }
    return this.label;
  }

  /**
   * Fire one immediate tap via label.click(), then schedule additional taps
   * using rAF. gaps[] = ms between consecutive taps. Empty = single tap.
   */
  private pulse(gaps: number[]): void {
    const label = this.getLabel();
    label.click();

    if (gaps.length === 0) return;

    let gapIndex = 0;
    let start = 0;

    const loop = (time: number) => {
      if (start === 0) start = time;
      const elapsed = time - start;

      let cumulative = 0;
      for (let i = 0; i <= gapIndex; i++) {
        cumulative += gaps[i] ?? 0;
      }

      if (elapsed >= cumulative) {
        label.click();
        gapIndex++;
        if (gapIndex < gaps.length) {
          requestAnimationFrame(loop);
        }
      } else {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }
}
