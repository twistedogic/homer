## 1. Tab Interface

- [x] 1.1 Add tab navigation HTML (Calculator | Optimize)
- [x] 1.2 Add CSS for tab styling (active state, hover)
- [x] 1.3 Add tab switching JavaScript logic
- [x] 1.4 Wrap existing Calculator content in tab panel
- [x] 1.5 Create empty Optimize panel placeholder
- [x] 1.6 Verify tab switching works and state persists

## 2. Input Linking

- [x] 2.1 Extract property inputs into shared state object
- [x] 2.2 Add event listeners to sync input changes between tabs
- [x] 2.3 Verify Calculator and Optimize inputs stay in sync
- [x] 2.4 Verify decision variables (DP%, HP, MP) remain independent per tab

## 3. Pareto Solver

- [x] 3.1 Create ParetoSolver class/module
- [x] 3.2 Implement grid enumeration (DP: 50-95% by 5%, HP: 1-50, MP: 5-30)
- [x] 3.3 Integrate NPV calculation from existing Calculator
- [x] 3.4 Implement IRR binary search with 50-iteration limit and 0.001 tolerance
- [x] 3.5 Implement P/L calculation
- [x] 3.6 Implement Pareto frontier extraction (dominance filter)
- [x] 3.7 Add "undefined IRR" handling (show "—")
- [x] 3.8 Performance test with 13,000 combinations (<500ms target)

## 4. Pareto Table UI

- [x] 4.1 Create table HTML structure with headers (Down%, HP, MP, NPV, IRR, P/L)
- [x] 4.2 Add table CSS (column widths, header styling, hover states)
- [x] 4.3 Implement column sorting (click header to sort, click again to reverse)
- [x] 4.4 Add visual indicator for current sort column
- [x] 4.5 Implement row expansion (click to show/hide cash flow details)
- [x] 4.6 Render annual cash flow breakdown in expanded row (Year, Rent, Tax, Mortgage, Net CF)
- [x] 4.7 Color positive cash flows green, negative red
- [x] 4.8 Add empty state message
- [x] 4.9 Add loading state message

## 7. Polish

- [x] 7.1 Add tooltip `title` attributes to HP and MP column headers

## 5. Integration

- [x] 5.1 Wire ParetoSolver to table rendering
- [x] 5.2 Auto-run solver when Optimize tab is selected
- [x] 5.3 Re-run solver when shared property inputs change
- [x] 5.4 Connect table row expansion to cash flow display
- [x] 5.5 Test full flow: Calculator → change inputs → Optimize tab → verify results update

## 6. Polish

- [x] 6.1 Currency formatting (HKD with no decimals for large numbers)
- [x] 6.2 Percentage formatting (IRR to 1 decimal place)
- [x] 6.3 Negative value styling (red text)
- [x] 6.4 Responsive table (horizontal scroll on mobile if needed)
- [x] 6.5 Verify service worker caches updated index.html
