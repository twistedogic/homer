## ADDED Requirements

### Requirement: App icons provided in required sizes
The app SHALL provide PNG icon files at the repo root for both 192×192 and 512×512 sizes, with maskable variants for each.

#### Scenario: Standard icon files exist
- **WHEN** the repo root is listed
- **THEN** `icon-192.png` and `icon-512.png` SHALL be present

#### Scenario: Maskable icon files exist
- **WHEN** the repo root is listed
- **THEN** `icon-192-maskable.png` and `icon-512-maskable.png` SHALL be present

### Requirement: Icon design uses hex-grid motif
The icon SHALL use a hexagonal grid arrangement with the app accent color on a transparent background.

#### Scenario: Icon background is transparent
- **WHEN** the standard icon PNG is inspected
- **THEN** the background SHALL be transparent (alpha channel)

#### Scenario: Maskable icon has safe zone padding
- **WHEN** the maskable icon variant is rendered inside a circle mask
- **THEN** the hex-grid content SHALL remain fully visible within the inner 80% safe zone
