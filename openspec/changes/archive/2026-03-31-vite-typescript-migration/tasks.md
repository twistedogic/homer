## 1. Project Scaffolding

- [x] 1.1 Create `package.json` with Vite, TypeScript, and Vitest dependencies
- [x] 1.2 Create `vite.config.ts` with `base: '/homer/'` and Vitest config
- [x] 1.3 Create `tsconfig.json` with `strict: false` and `skipLibCheck: true`
- [x] 1.4 Run `npm install` and verify no errors
- [x] 1.5 Create `src/` and `src/styles/` directories

## 2. Extract CSS

- [x] 2.1 Create `src/styles/base.css` — reset, variables, typography, layout
- [x] 2.2 Create `src/styles/tabs.css` — tab nav styling
- [x] 2.3 Create `src/styles/calculator.css` — calculator form and results
- [x] 2.4 Create `src/styles/pareto-table.css` — table, sort indicators, row expansion
- [x] 2.5 Create `src/styles/pwa.css` — install button and iOS modal

## 3. Extract TypeScript Modules

- [x] 3.1 Create `src/formatting.ts` — `formatCurrency`, `formatPercent`, `parseNumber`
- [x] 3.2 Create `src/calculator.ts` — mortgage, NPV, IRR, P/L, terminal value functions
- [x] 3.3 Create `src/pareto-solver.ts` — `evaluateCombination`, `extractParetoFrontier`, `runParetoSolver`
- [x] 3.4 Create `src/shared-state.ts` — shared input state and sync logic
- [x] 3.5 Create `src/tabs.ts` — tab switching logic
- [x] 3.6 Create `src/pareto-table.ts` — table render, sort, row expansion
- [x] 3.7 Create `src/pwa.ts` — service worker registration and install prompt
- [x] 3.8 Create `src/main.ts` — entry point that imports CSS and initialises all modules

## 4. Update index.html

- [x] 4.1 Remove all `<style>` blocks from `index.html`
- [x] 4.2 Remove all `<script>` blocks from `index.html`
- [x] 4.3 Add `<script type="module" src="/src/main.ts">` before `</body>`
- [x] 4.4 Run `npm run dev` and verify the app is functionally identical to original

## 5. Update Service Worker

- [x] 5.1 Simplify `sw.js` PRECACHE to `['/homer/', '/homer/index.html']` only
- [x] 5.2 Verify stale-while-revalidate fetch handler is intact

## 6. Unit Tests

- [x] 6.1 Create `src/__tests__/formatting.test.ts` — test `formatCurrency`, `formatPercent`, `parseNumber`
- [x] 6.2 Create `src/__tests__/calculator.test.ts` — test `calculateMortgagePayment`, `calculateRemainingBalance`, `calculateNPV`, `calculateIRR`
- [x] 6.3 Create `src/__tests__/pareto-solver.test.ts` — test `evaluateCombination`, `extractParetoFrontier`
- [x] 6.4 Run `npm run test` and verify all tests pass

## 7. GitHub Actions Workflow

- [x] 7.1 Add Node.js setup step (`actions/setup-node@v4`, Node 20) to deploy workflow
- [x] 7.2 Add `npm ci` step
- [x] 7.3 Add `npm run build` step
- [x] 7.4 Change upload artifact `path:` from `.` to `./dist`
- [ ] 7.5 Push to `main` and verify GitHub Actions build succeeds and site deploys correctly
