import { readable } from 'svelte/store'

/** Current route path, e.g. '/pumbility'. Driven by the URL hash (`#/pumbility`). */
export const route = readable(getRoute(), (set) => {
  const onHashChange = () => set(getRoute())
  window.addEventListener('hashchange', onHashChange)
  return () => window.removeEventListener('hashchange', onHashChange)
})

function getRoute(): string {
  const hash = window.location.hash.slice(1)
  return hash || '/'
}
