import { useRef, useState } from 'react'
import { content } from '../data/content.js'

export default function Trainingsplan() {
  const [active, setActive] = useState(0)
  const days = content.trainingPlan.days
  const day = days[active]
  const tabRefs = useRef([])

  const onTabKey = (e) => {
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % days.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + days.length) % days.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = days.length - 1
    if (next !== null) {
      e.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  return (
    <section className="section" id="trainingsplan">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Dein 7-Tage-Plan</span>
          <h2 className="section-title">Der Trainingsplan</h2>
        </div>

        <p className="plan-intro reveal">{content.trainingPlan.intro}</p>

        <div className="plan-tabs reveal" role="tablist" aria-label="Wochentage">
          {days.map((d, i) => (
            <button
              key={d.day}
              id={`plan-tab-${i}`}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              aria-selected={i === active}
              aria-controls="plan-panel"
              aria-label={d.day}
              tabIndex={i === active ? 0 : -1}
              className={`plan-tab${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              onKeyDown={onTabKey}
            >
              <span aria-hidden="true">{d.emoji}</span>
              {d.day.slice(0, 2)}
            </button>
          ))}
        </div>

        <div
          className="plan-panel reveal"
          role="tabpanel"
          id="plan-panel"
          aria-labelledby={`plan-tab-${active}`}
          tabIndex={0}
        >
          <div className="plan-panel-head">
            <div className="plan-day-emoji" aria-hidden="true">
              {day.emoji}
            </div>
            <div>
              <h3 className="plan-day-title">
                {day.day} · {day.title}
              </h3>
              <div className="plan-day-focus">Fokus: {day.focus}</div>
            </div>
          </div>

          <div>
            {day.exercises.map((ex, i) => (
              <div className="exercise" key={i}>
                <span className="ex-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="ex-name">{ex.name}</div>
                  <div className="ex-detail">{ex.detail}</div>
                </div>
                <span className="ex-sets">{ex.sets}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
