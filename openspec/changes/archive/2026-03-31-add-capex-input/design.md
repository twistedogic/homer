## Context

Homer models rental property investment returns via NPV and IRR. Cash flows are computed annually over a holding period. The current model captures rent revenue, property tax, and mortgage payments — but omits capital expenditure. CAPEX is the real annual cost of maintaining a property's condition and is material to accurate return estimates.

The existing per-sqft pattern (`rentSqft`, `managementFee`) makes CAPEX a natural fit: `HKD/sqft/10yr` normalises the cost to a full refurbishment cycle, which is how practitioners reason about it.

## Goals / Non-Goals

**Goals:**
- Add `capex` (HKD/sqft/10yr) as an input to `CalcValues`
- Deduct `capex × size / 10` annually from each year's net cash flow
- Surface CAPEX as its own column in the cash flow table
- Share the input across Calculator and Optimize tabs via existing `data-shared` mechanism

**Non-Goals:**
- CAPEX appreciation or inflation adjustment
- Per-year or event-driven CAPEX modelling
- CAPEX impact on terminal value

## Decisions

### Annual CAPEX formula: `capex × size / 10` (flat)

The 10-year denominator is fixed — it represents the refurbishment cycle, not the holding period. A 5-year hold still incurs half a cycle's worth of cost per year; a 15-year hold incurs 1.5 cycles. This is consistent with the maintenance cost logic.

Alternatives considered:
- **% of property value** — common heuristic (1-2%/yr) but arbitrary across price points; HKD/sqft is more grounded
- **CAPEX with appreciation rate** — adds a new input for minimal accuracy gain at this stage; deferred to future

### No terminal value adjustment

The appreciation rate assumes a maintained property. CAPEX is the cost of earning that appreciation. Adjusting terminal value would require modelling how under/over-spending on CAPEX affects sale price — too speculative.

### Placement in form: Property section, after Management Fee

Both `managementFee` and `capex` are per-sqft operational costs. Grouping them together is natural. Matches the existing input structure.

### Cash flow table: add CAPEX column

The table already shows Rent, Tax, Mortgage, Net CF. Adding CAPEX makes the cost breakdown transparent and traceable. Column order: Rent → Tax → Mortgage → CAPEX → Net CF.

## Risks / Trade-offs

- **Existing saved/shared state**: Users who have set values via `data-shared` won't have `capex` pre-filled — it will default to empty/0, which is backward compatible (no CAPEX = old behaviour)
- **Table width on mobile**: Adding a 5th data column may squeeze the cash flow table on small screens → acceptable given existing horizontal scroll on `.cashflow-table-container`

## Migration Plan

No data migration needed — purely additive. Default value of `0` preserves existing behaviour for any session that doesn't fill in CAPEX.
