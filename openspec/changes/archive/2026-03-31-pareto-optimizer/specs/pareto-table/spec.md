## ADDED Requirements

### Requirement: Table displays Pareto results

The Pareto table SHALL display the following columns:
- Down% (down payment percentage)
- HP (holding period in years)
- MP (mortgage period in years)
- NPV (formatted as currency)
- IRR (formatted as percentage, or "—" if undefined)
- P/L (formatted as currency)
- Expand toggle (▼/▶ indicator)

#### Scenario: Table renders with all columns
- **WHEN** the Pareto solver returns results
- **THEN** the table SHALL display all 6 columns with correct values

### Requirement: Sortable columns

Clicking a column header SHALL sort the table by that column. Clicking again SHALL reverse the sort order. The current sort column SHALL be visually indicated (e.g., arrow icon).

#### Scenario: Sort by NPV descending
- **WHEN** user clicks "NPV" header
- **THEN** rows SHALL be sorted by NPV from highest to lowest

#### Scenario: Sort by IRR ascending
- **WHEN** user clicks "IRR" header twice
- **THEN** rows SHALL be sorted by IRR from lowest to highest

### Requirement: Row expansion shows cash flow details

Clicking a row (or the expand toggle) SHALL expand that row to show the annual cash flow breakdown.

The expanded view SHALL display:
- Year number
- Annual Rent
- Property Tax
- Mortgage Payment
- Net Cash Flow

Each row SHALL be color-coded: green text for positive net cash flow, red text for negative.

#### Scenario: Expand row
- **WHEN** user clicks a row
- **THEN** the row SHALL expand to show cash flow details for each year of the holding period

#### Scenario: Collapse row
- **WHEN** user clicks an expanded row
- **THEN** the row SHALL collapse back to summary view

### Requirement: Empty state

- **WHEN** the Pareto solver has not yet run
- **THEN** the table area SHALL display "Optimize tab to see Pareto-optimal solutions"

### Requirement: Loading state

- **WHEN** the Pareto solver is running
- **THEN** the table area SHALL display "Calculating optimal solutions..."

### Requirement: Negative values displayed in red

- **WHEN** NPV, IRR (if negative), or P/L is negative
- **THEN** the value SHALL be displayed in red color
