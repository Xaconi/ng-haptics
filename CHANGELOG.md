# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [1.2.0] - 2026-05-18

### Added

- Add `ngHapticClick` directive alias for click/tap interactions (default preset: light).
- Add `ngHapticForm` directive for form submit feedback with success and error presets.

## [1.1.1] - 2026-05-14

### Fixed

- Fix README

## [1.1.0] - 2026-05-14

### Added
- Support Detection API: New `support()` method in `HapticsService` to detect haptic capabilities at runtime
- `HapticsSupport` interface with platform, browser, method, and reduced motion detection
- Cooldown / Throttling support to prevent accidental vibration spam
- Debug Mode with consistent debug logs and support debug output
- Dynamic Reduced Motion support with live `prefers-reduced-motion` handling

### Updated

- Refactor Haptics service
- Demo improvements: live device support section with runtime browser detection and mobile guidance

## [1.0.2] - 2026-05-11

### Fixed
- Minor bug fixes and improvements

## [1.0.1] - 2026-05-10

### Added
- Initial public release
- Core haptic service with preset vibrations (light, medium, heavy, success, warning, error, selection)
- Custom pattern support for advanced haptic sequences
- Angular directives for declarative haptic feedback (`ngHaptic`, `ngHapticTap`, `ngHapticHover`)
- Adapter pattern for different haptic implementations (Web Vibration API, iOS Switch, No-op)
- SSR-safe implementation with Angular Universal support
- Respects `prefers-reduced-motion` media query
- Zero dependencies, tiny bundle size
- TypeScript support with full type definitions

### Changed
- Improved documentation and examples

## [1.0.0] - 2026-05-10

### Added
- Initial release with basic haptic functionality
- Web Vibration API integration
- Angular service and directives
- Basic adapter system