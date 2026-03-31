## MODIFIED Requirements

### Requirement: Service worker caches app shell with stale-while-revalidate
The service worker SHALL use a stale-while-revalidate strategy so the app loads instantly from cache while updating in the background. The PRECACHE list SHALL contain only `index.html` — hashed JS and CSS bundles are handled by HTTP cache headers, not precached by the service worker.

#### Scenario: Cache populated on install
- **WHEN** the service worker installs for the first time
- **THEN** it SHALL pre-cache `/homer/` and `/homer/index.html` and open a named cache

#### Scenario: Cached response returned immediately on fetch
- **WHEN** a network request is made for a cached resource
- **THEN** the service worker SHALL return the cached response immediately

#### Scenario: Cache updated in background after serving stale
- **WHEN** the service worker serves a cached response
- **THEN** it SHALL also fetch the resource from the network and update the cache entry

#### Scenario: Network response used on cache miss
- **WHEN** a resource is not in the cache
- **THEN** the service worker SHALL fetch from the network and cache the response before returning it
