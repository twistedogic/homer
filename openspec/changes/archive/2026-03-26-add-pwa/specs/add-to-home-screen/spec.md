## ADDED Requirements

### Requirement: Add to Home Screen button shown on installable platforms
The header SHALL contain a `+ Add to Home Screen` button that is visible only on platforms where installation is possible and the app is not already installed.

#### Scenario: Button visible on Android Chrome before install
- **WHEN** the page loads in Android Chrome and `beforeinstallprompt` fires
- **THEN** the install button SHALL become visible in the header

#### Scenario: Button visible on iOS Safari
- **WHEN** the page loads in iOS Safari (detected via user agent) and the app is not running in standalone mode
- **THEN** the install button SHALL be visible in the header

#### Scenario: Button hidden on desktop browsers
- **WHEN** the page loads in a non-mobile browser
- **THEN** the install button SHALL not be visible

#### Scenario: Button hidden when already installed
- **WHEN** the app is running in standalone display mode (`display-mode: standalone` or `navigator.standalone`)
- **THEN** the install button SHALL not be visible

### Requirement: Android install prompt triggered on button click
On Android Chrome, clicking the install button SHALL trigger the native install dialog.

#### Scenario: Native prompt shown on click
- **WHEN** the user clicks the install button on Android Chrome
- **THEN** the deferred `beforeinstallprompt` event SHALL be called with `.prompt()`

#### Scenario: Button hidden after successful install
- **WHEN** the user accepts the install prompt (`userChoice` outcome is `"accepted"`)
- **THEN** the install button SHALL be hidden
