# Capability: header

## Purpose

Defines the requirements for the app header, including the app title and the install button slot.

## Requirements

### Requirement: App renamed to Homer in header
The header `<h1>` SHALL display "Homer" instead of the previous title.

#### Scenario: Header title is Homer
- **WHEN** `index.html` is loaded
- **THEN** the `<h1>` in the header SHALL contain the text "Homer"

### Requirement: Currency label removed from header
The static `HKD` currency label SHALL be removed from the header.

#### Scenario: No currency label in header
- **WHEN** `index.html` is loaded
- **THEN** there SHALL be no `currency-label` element or visible currency text in the header
