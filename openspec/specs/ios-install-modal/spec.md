# Capability: ios-install-modal

## Purpose

Defines the requirements for the iOS-specific install instructions modal that guides iOS Safari users through the manual Add to Home Screen flow.

## Requirements

### Requirement: iOS install instructions modal displayed on button click
On iOS Safari, clicking the install button SHALL open a modal with step-by-step instructions.

#### Scenario: Modal opens on iOS button click
- **WHEN** the user taps the install button on iOS Safari
- **THEN** a modal SHALL appear with instructions: "Tap the Share button, then tap 'Add to Home Screen'"

#### Scenario: Modal includes visual cue for Share button
- **WHEN** the iOS install modal is visible
- **THEN** it SHALL include a reference to the Share icon so users can identify it

#### Scenario: Modal dismissible
- **WHEN** the iOS install modal is open
- **THEN** the user SHALL be able to close it by tapping outside the modal or a close button

### Requirement: iOS install modal styled consistently
The modal SHALL use the app's existing dark theme CSS variables.

#### Scenario: Modal uses theme colors
- **WHEN** the iOS install modal is rendered
- **THEN** it SHALL use `--bg` and `--accent` CSS custom properties for its background and accent colors
