## Why

The `homer-cli` package lives in `packages/cli/` but `npx` only looks for `bin` entries in the **root** `package.json`. To enable running via `npx git+https://github.com/twistedogic/homer`, the root must expose the CLI bin entry.

## What Changes

- Add `bin` field to root `package.json` pointing to `packages/cli/bin/homer-cli.js`
- Mark root package as `"private": true` (already set)

## Capabilities

### New Capabilities
- `n/a` - Configuration-only change, no new capabilities

### Modified Capabilities
- `n/a` - No spec-level behavior changes

## Impact

- `package.json` (root): Add `bin` field
- Users can run: `npx git+https://github.com/twistedogic/homer` (requires Bun installed)