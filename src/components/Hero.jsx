import { content } from '../data/content.js'
import { PowerIcon, PlayIcon } from './icons.jsx'
import Dashboard from './Dashboard.jsx'

const chips = [
  { e: '🥔', top: '18%', left: '6%', delay: '0s' },
  { e: '🍟', top: '62%', left: '2%', delay: '5s' },
  { e: '🥨', top: '30%', left: '52%', delay: '9s' },
  { e: '🍪', top: '74%', left: '46%', delay: '3s' },
]

const zzz = [
  { top: '12%', left: '40%', size: '1.4rem', delay: '0s' },
  { top: '8%', left: '46%', size: '2rem', delay: '1.4s' },
  { top: '3%', left: '53%', size: '2.6rem', delay: '2.8s' },
]

export default function Hero({ onAnmelden }) {
  const { hero } = content
  const badge = hero.badge
  const highlight = 'Also nirgendwo.'
  const idx = hero.headline.indexOf(highlight)
  const head =
    idx === -1 ? (
      hero.headline
    ) : (
      <>
        {hero.headline.slice(0, idx)}
        <span className="hl">{highlight}</span>
      </>
    )

  return (
    <section className="hero" id="top">
      <div className="hero-floaties">
        {chips.map((c, i) => (
          <span
            key={i}
            className="chip"
            style={{ top: c.top, left: c.left, animationDelay: c.delay }}
          >
            {c.e}
          </span>
        ))}
        {zzz.map((z, i) => (
          <span
            key={i}
            className="zzz"
            style={{ top: z.top, left: z.left, fontSize: z.size, animationDelay: z.delay }}
          >
            z
          </span>
        ))}
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="live-dot" />
            {badge}
          </span>
          <h1>{head}</h1>
          <p className="hero-sub">{hero.subline}</p>
          <div className="hero-actions">
            <button className="btn" onClick={onAnmelden}>
              <PowerIcon className="btn-power-icon" />
              {hero.ctaPrimary}
            </button>
            <a className="btn btn-ghost" href="#trainingsplan">
              <PlayIcon />
              {hero.ctaSecondary}
            </a>
          </div>
          <p className="hero-note">
            * Kein Aufstehen erforderlich. Keine Kreditkarte. Kein Schweiß.
          </p>
        </div>

        <Dashboard />
      </div>
    </section>
  )
}
