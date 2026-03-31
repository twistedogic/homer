## ADDED Requirements

### Requirement: Calculator inputs sync to Optimize in real time
When a user edits a shared input in the Calculator tab, the corresponding Optimize tab input SHALL update to the same value immediately (on every keystroke).

#### Scenario: Editing a shared input in Calculator updates Optimize
- **WHEN** a user changes a shared input (e.g. price) in the Calculator tab
- **THEN** the matching input in the Optimize tab SHALL reflect the new value without the user switching tabs

#### Scenario: Calculator-only inputs are not synced
- **WHEN** a user changes `mortgagePeriod`, `downPayment`, or `holdingPeriod` in the Calculator tab
- **THEN** no sync occurs because these fields do not exist in the Optimize form

#### Scenario: Switching to Optimize tab after editing Calculator runs the solver
- **WHEN** a user edits one or more shared inputs in the Calculator tab and then clicks the Optimize tab
- **THEN** the Optimize solver SHALL run using the updated values
