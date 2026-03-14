# Changelog

## Unreleased

- CI/CD
  - Added GitHub Actions workflow for CI: lint, build, and tests on push/PR to main.
  - Added npm scripts to run lint/build/test in CI and locally.

- Testing
  - Introduced Jest setup (jest.config.js) with ts-jest integration for TypeScript tests.
  - Added unit tests for OG image utilities: scoreToColor, verdictForScore, roastToOg.
  - Added integration test for getRoastById (DB access) with mocked DB layer.

- Code quality
  - TS config updated to include jest typings in CI environments.
  - Added helper utilities for OG image data (src/utils/ogImage.ts).

- OG Image / Takumi
  - Implemented OG image route (/result/[id]/image) generation with Takumi, using ImageResponse.
  - Added utility layer to map roast data to OG image payload.

- Project structure and docs
  - README.md expanded with API usage, architecture and deployment notes.

## Added

- src/utils/ogImage.ts: helper functions for OG image payload composition.
- Jest test suite and config: jest.config.js, __tests__ paths.
- CI workflow: .github/workflows/ci.yml.
- Tests for DB roast retrieval: src/__tests__/roastById.test.ts.
- Tests for OG image payloads: src/__tests__/ogImage.test.ts.
- Test scaffolding: test-input.ts (existing).

## Changed

- package.json: CI scripts, test script, and dependencies for Jest/ts-jest.
- tsconfig.json: include jest typings and TS adjustments for tests.
- README.md: expanded sections for APIs, CI/CD and deployment guidance.

## Deprecated

- No deprecations at this moment.
