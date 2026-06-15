// Projects list view modes. The active view is independent of the category
// filter: it only changes how the already-filtered list is laid out.
//   large — one full-width cinematic case per row (default)
//   list  — compact rows (index, title, client, category, tags)
//   grid  — two equal columns

export const VIEWS = {
  LARGE: 'large',
  LIST: 'list',
  GRID: 'grid',
}

export const DEFAULT_VIEW = VIEWS.LARGE

// Order + a11y copy for the VIEW switcher buttons.
export const VIEW_OPTIONS = [
  { id: VIEWS.LARGE, label: 'Grande', aria: 'Ver proyectos en vista grande (una columna)' },
  { id: VIEWS.LIST, label: 'Lista', aria: 'Ver proyectos en vista de lista compacta' },
  { id: VIEWS.GRID, label: 'Cuadrícula', aria: 'Ver proyectos en cuadrícula de dos columnas' },
]

const VALID_VIEWS = new Set(Object.values(VIEWS))

export const isValidView = (value) => VALID_VIEWS.has(value)

const STORAGE_KEY = 'm4-projects-view'

const canUseStorage = () =>
  typeof window !== 'undefined' && !!window.localStorage

export const readStoredView = () => {
  if (!canUseStorage()) return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isValidView(stored) ? stored : null
  } catch {
    return null
  }
}

export const storeView = (value) => {
  if (!canUseStorage() || !isValidView(value)) return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* ignore quota / privacy-mode write errors */
  }
}

// Safe read of a single URL query param (client-only).
export const readUrlParam = (name) => {
  if (typeof window === 'undefined') return null
  try {
    return new URLSearchParams(window.location.search).get(name)
  } catch {
    return null
  }
}

// Initial view resolution: URL (?view=) → persisted preference → default.
export const getInitialView = () => {
  const urlView = readUrlParam('view')
  if (isValidView(urlView)) return urlView
  return readStoredView() ?? DEFAULT_VIEW
}
