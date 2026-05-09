export interface HapticsAdapter {
  isSupported(): boolean;
  light(): void;
  medium(): void;
  heavy(): void;
  success(): void;
  warning(): void;
  error(): void;
  selection(): void;
  pattern(pattern: number[]): void;
}
