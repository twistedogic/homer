## Why

The financial calculator currently only runs in the browser. LLM agents and other CLI tools need programmatic access to IRR, NPV, and Total P/L calculations. Creating a portable `bunx` CLI that reuses the existing calculator logic provides a fast, dependency-free way for agents to call these calculations.

## What Changes

- New `packages/cli/` package with a `bunx`-runnable CLI
- 14 command-line flags matching the `CalcValues` input model (kebab-case)
- Markdown table output (default) and JSON output (with `--json` flag)
- Cash flow table included in output alongside IRR, NPV, and Total P/L
- Reuses `src/calculator.ts` functions directly (no duplication)
- Uses `commander` for flag parsing

## Non-goals

- No subcommands — single `homer-cli` entry point
- No config file support — flags only
- Not replacing the web calculator — complementary tool
- No changes to existing calculator logic or defaults

## Capabilities

### New Capabilities

- `finance-cli`: Standalone CLI for IRR/NPV/Total P/L calculations with markdown and JSON output modes, mirroring the web calculator's input model and defaults

## Impact

- New directory: `packages/cli/`
- New dependency: `commander` (added to `packages/cli/package.json`)
- No changes to `src/` or existing source files
- Calculator functions in `src/calculator.ts` imported by CLI package
