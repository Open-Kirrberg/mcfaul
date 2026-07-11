import { content } from '../data/content.js'

export default function Features() {
  return (
    <section className="section" id="vorteile">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Warum mcfaul</span>
          <h2 className="section-title">
            Alles, was ein Studio braucht.
            <br />
            Nur ohne Studio.
          </h2>
          <p className="section-sub">
            Keine Verträge mit Kleingedrucktem, das du nie liest. Nur ehrliche Vorteile für
            Menschen, die ihr Bestes geben — im Liegen.
          </p>
        </div>

        <div className="feature-grid">
          {content.features.map((f, i) => (
            <article className="feature reveal" key={i}>
              <div className="feature-emoji" aria-hidden="true">
                {f.emoji}
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
