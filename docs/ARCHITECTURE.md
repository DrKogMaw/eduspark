# EduSpark architecture

## Overview

EduSpark is a client-side single-page application built with native ECMAScript modules, HTML, and CSS. It does not use a framework, package manager, application server, database, or external API at runtime.

```text
index.html
    │
    ▼
src/main.js
    │
    ▼
AppComponent
    ├── DashboardComponent
    ├── YonReadComponent
    ├── TypoSnapComponent
    ├── GuessingSnapComponent
    └── ParentModalComponent

Shared services
    ├── ProgressService ── localStorage
    ├── I18nService ───── language state and translations
    ├── SoundService ──── Web Audio and Speech Synthesis
    └── ToolRegistryService
```

## Rendering and navigation

`AppComponent` owns the active route and replaces the contents of the `#app` element with component-generated HTML. Components return HTML strings rather than managing a virtual DOM. User interactions call functions registered on `window` by `AppComponent`.

This keeps the prototype dependency-free, but it also means changes must account for full view re-renders, timer cleanup, HTML escaping, and globally named event handlers.

## State and persistence

`ProgressService` owns activity history, aggregate statistics, custom words, and custom stories. `I18nService` owns the selected language. Both persist state in browser `localStorage`.

Current storage keys:

- `eduspark_user_stats`
- `eduspark_progress_history`
- `eduspark_custom_stories`
- `eduspark_custom_words`
- `eduspark_lang`

There is no schema migration layer. Changes to persisted data structures should remain backward-compatible or introduce explicit migration and recovery behavior.

## Audio

Sound effects are synthesized with browser audio APIs. Spoken-word prompts use `SpeechSynthesisUtterance` when speech synthesis is available. Voice availability and pronunciation vary by browser and operating system, so speech must remain an enhancement rather than the only way to complete an activity.

## Source-of-truth warning

The browser loads `.js` modules directly. Several `.ts` files mirror earlier versions of those modules, but the repository currently has no build configuration and not every runtime module has a TypeScript counterpart. Until a build pipeline is introduced, verify behavior against the JavaScript runtime and keep matching TypeScript files synchronized where practical.

## Local server

`server.ps1` serves files from the repository root on port `8082`. It is intended only for local development. It has no TLS, authentication, caching strategy, directory isolation hardening, or production deployment configuration.

## Recommended evolution

1. Choose JavaScript or TypeScript as the canonical source format.
2. Add a minimal package manifest and reproducible build/test scripts.
3. Separate state transitions from HTML rendering so they can be unit tested.
4. Add browser-level tests for navigation, timing, persistence, and bilingual flows.
5. Add content escaping and validation boundaries for all custom parent content.
