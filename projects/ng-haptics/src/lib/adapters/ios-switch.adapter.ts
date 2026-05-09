import { HapticPulse } from '../types/haptics.types';
import { HapticsAdapter } from './haptics-adapter';
import { HAPTIC_PRESETS } from './haptic-presets';

const INTENSITY_THRESHOLD = 0.2;

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
 * Intensity maps to a threshold: pulses with intensity < 0.2 are skipped.
 * Delay maps to a pause before firing the click, scheduled via rAF to stay
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

  light(): void      { this.executePulses(HAPTIC_PRESETS.light); }
  medium(): void     { this.executePulses(HAPTIC_PRESETS.medium); }
  heavy(): void      { this.executePulses(HAPTIC_PRESETS.heavy); }
  success(): void    { this.executePulses(HAPTIC_PRESETS.success); }
  warning(): void    { this.executePulses(HAPTIC_PRESETS.warning); }
  error(): void      { this.executePulses(HAPTIC_PRESETS.error); }
  selection(): void  { this.executePulses(HAPTIC_PRESETS.selection); }

  pattern(pulses: HapticPulse[]): void {
    this.executePulses(pulses);
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

  private executePulses(pulses: HapticPulse[]): void {
    const label = this.getLabel();

    // Convert pulses to absolute click timestamps; skip low-intensity pulses
    let t = 0;
    const clickTimes: number[] = [];
    for (const pulse of pulses) {
      t += pulse.delay ?? 0;
      if ((pulse.intensity ?? 1.0) >= INTENSITY_THRESHOLD) {
        clickTimes.push(t);
      }
    }

    if (clickTimes.length === 0) return;

    let index = 0;
    let start = 0;

    const loop = (time: number) => {
      if (start === 0) start = time;
      const elapsed = time - start;

      while (index < clickTimes.length && elapsed >= clickTimes[index]) {
        label.click();
        index++;
      }

      if (index < clickTimes.length) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }
}
