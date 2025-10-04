# Vitest Testing Setup

This project is configured with [Vitest](https://vitest.dev/) for unit testing.

## Installation

All dependencies are already installed. The testing setup includes:

- **vitest**: Fast unit test framework
- **@vitejs/plugin-react**: React support for Vitest
- **@testing-library/react**: Testing utilities for React
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM implementation for Node.js

## Running Tests

### Watch Mode (Interactive)
```bash
npm test
```
Runs tests in watch mode. Tests re-run when files change.

### Run Once
```bash
npm run test:run
```
Runs all tests once and exits. Useful for CI/CD.

### Coverage Report
```bash
npm run test:coverage
```
Generates a code coverage report in the `coverage/` directory.

## File Structure

```
src/
├── __tests__/           # Test files
│   └── example.test.tsx
├── components/
│   └── Component.test.tsx  # Co-located component tests
└── hooks/
    └── useHook.test.ts     # Co-located hook tests
```

## Configuration

### vitest.config.ts

The main configuration file includes:
- React plugin for JSX/TSX support
- jsdom environment for DOM testing
- Path alias (`@/` → `src/`)
- Global test utilities
- Coverage configuration

### vitest.setup.ts

Setup file that runs before all tests:
- Imports jest-dom matchers
- Configures automatic cleanup after each test
- Mocks Next.js navigation hooks
- Sets up global fetch mock

