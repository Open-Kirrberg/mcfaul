import { useMemo } from 'react'
import { content } from '../data/content.js'
import { useInView, useCountUp } from '../hooks.js'

/** Zerlegt z.B. "1.250.000", "412 min", "0 km" in Zahl + Suffix. */
function splitStat(value) {
  const m = String(value).match(/^\s*([\d.,]+)(.*)$/)
  if (!m) return { num: null, suffix: '' }
  const num = parseInt(m[1].replace(/[.,]/g, ''), 10)
  return { num: Number.isNaN(num) ? null : num, suffix: m[2] }
}

function Stat({ value, label, start }) {
  const { num, suffix } = useMemo(() => splitStat(value), [value])
  const current = useCountUp(num ?? 0, { start: start && num != null })
  const shown =
    num == null ? value : Math.round(current).toLocaleString('de-DE') + suffix
  return (
    <div className="stat">
      <div className="stat-value">{shown}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function StatsBar() {
  const [ref, inView] = useInView({ threshold: 0.3 })
  return (
    <section className="stats-band" aria-label="Kennzahlen, die für sich sprechen">
      <div className="container" ref={ref}>
        <div className="stats-grid">
          {content.stats.map((s, i) => (
            <Stat key={i} value={s.value} label={s.label} start={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
