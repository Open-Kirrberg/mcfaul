import { useId, useRef, useState } from 'react'
import { content } from '../data/content.js'

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const uid = useId()
  const qId = `faq-q-${uid}`
  const panelId = `faq-panel-${uid}`
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button
        id={qId}
        className="faq-q"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{q}</span>
        <span className="faq-icon" aria-hidden="true">
          +
        </span>
      </button>
      <div
        id={panelId}
        className="faq-a"
        role="region"
        aria-labelledby={qId}
        aria-hidden={!open}
        style={{ maxHeight: open ? (ref.current?.scrollHeight ?? 1000) + 24 + 'px' : 0 }}
      >
        <div className="faq-a-inner" ref={ref}>
          {a}
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Häufige Fragen</span>
          <h2 className="section-title">Fragen, die du im Liegen stellst</h2>
        </div>
        <div className="faq-list reveal">
          {content.faq.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
