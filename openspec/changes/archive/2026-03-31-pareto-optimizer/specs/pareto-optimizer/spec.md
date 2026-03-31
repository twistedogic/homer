## ADDED Requirements

### Requirement: Optimize tab exists alongside Calculator tab

The application SHALL display a tabbed interface with two tabs: "Calculator" and "Optimize". The active tab SHALL be visually indicated (e.g., underline or background color).

#### Scenario: Tab switching
- **WHEN** user clicks the "Optimize" tab
- **THEN** the Optimize panel SHALL be displayed and the Calculator panel SHALL be hidden

#### Scenario: Tab state persistence
- **WHEN** user switches from Optimize to Calculator and back
- **THEN** the Optimize table SHALL remain populated with its previous results

### Requirement: Property inputs are shared between tabs

The property-related inputs (price, size, rent per sqft, management fee, mortgage rate, appreciation rate, rent appreciation rate, discount rate, property tax rate) SHALL be shared between Calculator and Optimize tabs. Changing an input in one tab SHALL reflect in the other tab immediately.

#### Scenario: Input sync on Calculator change
- **WHEN** user changes "Price" in the Calculator tab to "4.0"
- **THEN** the "Price" field in the Optimize tab SHALL display "4.0"

#### Scenario: Input sync on Optimize change
- **WHEN** user changes "Rent/sqft" in the Optimize tab to "45"
- **THEN** the "Rent/sqft" field in the Calculator tab SHALL display "45"

### Requirement: Optimize tab auto-populates on tab selection

- **WHEN** user navigates to the Optimize tab
- **THEN** the Pareto solver SHALL run automatically and populate the table within 500ms

### Requirement: Optimize tab shows Pareto results

- **WHEN** the Pareto solver completes
- **THEN** the table SHALL display all Pareto-optimal solutions sorted by NPV descending
