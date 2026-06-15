// One-shot-ish store for the shared-element transition: a clicked project card
// records its thumbnail rect here, and the detail page reads it to grow the hero
// from that exact spot. Module singleton (survives the client-side route change).
//
// We gate by freshness instead of clearing on read so React StrictMode's double
// effect invocation still sees the data (both runs fall inside the freshness
// window); a stale entry (direct visit / refresh) is simply ignored.

const FRESHNESS_MS = 1200

let stored = null

export const setSharedThumb = (data) => {
  stored = { ...data, ts: Date.now() }
}

// Returns the stored thumb if it matches `slug` and is recent, else null.
export const consumeSharedThumb = (slug) => {
  if (stored && stored.slug === slug && Date.now() - stored.ts < FRESHNESS_MS) {
    return stored
  }
  return null
}
