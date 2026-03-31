# Capability: build-tooling

## Purpose

Defines the requirements for the build tooling that transpiles TypeScript, bundles CSS and JS, and produces a deployable static artifact for GitHub Pages.

## Requirements

### Requirement: Project has a build step
The project SHALL use Vite to transpile TypeScript and bundle CSS and JS into a deployable `dist/` directory.

#### Scenario: Build produces deployable output
- **WHEN** `npm run build` is executed
- **THEN** a `dist/` directory SHALL be produced containing `index.html`, hashed JS bundle, and hashed CSS bundle

#### Scenario: Dev server runs locally
- **WHEN** `npm run dev` is executed
- **THEN** a local development server SHALL serve the app with hot module replacement

### Requirement: TypeScript source modules
All application logic SHALL be written in TypeScript under `src/` with the following module structure: `main.ts`, `tabs.ts`, `shared-state.ts`, `formatting.ts`, `calculator.ts`, `pareto-solver.ts`, `pareto-table.ts`, `pwa.ts`.

#### Scenario: TypeScript compiles without errors
- **WHEN** `npm run build` is executed
- **THEN** TypeScript compilation SHALL succeed with no type errors

### Requirement: CSS extracted into source files
All styles SHALL be written in plain CSS files under `src/styles/` and imported via TypeScript modules.

#### Scenario: CSS is bundled and injected into output HTML
- **WHEN** `npm run build` is executed
- **THEN** styles SHALL be extracted into a hashed `.css` file and referenced in `dist/index.html`

### Requirement: Unit tests can be run
The project SHALL support unit testing via Vitest targeting pure-logic modules.

#### Scenario: Tests pass
- **WHEN** `npm run test` is executed
- **THEN** all tests SHALL pass

#### Scenario: Pure logic modules are covered
- **WHEN** tests are run
- **THEN** `formatting.ts`, `calculator.ts`, and `pareto-solver.ts` SHALL each have at least one test file with passing tests

### Requirement: Base path matches GitHub Pages deployment
Vite SHALL be configured with `base: '/homer/'` so all generated asset paths resolve correctly under the GitHub Pages URL.

#### Scenario: Assets resolve on GitHub Pages
- **WHEN** the built `dist/index.html` is served from `https://<user>.github.io/homer/`
- **THEN** all JS and CSS assets SHALL load without 404 errors
