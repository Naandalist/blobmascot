# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [SemVer](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-09-10

### Added

- `exportWebp()` still export
- Playground theme skins: lavender, light, dark
- Shared pointer listener so many mascots do not each bind `pointermove`

### Notes

- Still exports are PNG and WebP. There is no GIF export.
- Tag `v0.2.0` after merge to publish with OIDC.

## [0.1.1] - 2026-09-10

First public release on [npm](https://www.npmjs.com/package/blobmascot).

### Added

- `<BlobMascot />` canvas component for React 18+
- `useBlobMascot()` hook and `createController()` for headless use
- 12 morphing shapes: circle, pebble, squircle, capsule, triangle, cloud, droplet, flame, medal, acorn, jellyfish, clover
- 12 eye expressions: neutral, attentive, surprised, excited, happy, angry, sad, suspicious, curious, proud, shy, unimpressed
- 13 motion states, with one-shot clips returning to idle
- Pointer gaze (`followCursor`, default on) and `lookAt({ yaw, pitch })`
- Blink, idle liveliness, and click-to-poke (`poke()`)
- `exportPng(snapshot, size)` for static PNG
- Interactive playground on GitHub Pages
- Typecheck and build CI
- npm publish via GitHub OIDC (`publish.yml`)

### Notes

- Package is unscoped: `npm install blobmascot`
- Peer dependencies: `react`, `react-dom` >= 18

[Unreleased]: https://github.com/Naandalist/blobmascot/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Naandalist/blobmascot/releases/tag/v0.2.0
[0.1.1]: https://github.com/Naandalist/blobmascot/releases/tag/v0.1.1
