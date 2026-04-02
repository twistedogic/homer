## Context

The `homer-cli` package exists in `packages/cli/` with:
- `package.json` with `"bin": { "homer-cli": "./bin/homer-cli.js" }`
- `bin/homer-cli.js` with shebang `#!/usr/bin/env bun`
- Entry point imports from `../../../src/calculator` (relative to packages/cli/src/)

`npx` (and npm) only resolve `bin` entries from the **root** `package.json`. Sub-package bins are not exposed when installing from git URL.

## Goals / Non-Goals

**Goals:**
- Enable `npx git+https://github.com/twistedogic/homer` to run homer-cli

**Non-Goals:**
- Publishing to npm registry (git URL only)
- Changing CLI implementation
- Supporting non-Bun runtimes

## Decisions

### Bin entry in root package.json

**Decision**: Add `"bin": { "homer-cli": "./packages/cli/bin/homer-cli.js" }` to root `package.json`

**Rationale**: npx looks for bin entries in the package it's cloning. Without this, the CLI is invisible to npx from the git URL.

**Alternatives considered**:
- Publishing to npm registry: Would solve this, but adds release overhead
- Moving CLI to root: Works but disrupts existing structure

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| User lacks Bun installed | Document Bun as prerequisite in README |
| Relative path breaks | `packages/cli/` must remain at same location relative to root |
| npm ignores non-workspace bins | Works for npx from git - registry publish would need different setup |