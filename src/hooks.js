import { useEffect, useRef, useState } from 'react'

/** Sticky-Nav: true, sobald gescrollt wird. */
export function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

/** Bewusst träges Reveal-on-Scroll für alle .reveal-Elemente (einmalig). */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((e) => io.observe(e))
    // Sicherheitsnetz: nichts soll dauerhaft unsichtbar bleiben (z.B. nach
    // Anker-Sprung mitten in eine lange Sektion oder sehr schnellem Scrollen).
    const fallback = window.setTimeout(() => {
      els.forEach((e) => e.classList.add('in'))
    }, 2600)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
}

/** Liefert [ref, inView] — true sobald das Element sichtbar wird. */
export function useInView({ threshold = 0.25 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.unobserve(el)
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

/** Zählt (gemütlich) von 0 auf target hoch, sobald start=true. */
export function useCountUp(target, { duration = 2400, start = false } = {}) {
  const [val, setVal] = useState(0)
  const rafRef = useRef(0)
  useEffect(() => {
    if (!start) return
    let startTime
    const tick = (t) => {
      if (startTime === undefined) startTime = t
      const p = Math.min((t - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, start])
  return val
}
