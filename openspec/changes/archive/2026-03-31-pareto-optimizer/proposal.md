## Why

The current calculator computes NPV and IRR for a single, user-specified down payment. Users must manually guess-and-check different combinations of down payment, holding period, and mortgage period to find good investments. This change adds a Pareto optimization view that explores the full decision space and surfaces the tradeoffs between NPV, IRR, and total P/L.

## What Changes

- New **Optimize** tab alongside the existing Calculator tab
- Pareto-optimal table showing ~100 solutions across different (DP%, HP, MP) combinations
- **Decision variables:** Down payment (50–95%, 5% steps), holding period (1–50 years), mortgage period (5–30 years)
- **Objectives:** NPV, IRR, and total P/L — all shown as sortable columns
- Click any row to expand full cash flow breakdown
- Property inputs (price, rent, rates, etc.) shared between tabs; decision variables independent per tab
- LTV constraint: minimum 50% down payment (investment property)
- IRR non-convergence shown as "—"

## Capabilities

### New Capabilities

- `pareto-optimizer`: UI tab containing the Pareto table, tab switching, and input linking between tabs
- `pareto-solver`: Grid search engine that enumerates all decision combinations, computes objectives, and extracts Pareto frontier
- `pareto-table`: Sortable table component with row expansion for cash flow details

### Modified Capabilities

<!-- No existing specs have requirements changing — investment calculator was implemented directly in index.html without formal specs -->

## Impact

- `index.html`: New Optimize tab UI, shared form inputs, tab switching logic
- New JavaScript modules for Pareto solver and table rendering
- CSS for table styling (sortable headers, row hover, expandable rows)
- Service worker already caches app shell — no changes needed for offline support
