import { content } from '../data/content.js'

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Testimonials() {
  return (
    <section className="section" id="stimmen">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Echte* Erfolgsgeschichten</span>
          <h2 className="section-title">Stimmen von der Couch</h2>
          <p className="section-sub">
            *Erfunden, aber mit ganzem Herzen. Diese Menschen haben es geschafft: Sie sind
            einfach liegen geblieben.
          </p>
        </div>

        <div className="testi-grid">
          {content.testimonials.map((t, i) => (
            <figure className="testi reveal" key={i}>
              <blockquote className="testi-quote">{t.quote}</blockquote>
              <div className="testi-trans">{t.transformation}</div>
              <figcaption className="testi-who">
                <div className="testi-avatar" aria-hidden="true">
                  {initials(t.name)}
                </div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-loc">
                    {t.age} Jahre · {t.city}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
