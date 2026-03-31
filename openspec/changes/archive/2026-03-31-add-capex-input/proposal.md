## Why

The current financial model omits capital expenditure — the recurring cost of maintaining a property over its useful life. Without CAPEX, projected cash flows are overstated and IRR/NPV figures give an unrealistically optimistic picture of a property's earning potential.

## What Changes

- Add a `capex` input field (HKD/sqft/10yr) to the Calculator form
- Add `capex` to the `CalcValues` interface
- Deduct annual CAPEX (`capex × size / 10`) from each year's net cash flow in the calculator engine
- Add a CAPEX column to the cash flow table in results
- Propagate `capex` through the Optimize tab as a shared input

## Capabilities

### New Capabilities

- `capex-input`: Per-sqft CAPEX input representing a full refurbishment cycle cost (HKD/sqft/10yr), deducted annually from cash flows across the holding period

### Modified Capabilities

- none

## Non-goals

- CAPEX appreciation rate (inflation-linked growth of maintenance costs)
- One-off mid-hold CAPEX events (e.g. a specific year renovation)
- CAPEX impact on terminal value or appreciation rate

## Impact

- `src/calculator.ts`: `CalcValues` interface, `calculate()` function
- `src/calculator-ui.ts`: form input wiring, cash flow table rendering
- `index.html`: new input field in Property section (Calculator and Optimize tabs)
- `src/__tests__/`: unit tests for `calculate()` need updating
