## 1. Wire sync in calculator-ui.ts

- [x] 1.1 Import `syncSharedInput` and `SHARED_KEYS` from `shared-state.ts` in `calculator-ui.ts`
- [x] 1.2 In the existing input listener loop, call `syncSharedInput(key, 'calc')` for each input whose id is in `SHARED_KEYS`

## 2. Verification

- [x] 2.1 Manually verify: edit price in Calculator → switch to Optimize → confirm opt-price matches
- [x] 2.2 Manually verify: edit opt-price in Optimize → switch to Calculator → confirm price still matches (existing behaviour not regressed)
- [x] 2.3 Run `npm run test` — confirm all existing tests pass
