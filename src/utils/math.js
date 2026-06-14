/**
 * Clamp a value between min and max (default 0-1)
 */
export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

/**
 * Linear interpolation between a and b by t
 */
export const lerp = (a, b, t) => a + (b - a) * t

/**
 * Map a value from one range to another, clamped
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const t = clamp((value - inMin) / (inMax - inMin))
  return lerp(outMin, outMax, t)
}
