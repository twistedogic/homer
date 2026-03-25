# Capability: service-worker

## Purpose

Defines the requirements for the service worker that enables offline caching and app installability using a stale-while-revalidate strategy.

## Requirements

### Requirement: Service worker registered
The app SHALL register a service worker (`sw.js`) from `index.html` to enable caching and installability.

#### Scenario: Registration on supported browsers
- **WHEN** `index.html` loads in a browser that supports service workers
- **THEN** `navigator.serviceWorker.register('/sw.js')` SHALL be called

#### Scenario: Graceful degradation on unsupported browsers
- **WHEN** `index.html` loads in a browser without service worker support
- **THEN** the app SHALL function normally without any errors thrown

### Requirement: Service worker caches app shell with stale-while-revalidate
The service worker SHALL use a stale-while-revalidate strategy so the app loads instantly from cache while updating in the background.

#### Scenario: Cache populated on install
- **WHEN** the service worker installs for the first time
- **THEN** it SHALL pre-cache `index.html` and open a named cache

#### Scenario: Cached response returned immediately on fetch
- **WHEN** a network request is made for a cached resource
- **THEN** the service worker SHALL return the cached response immediately

#### Scenario: Cache updated in background after serving stale
- **WHEN** the service worker serves a cached response
- **THEN** it SHALL also fetch the resource from the network and update the cache entry

#### Scenario: Network response used on cache miss
- **WHEN** a resource is not in the cache
- **THEN** the service worker SHALL fetch from the network and cache the response before returning it
