export { HapticsService } from './lib/service/haptics.service';
export { provideHaptics } from './lib/providers/provide-haptics';

export type { HapticsConfig, HapticPreset, SequenceEntry } from './lib/types/haptics.types';

export { NgHapticDirective } from './lib/directives/haptic.directive';
export { NgHapticTapDirective } from './lib/directives/haptic-tap.directive';
export { NgHapticHoverDirective } from './lib/directives/haptic-hover.directive';

export type { HapticsAdapter } from './lib/adapters/haptics-adapter';
export { WebVibrationAdapter } from './lib/adapters/web-vibration.adapter';
export { IosSwitchAdapter } from './lib/adapters/ios-switch.adapter';
export { NoopAdapter } from './lib/adapters/noop.adapter';

export { HAPTICS_CONFIG, HAPTICS_ADAPTER } from './lib/tokens/haptics.tokens';
