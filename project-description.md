# Angular Haptics Toolkit

## Objetivo

Crear una librería moderna para Angular que permita integrar feedback háptico (vibración/haptics) en aplicaciones web de forma declarativa, idiomática y Angular-first.

El proyecto debe incluir:

1. Una librería Angular publicada en npm.
2. Una aplicación demo/documentación dentro del mismo monorepo.
3. Deploy automático de la demo en GitHub Pages.
4. Arquitectura moderna y mantenible.
5. Excelente DX (Developer Experience).

La idea NO es crear un simple wrapper de `navigator.vibrate()`, sino una solución Angular-native enfocada en:

* directives
* dependency injection
* standalone APIs
* SSR safety
* progressive enhancement
* Signals compatibility
* diseño limpio y profesional

---

# Restricción importante

La librería debe ser:

* 100% Web API native
* sin dependencias externas para haptics
* sin Capacitor
* sin Ionic
* sin wrappers móviles
* sin SDKs externos

Toda la funcionalidad debe construirse únicamente usando:

```ts
navigator.vibrate()
```

y APIs estándar del navegador.

El objetivo es crear:

* una experiencia Angular moderna
* sobre capacidades nativas del navegador
* con fallback elegante
* y excelente DX

---

# Stack técnico

## Requisitos

* Angular 20+
* Standalone APIs únicamente
* TypeScript estricto
* ESLint
* Prettier
* Jest o Vitest
* Angular Package Format (APF)

Preferiblemente Angular CLI workspace con:

```txt
projects/
  ng-haptics/
  demo/
```

---

# Arquitectura del repositorio

```txt
root/
├── projects/
│   ├── ng-haptics/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ng-package.json
│   │
│   └── demo/
│       ├── src/
│       └── public/
│
├── .github/
│   └── workflows/
│
├── README.md
├── package.json
└── angular.json
```

---

# Filosofía del proyecto

La API debe sentirse como una extensión natural de Angular moderno.

NO crear:

* una librería JavaScript genérica
* un wrapper minimalista de vibración

SÍ crear:

* una experiencia Angular-native
* declarativa
* moderna
* limpia
* tipada
* mantenible

---

# Qué son los adapters

Aunque la librería solo usará Web APIs nativas, internamente debe usar una arquitectura basada en adapters.

## Objetivo de los adapters

Separar:

* la API pública Angular
* de la implementación concreta del navegador

Esto permite:

* mantener código limpio
* facilitar testing
* desacoplar lógica
* soportar distintos modos internos
* tener fallback elegante
* mejorar mantenibilidad

---

# Ejemplo conceptual

El usuario usará:

```ts
const haptics = inject(HapticsService);

haptics.success();
```

Pero internamente:

```txt
HapticsService
    ↓
HapticsAdapter
    ↓
navigator.vibrate()
```

---

# Adapter esperado

```ts
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
```

---

# Implementaciones esperadas

## 1. WebVibrationAdapter

Implementación principal.

Debe usar exclusivamente:

```ts
navigator.vibrate()
```

Mapear internamente presets a patrones de vibración.

Ejemplo:

```ts
success() {
  navigator.vibrate([10, 40, 20]);
}
```

---

## 2. NoopAdapter

Fallback silencioso.

Debe activarse cuando:

* `navigator.vibrate` no exista
* SSR
* desktop incompatible
* reduced motion activado
* librería deshabilitada

Todas las funciones deben ser no-op.

Ejemplo:

```ts
success() {}
```

---

# NO usar dependencias externas

NO usar:

* Capacitor
* Ionic
* HammerJS
* RxJS innecesario
* librerías de gestures
* wrappers de vibración

La librería debe mantenerse:

* minimalista
* tiny bundle
* framework-native

---

# Funcionalidades esperadas

# 1. HapticsService

API principal:

```ts
const haptics = inject(HapticsService);

haptics.light();
haptics.medium();
haptics.heavy();

haptics.success();
haptics.warning();
haptics.error();

haptics.selection();

haptics.pattern([10, 20, 10]);
```

---

# 2. Directives declarativas

## ngHaptic

```html
<button ngHaptic="light">
```

---

## ngHapticTap

```html
<button ngHapticTap="success">
```

---

## ngHapticHover (experimental)

```html
<div ngHapticHover="soft">
```

---

# 3. Providers

Configuración global:

```ts
provideHaptics({
  enabled: true,
  respectReducedMotion: true,
  debug: false
});
```

---

# Configuración esperada

```ts
export interface HapticsConfig {
  enabled?: boolean;
  respectReducedMotion?: boolean;
  debug?: boolean;
}
```

---

# SSR / Angular Universal

La librería DEBE:

* ser SSR-safe
* no acceder a `window` o `navigator` fuera de runtime browser
* funcionar correctamente en Angular Universal

Usar:

* `isPlatformBrowser`
* `inject(PLATFORM_ID)`

---

# Signals compatibility

La librería debe ser compatible con Angular moderno:

* standalone-first
* signals-friendly
* zoneless-friendly
* sin dependencias de Zone.js

---

# Performance

Objetivos:

* tree-shakeable
* side-effect free
* bundle mínimo
* sin listeners innecesarios

---

# Accesibilidad

MUY IMPORTANTE.

La librería debe respetar:

```css
prefers-reduced-motion
```

Si el usuario tiene reducción de movimiento:

* desactivar haptics automáticamente
* salvo override explícito

---

# Eventos soportados

## Mínimo

* click
* pointerdown
* pointerup

---

# API de secuencias (stretch goal)

```ts
haptics.sequence([
  'light',
  delay(40),
  'medium',
  delay(60),
  'success'
]);
```

---

# Tipado

Todo debe estar completamente tipado.

NO usar:

* `any`
* casts innecesarios

---

# Testing

## Unit tests

Cubrir:

* adapters
* directives
* providers
* browser detection
* reduced motion
* SSR

---

# Publicación npm

La librería debe poder publicarse fácilmente.

## Scripts esperados

```json
{
  "build": "ng build ng-haptics",
  "test": "jest",
  "lint": "ng lint",
  "release": "npm publish ./dist/ng-haptics"
}
```

---

# Desarrollo local en red (MUY IMPORTANTE)

La aplicación demo DEBE poder ejecutarse en:

```txt
0.0.0.0
```

para que dispositivos móviles en la misma red WiFi puedan acceder y probar los haptics reales.

## Requisitos

El proyecto debe incluir scripts preparados para esto.

## Scripts esperados

```json
{
  "start": "ng serve demo",
  "start:host": "ng serve demo --host 0.0.0.0 --port 4200"
}
```

---

# Objetivo esperado

Permitir:

* abrir la demo desde un móvil real
* probar vibración/haptics directamente
* escanear el QR desde el móvil
* desarrollar y validar UX háptica localmente

---

# QR dinámico en desarrollo local

La demo debe:

* detectar automáticamente la URL local accesible
* generar un QR hacia:

  * localhost en desktop
  * IP local para móvil

Ejemplo:

```txt
http://192.168.1.34:4200
```

El QR debe actualizarse automáticamente en desarrollo.

---

# Versionado

Usar:

* semantic versioning
* Conventional Commits

---

# README.md

El README debe verse profesional.

Debe incluir:

* badges
* instalación
* ejemplos rápidos
* API docs
* demo link
* compatibilidad
* roadmap

---

# Aplicación demo/documentación

## Objetivo

La demo debe servir como:

* playground
* landing page
* documentación visual

Inspiración:

* web-haptics demos
* shadcn/ui
* Vercel docs
* Angular.dev

---

# Diseño esperado

## Estilo

* minimalista
* moderno
* dark mode
* mobile-first
* animaciones suaves
* spacing amplio
* tarjetas limpias
* tipografía elegante

NO hacer:

* diseño corporativo
* Bootstrap clásico
* Material Design pesado

---

# Tecnologías UI

Permitido:

* TailwindCSS
* Angular animations
* Lucide icons

---

# Estructura de la demo

# Hero section

Debe incluir:

* nombre de la librería
* tagline
* botones:

  * GitHub
  * npm
  * documentación
* QR grande para abrir la demo en móvil
* mensaje:
  “Open on mobile to test haptics”

---

# Secciones esperadas

## 1. Quick examples

Botones interactivos:

* Light impact
* Medium impact
* Heavy impact
* Success
* Warning
* Error

---

## 2. Installation

```bash
npm install ng-haptics
```

---

## 3. Basic usage

Mostrar snippets reales.

---

## 4. Directives

Demo interactiva.

---

## 5. Configuration

Ejemplos de:

* provideHaptics
* reduced motion
* SSR safety

---

## 6. Browser support

Tabla visual:

* Android Chrome
* iOS Safari
* Desktop browsers

Explicar limitaciones reales.

---

## 7. Why this library?

Explicar:

* Angular-first
* SSR-safe
* standalone
* declarative
* tiny bundle
* zero dependencies

---

# QR Code

MUY IMPORTANTE.

La app debe:

* generar automáticamente un QR hacia la URL actual
* mostrarlo prominentemente
* facilitar test en móviles reales

---

# GitHub Pages

Configurar deploy automático.

## Workflow esperado

Al hacer push a `main`:

* build demo
* deploy GitHub Pages

---

# GitHub Actions

## Workflows

### CI

* install
* lint
* test
* build

### Deploy

* build demo
* deploy pages

---

# Calidad del código

Se espera:

* arquitectura limpia
* separación clara
* nombres consistentes
* documentación inline
* sin overengineering

---

# Objetivo de bundle

Intentar mantener:

* librería extremadamente ligera
* idealmente <10kb gzip

---

# Naming

Paquete:

* `ng-haptics`

Imports:

```ts
import {
  provideHaptics,
  HapticsService
} from 'ng-haptics';
```

---

# Resultado esperado

El resultado final debe sentirse como:

> “La forma moderna y Angular-native de añadir haptics a aplicaciones web.”

No como:

> “otro wrapper de vibración”.

La prioridad es:

1. excelente DX
2. API limpia
3. demo impresionante
4. arquitectura mantenible
5. experiencia Angular moderna
6. zero dependencies
7. Web API native
