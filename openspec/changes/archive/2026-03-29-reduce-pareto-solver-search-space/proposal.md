## Why

The Pareto solver evaluates all combinations of down payment %, holding period, and mortgage period to find optimal investment strategies. The current ranges are excessively broad, causing unnecessary computation and presenting users with an overwhelming number of results. Narrowing the search space improves performance and produces more actionable, focused recommendations.

## What Changes

- Reduce Down Payment % range from 10 values (50–95%) to 5 values: `[30, 40, 50, 60, 70]`
- Reduce Holding Period range from 50 values (1–50 years) to 4 values: `[5, 10, 15, 20]`
- Reduce Mortgage Period range from 26 values (5–30 years) to 6 values: `[5, 10, 15, 20, 25, 30]`
- Total combinations reduced from **13,000** to **120** (99% reduction)

## Capabilities

### New Capabilities

None — this change modifies existing solver behavior without introducing new capabilities.

### Modified Capabilities

- `pareto-optimizer`: Narrow the solver's decision variable search space to more realistic investment scenarios.

## Impact

- **Code**: `index.html` — update `DP_VALUES`, `HP_VALUES`, `MP_VALUES` constants
- **Performance**: ~99% fewer combinations evaluated per solver run
- **User Experience**: Fewer, more focused Pareto-optimal results displayed in the Optimize tab

## Non-goals

- Changing the Pareto domination logic or objective functions (NPV, IRR, Profit/Loss)
- Modifying the form inputs or shared parameters
