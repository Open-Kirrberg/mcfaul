import { content } from '../data/content.js'

/** Tag des Jahres (1..366) — für den stabilen "Spruch des Tages". */
export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date - start) / 86400000)
}

/** Index des heutigen Spruchs (stabil pro Kalendertag). */
export function spruchIndexOfDay(date = new Date()) {
  const n = content.sayings.length
  return ((dayOfYear(date) % n) + n) % n
}

export function heutigesDatum(date = new Date()) {
  try {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return date.toLocaleDateString()
  }
}
