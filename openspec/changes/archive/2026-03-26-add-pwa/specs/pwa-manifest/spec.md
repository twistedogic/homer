## ADDED Requirements

### Requirement: App manifest file exists
The app SHALL provide a `manifest.json` file at the repo root with valid PWA metadata.

#### Scenario: Manifest is linked from index.html
- **WHEN** a browser loads `index.html`
- **THEN** a `<link rel="manifest" href="/manifest.json">` tag SHALL be present in the `<head>`

#### Scenario: Manifest contains required identity fields
- **WHEN** `manifest.json` is parsed
- **THEN** it SHALL contain `name: "Homer"`, `short_name: "Homer"`, `display: "standalone"`, `start_url`, `background_color: "#1a1a2e"`, and `theme_color: "#1a1a2e"`

#### Scenario: Manifest references icons
- **WHEN** `manifest.json` is parsed
- **THEN** it SHALL reference at least a 192×192 icon and a 512×512 icon, each with a valid `src` path and `type: "image/png"`

#### Scenario: Manifest includes maskable icons
- **WHEN** `manifest.json` is parsed
- **THEN** it SHALL include maskable variants for both 192×192 and 512×512 sizes with `purpose: "maskable"`

### Requirement: Theme color meta tag present
The app SHALL include a `<meta name="theme-color">` tag so the browser chrome matches the app theme.

#### Scenario: Theme color meta in head
- **WHEN** `index.html` is loaded
- **THEN** `<meta name="theme-color" content="#1a1a2e">` SHALL be present in `<head>`
