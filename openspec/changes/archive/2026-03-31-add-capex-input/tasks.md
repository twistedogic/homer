## 1. Calculator Engine

- [x] 1.1 Add `capex` field to `CalcValues` interface in `src/calculator.ts`
- [x] 1.2 Deduct `capex × size / 10` from net cash flow in the `calculate()` loop
- [x] 1.3 Update unit tests in `src/__tests__/` to pass `capex` and assert correct cash flow reduction

## 2. Calculator UI — Form

- [x] 2.1 Add CAPEX input field (`id="capex"`, `data-shared="capex"`) to Property fieldset in `index.html` (Calculator tab)
- [x] 2.2 Add CAPEX input field (`id="opt-capex"`, `data-shared="capex"`) to Property fieldset in `index.html` (Optimize tab)
- [x] 2.3 Wire `capex` input into `calcInputs` map and `validateInputsCalc()` in `src/calculator-ui.ts`
- [x] 2.4 Add validation rule: `capex >= 0`

## 3. Calculator UI — Results Table

- [x] 3.1 Add CAPEX column header to cash flow table in `displayResults()` in `src/calculator-ui.ts`
- [x] 3.2 Render `capex × size / 10` as a formatted HKD cell per row, between Mortgage and Net CF columns

## 4. Optimize Tab

- [x] 4.1 Confirm `capex` value flows through `data-shared` sync into the pareto solver inputs (verify `shared-state.ts` wiring)
- [x] 4.2 Ensure pareto solver passes `capex` through to `calculate()` calls — update pareto-solver input construction if needed

## 5. Verification

- [x] 5.1 Run `npm run test` — all tests pass
- [ ] 5.2 Manual check: enter CAPEX = 0 and verify results match pre-change baseline
- [ ] 5.3 Manual check: enter CAPEX > 0 and verify CAPEX column appears and Net CF is reduced correctly
