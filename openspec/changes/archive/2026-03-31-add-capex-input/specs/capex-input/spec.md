## ADDED Requirements

### Requirement: CAPEX input accepted
The system SHALL accept a `capex` value in HKD per square foot per 10 years as a form input in the Property section of both the Calculator and Optimize tabs.

#### Scenario: Valid CAPEX entered
- **WHEN** the user enters a non-negative number in the CAPEX field
- **THEN** the field is considered valid and the Calculate button remains enabled (assuming all other fields are valid)

#### Scenario: Negative CAPEX rejected
- **WHEN** the user enters a negative number in the CAPEX field
- **THEN** the field is marked invalid and the Calculate button is disabled

#### Scenario: Zero CAPEX is valid
- **WHEN** the user enters 0 in the CAPEX field
- **THEN** the field is considered valid and cash flows are unchanged from the no-CAPEX baseline

### Requirement: Annual CAPEX deducted from cash flows
The system SHALL deduct an annual CAPEX cost of `capex × size / 10` (HKD/year) from each year's net cash flow across the full holding period.

#### Scenario: CAPEX reduces net cash flow each year
- **WHEN** `capex` is greater than 0
- **THEN** each year's net CF equals: Annual Rent − Property Tax − Mortgage − (capex × size / 10)

#### Scenario: CAPEX is flat (no compounding)
- **WHEN** the holding period spans multiple years
- **THEN** the annual CAPEX deduction is identical for every year (no inflation or appreciation applied)

#### Scenario: CAPEX cycle independent of holding period
- **WHEN** holding period is less than or greater than 10 years
- **THEN** the annual CAPEX deduction is still `capex × size / 10` regardless of hold length

### Requirement: CAPEX shown in cash flow table
The system SHALL display a CAPEX column in the annual cash flow table, between the Mortgage column and the Net CF column.

#### Scenario: CAPEX column rendered
- **WHEN** results are displayed after calculation
- **THEN** the cash flow table shows columns: Year | Annual Rent | Property Tax | Mortgage | CAPEX | Net CF

#### Scenario: CAPEX column value
- **WHEN** a row is rendered for any year
- **THEN** the CAPEX cell displays the formatted HKD value of `capex × size / 10`

### Requirement: CAPEX shared across tabs
The system SHALL synchronise the CAPEX input between the Calculator and Optimize tabs using the existing `data-shared` mechanism.

#### Scenario: CAPEX value propagates to Optimize tab
- **WHEN** the user sets a CAPEX value in the Calculator tab
- **THEN** the same value appears pre-filled in the Optimize tab's CAPEX field
