import { content } from '../data/content.js'
import { CheckIcon, PowerIcon } from './icons.jsx'

const STAMPS_TOTAL = 10
const STAMPS_FULL = 7

export default function Membership({ onAnmelden }) {
  return (
    <section className="section" id="mitgliedschaft">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Mitgliedschaft</span>
          <h2 className="section-title">Wähle dein Niveau an Nichtstun</h2>
          <p className="section-sub">
            Alle Tarife teilen sich denselben Premium-Vorteil: Du musst nie hingehen.
          </p>
        </div>

        <div className="price-grid">
          {content.membership.map((tier) => (
            <div
              key={tier.name}
              className={`price-card reveal${tier.highlight ? ' highlight' : ''}`}
            >
              {tier.highlight && <span className="price-flag">Am beliebtesten</span>}
              <h3 className="price-name">{tier.name}</h3>
              <p className="price-tagline">{tier.tagline}</p>
              <div className="price-amount">
                <span className="num">{tier.price}</span>
                <span className="per">{tier.period}</span>
              </div>
              <ul className="perks">
                {tier.perks.map((p, i) => (
                  <li key={i}>
                    <CheckIcon className="check" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`btn btn-block${tier.highlight ? '' : ' btn-ghost'}`}
                onClick={() => onAnmelden(tier.name)}
              >
                <PowerIcon className="btn-power-icon" />
                {tier.name} wählen
              </button>
            </div>
          ))}
        </div>

        <div className="stamp reveal">
          <div className="stamp-info">
            <h4>mcfaul Bonusprogramm</h4>
            <div className="big">10 Nickerchen = 1 gratis Couch-Tag</div>
            <p>
              Sammle bei jedem Nickerchen einen Stempel. Bei voller Karte schenken wir dir
              einen kompletten Tag auf der Couch — ganz ohne Aufpreis.
            </p>
          </div>
          <div className="stamps" aria-label="Stempelkarte: 7 von 10 Nickerchen gesammelt">
            {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
              <div className={`stamp-dot${i < STAMPS_FULL ? ' full' : ''}`} key={i}>
                {i < STAMPS_FULL ? '😴' : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
