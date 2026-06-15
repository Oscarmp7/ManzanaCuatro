import { useEffect, useState } from 'react'

// Returns `value` after it has stayed unchanged for `delay` ms. Used to keep
// the live search from re-filtering on every keystroke.
export default function useDebouncedValue(value, delay = 150) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
