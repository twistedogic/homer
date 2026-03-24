## 1. Create index.html Skeleton

- [x] 1.1 Create HTML5 document structure with `<html>`, `<head>`, `<body>`
- [x] 1.2 Add `<meta charset="UTF-8">` and viewport meta tag for mobile
- [x] 1.3 Add `<title>` "Real Estate Investment Calculator"
- [x] 1.4 Create two-column layout container (inputs | results)
- [x] 1.5 Add responsive breakpoint at 768px for mobile stacking

## 2. Add CSS Styles

- [x] 2.1 Define CSS variables for colors (background, text, accent, error, disabled)
- [x] 2.2 Style body with system font stack and background color
- [x] 2.3 Style input fields: border, border-radius, padding, font-size
- [x] 2.4 Style invalid input state: red border and light red background
- [x] 2.5 Style error message text: red, small font-size, margin-top
- [x] 2.6 Style Calculate button: dark background, white text, padding, border-radius
- [x] 2.7 Style disabled button state: gray background, not-allowed cursor
- [x] 2.8 Style results panel: white background, border, padding, border-radius
- [x] 2.9 Style IRR/NPV metric display: large font, tabular-nums variant
- [x] 2.10 Style cash flow table: full width, collapsed borders, right-aligned numbers
- [x] 2.11 Style table header: uppercase, smaller font, gray color
- [x] 2.12 Add footer disclaimer text with hardcoded assumptions

## 3. Build Input Form

- [x] 3.1 Add fieldset/group "PROPERTY" with price, size, rent/sqft inputs
- [x] 3.2 Add fieldset/group "MORTGAGE" with rate, period, down payment inputs
- [x] 3.3 Add fieldset/group "INVESTMENT" with holding period, months w/ renters, appreciation rate, rent appreciation rate inputs
- [x] 3.4 Add fieldset/group "DISCOUNT RATE" with discount rate and property tax rate inputs
- [x] 3.5 Set Property Tax Rate default value to 15
- [x] 3.6 Add Calculate button (disabled by default)
- [x] 3.7 Add placeholder text to each input field

## 4. Implement JavaScript Calculation Engine

- [x] 4.1 Create `formatCurrency(number)` function returning "HKD X,XXX,XXX" format
- [x] 4.2 Create `formatPercent(decimal)` function returning "X.X%" format
- [x] 4.3 Create `parseNumber(string)` function handling HKD formatting and commas
- [x] 4.4 Create `validateInputs()` function returning validation state for all 12 fields
- [x] 4.5 Create `calculateMortgagePayment(principal, annualRate, years)` returning monthly payment
- [x] 4.6 Create `calculateRemainingBalance(principal, annualRate, years, monthsElapsed)` returning balance
- [x] 4.7 Create `calculateCashFlows(inputs)` returning array of yearly cash flows
- [x] 4.8 Create `calculatePropertyTax(grossRent, taxRate)` returning annual tax
- [x] 4.9 Create `calculateTerminalValue(inputs, year)` returning sale proceeds minus costs and remaining mortgage
- [x] 4.10 Create `calculateNPV(cashFlows, discountRate, initialInvestment, tv)` returning NPV
- [x] 4.11 Create `calculateIRR(cashFlows, initialInvestment)` using binary search (0 to 2.0, 100 iterations, 0.001 tolerance)

## 5. Wire Up UI Interactions

- [x] 5.1 Add input event listeners to all 12 fields triggering validation
- [x] 5.2 Enable/disable Calculate button based on validation state
- [x] 5.3 Add red border and error message to invalid fields on blur
- [x] 5.4 Remove error styling when field becomes valid
- [x] 5.5 Add click handler to Calculate button executing full calculation
- [x] 5.6 Display IRR result in results panel with formatPercent()
- [x] 5.7 Display NPV result in results panel with formatCurrency()
- [x] 5.8 Generate and display year-by-year table with all columns
- [x] 5.9 Clear previous results when new calculation runs

## 6. Test Calculations with Known Example

- [x] 6.1 Verify mortgage payment: price=350000, rate=7%, period=30, down=20% → M ≈ 1,862.93
- [x] 6.2 Verify year 1 cash flow: size=2000, rent=1.50, months=11, tax=15% → CF ≈ 6,685
- [x] 6.3 Verify terminal value at year 10 with appreciation=3%
- [x] 6.4 Verify IRR converges for typical investment scenario
- [x] 6.5 Verify NPV calculation matches manual computation

## 7. Create README and Deploy

- [x] 7.1 Create README.md with brief description and GitHub Pages deployment instructions
- [x] 7.2 Add `_config.yml` for GitHub Pages (if using Jekyll)
- [x] 7.3 Commit all files and verify structure
