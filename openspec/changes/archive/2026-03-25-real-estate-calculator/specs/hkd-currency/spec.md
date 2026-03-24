# HKD Currency Formatting

## ADDED Requirements

### Requirement: HKD Prefix Display
The system SHALL display all currency values with "HKD" prefix followed by a space.

### Requirement: Thousands Separator
The system SHALL format numbers with comma separators at thousands (e.g., 1234567 displays as "1,234,567").

### Requirement: No Decimal Places for Large Numbers
The system SHALL display whole numbers without decimal places for property prices and financial results in the main output.

### Requirement: Input Placeholder Text
All currency input fields SHALL show placeholder text indicating the expected format (e.g., "HKD 350,000").

#### Scenario: Format property price
- **WHEN** property price is 350000
- **THEN** display shows "HKD 350,000"

#### Scenario: Format NPV result
- **WHEN** NPV result is 47200
- **THEN** display shows "HKD 47,200"

#### Scenario: Format cash flow
- **WHEN** annual cash flow is 10645
- **THEN** display shows "HKD 10,645"
