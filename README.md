# ng-haptics

[![npm version](https://img.shields.io/npm/v/ng-haptics.svg?style=flat-square)](https://www.npmjs.com/package/ng-haptics)
[![CI](https://github.com/Xaconi/ng-haptics/actions/workflows/ci.yml/badge.svg)](https://github.com/Xaconi/ng-haptics/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg?style=flat-square)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/ng-haptics?style=flat-square)](https://bundlephobia.com/package/ng-haptics)

> The modern, Angular-native way to add haptic feedback to web applications.

**[Live Demo →](https://nicog.github.io/ng-haptics)**

## Features

- 🅰️ **Angular-native** — DI, standalone APIs, Signals-ready
- 🌐 **SSR-safe** — works with Angular Universal, no `window`/`navigator` on server
- 📦 **Zero dependencies** — pure Web Vibration API, no Capacitor, no Ionic
- 🎯 **Declarative** — directives and service for every use case
- ♿ **Accessible** — respects `prefers-reduced-motion` by default
- 🔬 **Testable** — adapter pattern makes testing trivial
- 🪶 **Tiny** — <10kb gzip, tree-shakeable, side-effect free

## Installation

```bash
npm install ng-haptics
```

## Quick Start

**1. Add the provider:**

```ts
// app.config.ts
import { provideHaptics } from 'ng-haptics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHaptics(),
  ],
};
```

**2. Use the service:**

```ts
import { HapticsService } from 'ng-haptics';

@Component({ ... })
export class MyComponent {
  private readonly haptics = inject(HapticsService);

  onSave() {
    this.haptics.success();
  }
}
```

**3. Or use directives:**

```html
<button [ngHaptic]="'success'">Save</button>
<button [ngHapticTap]="'medium'">Submit</button>
```

## API Reference

### HapticsService

```ts
const haptics = inject(HapticsService);

// Impact presets
haptics.light();
haptics.medium();
haptics.heavy();

// Notification presets
haptics.success();
haptics.warning();
haptics.error();

// UI feedback
haptics.selection();

// Custom pattern (navigator.vibrate format)
haptics.pattern([50, 30, 50]);

// Sequence with delays
await haptics.sequence([
  'light',
  { delay: 40 },
  'success',
]);

// Check support
haptics.isSupported; // boolean
```

### Directives

| Directive | Event | Example |
|-----------|-------|---------|
| `[ngHaptic]` | `click` | `<button [ngHaptic]="'success'">` |
| `[ngHapticTap]` | `pointerdown` | `<button [ngHapticTap]="'medium'">` |
| `[ngHapticHover]` | `pointerenter` | `<div [ngHapticHover]="'light'">` |

### provideHaptics(config?)

```ts
interface HapticsConfig {
  enabled?: boolean;              // default: true
  respectReducedMotion?: boolean; // default: true
  debug?: boolean;                // default: false
}
```

## Browser Support

| Platform | Support |
|----------|---------|
| Android Chrome / Firefox | ✅ Full (Web Vibration API) |
| iOS Safari / Chrome | ✅ Full (WebKit switch trick) |
| Desktop browsers | — Silent no-op (no haptic hardware) |
| SSR / Node.js | — Silent no-op |

## Architecture

```
HapticsService
    ↓
HapticsAdapter (interface)
    ↓
WebVibrationAdapter     IosSwitchAdapter       NoopAdapter
(Android/Firefox)       (iOS Safari/Chrome)    (SSR/desktop)
navigator.vibrate()     <input switch>.click()
```

The adapter pattern cleanly separates the Angular API from the browser implementation, making testing, SSR, and future extensions straightforward.

## Development

```bash
# Install
npm install

# Run demo (with hot reload)
npm start

# Run demo accessible from mobile on local network
npm run start:host

# Tests
npm test

# Build library
npm run build

# Lint
npm run lint
```

## Roadmap

- [ ] `haptics.sequence()` builder API
- [ ] Angular CDK integration (focus, drag)
- [ ] Haptic patterns library
- [ ] Storybook examples
- [ ] `ngHapticLongPress` directive

## Contributing

Pull requests are welcome. Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## License

MIT © Nicolás Giacconi
