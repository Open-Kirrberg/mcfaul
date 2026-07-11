import { useCallback, useEffect, useState } from 'react'
import { content } from '../data/content.js'
import { spruchIndexOfDay, heutigesDatum } from '../lib/spruch.js'
import Divider from './Divider.jsx'

export default function SpruchDesTages() {
  const [index, setIndex] = useState(() => spruchIndexOfDay())
  const [fade, setFade] = useState(false)
  const [extra, setExtra] = useState(false) // hat der Nutzer manuell weitergeklickt?
  const total = content.sayings.length

  const naechster = useCallback(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setIndex((i) => (i + 1) % total)
      setExtra(true)
      return
    }
    setFade(true)
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % total)
      setExtra(true)
      setFade(false)
    }, 480)
  }, [total])

  useEffect(() => {
    setIndex(spruchIndexOfDay())
  }, [])

  const spruch = content.sayings[index]

  return (
    <section className="section spruch" aria-label="Spruch des Tages">
      <Divider />
      <div className="container" style={{ marginTop: 56 }}>
        <div className="section-head center reveal">
          <span className="eyebrow">Tägliche Motivation</span>
          <h2 className="section-title">Spruch des Tages</h2>
          <p className="section-sub">
            Jeden Tag frische Demotivation — pünktlich, ohne dass du dich dafür bewegen musst.
          </p>
        </div>

        <div className="spruch-card reveal">
          <p className={`spruch-quote${fade ? ' spruch-fade' : ''}`}>
            <span className="mark">»</span>&nbsp;{spruch}&nbsp;<span className="mark">«</span>
          </p>
          <div className="spruch-actions">
            <button className="btn btn-ghost" onClick={naechster}>
              Noch ein Spruch (wie anstrengend)
            </button>
            <span className="spruch-meta">
              {extra ? `Spruch ${index + 1} / ${total}` : heutigesDatum()}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
