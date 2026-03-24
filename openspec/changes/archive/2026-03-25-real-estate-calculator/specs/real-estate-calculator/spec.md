# Real Estate Calculator

## ADDED Requirements

### Requirement: Mortgage Payment Calculation
The system SHALL calculate the monthly mortgage payment using the standard amortization formula with inputs: principal (after down payment, both in millions HKD converted to actual HKD), annual interest rate, and loan term in years.

### Requirement: Year-by-Year Cash Flow Projection
The system SHALL project cash flow for each year from 1 to the holding period, where annual cash flow = annual rental income minus annual mortgage payments minus property tax.

### Requirement: Rental Income with Vacancy Adjustment
The system SHALL calculate annual rental income as: `size × (rent_per_sqft - management_fee) × months_with_renters × (1 + rent_appreciation_rate)^(year-1)`, where management fee is deducted from rent per sqft before applying appreciation.

### Requirement: Property Tax Calculation
The system SHALL calculate annual property tax as: `annual_rental_income × 0.80 × (property_tax_rate / 100)`, applying the 20% statutory repairs allowance before applying the tax rate.

### Requirement: Terminal Value at Sale
The system SHALL calculate terminal value at the end of the holding period as: `property_sale_price - remaining_mortgage_balance - selling_costs`, where property sale price appreciates at the appreciation rate, selling costs are 7% of sale price, and remaining balance is calculated based on months elapsed.

### Requirement: Internal Rate of Return Calculation
The system SHALL compute IRR using binary search with bounds [0, 2.0], maximum 100 iterations, and tolerance of 0.001. IRR is the discount rate at which NPV equals zero.

### Requirement: Net Present Value Calculation
The system SHALL calculate NPV as: `-initial_down_payment + Σ(cash_flow_t / (1 + discount_rate)^t) + terminal_value / (1 + discount_rate)^holding_period`, where t ranges from 1 to holding period.

### Requirement: Input Validation
The system SHALL validate all 12 inputs before enabling the Calculate button. The following validation rules SHALL apply:

- Price: MUST be > 0 (in millions HKD)
- Size: MUST be > 0
- Rent/sqft: MUST be > 0
- Mortgage Rate: MUST be > 0 and <= 30
- Mortgage Period: MUST be > 0 and <= 50
- Down Payment: MUST be > 0 and < 100
- Holding Period: MUST be > 0 and <= mortgage period
- Months w/ Renters: MUST be >= 0 and <= 12
- Property Appreciation Rate: MUST be >= 0 and <= 20
- Rent Appreciation Rate: MUST be >= 0 and <= 20
- Discount Rate: MUST be > 0 and <= 30
- Property Tax Rate: MUST be > 0 and <= 30

### Requirement: Year-by-Year Cash Flow Table Display
The system SHALL display a table with columns: Year, Annual Rent, Property Tax, Mortgage Payment, Net Cash Flow. Each row represents one year of the holding period.

### Requirement: Results Display
The system SHALL display four results after calculation: IRR as a percentage (e.g., "12.4%"), NPV as HKD currency (e.g., "HKD 47,200"), Property Value at end of holding period, Total Profit/Loss as HKD currency (sum of all net cash flows plus terminal value minus initial down payment), and the year-by-year cash flow table.

#### Scenario: Calculate with valid inputs
- **WHEN** all 12 inputs are valid and Calculate button is clicked
- **THEN** system displays IRR, NPV, and full year-by-year cash flow table

#### Scenario: Disable button with invalid input
- **WHEN** any input field contains an invalid value
- **THEN** Calculate button remains disabled and invalid fields show red border with error message

#### Scenario: Holding period equals mortgage period
- **WHEN** holding period equals mortgage period (e.g., both 30 years)
- **THEN** remaining mortgage balance at sale is zero

#### Scenario: Holding period less than mortgage period
- **WHEN** holding period is less than mortgage period (e.g., holding = 10, mortgage = 30)
- **THEN** terminal value calculation includes significant remaining mortgage balance
