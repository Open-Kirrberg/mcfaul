import { useEffect, useState } from 'react'

/** Fake-Performance-Dashboard: sieht aus wie eine Premium-Gym-App,
 *  trackt aber Nickerchen, Couch-Zeit & faule Kalorien. */
export default function Dashboard() {
  const [couchMin, setCouchMin] = useState(412)

  // "Live": die Couch-Zeit kriecht gemütlich nach oben (gedeckelt, damit die
  // Kachel auch nach langer Sitzung nicht überläuft).
  useEffect(() => {
    const id = setInterval(() => setCouchMin((m) => Math.min(m + 1, 999)), 4000)
    return () => clearInterval(id)
  }, [])

  const r = 42
  const circ = 2 * Math.PI * r

  return (
    <div className="dashboard reveal" aria-label="Beispiel-Dashboard der mcfaul-App">
      <div className="dash-top">
        <span className="dash-title">Heute · Bestform im Liegen</span>
        <span className="dash-live">
          <span className="live-dot" /> Live
        </span>
      </div>

      <div className="dash-grid">
        <div className="tile">
          <div className="tile-label">Couch-Zeit</div>
          <div className="tile-value">
            {couchMin} <small>min</small>
          </div>
          <div className="tile-foot">Neuer persönlicher Rekord 🔥</div>
        </div>

        <div className="tile">
          <div className="tile-ring">
            <svg className="ring" viewBox="0 0 100 100">
              <circle className="ring-track" cx="50" cy="50" r={r} fill="none" strokeWidth="9" />
              <circle
                className="ring-fill"
                cx="50"
                cy="50"
                r={r}
                fill="none"
                strokeWidth="9"
                strokeDasharray={circ}
                strokeDashoffset={0}
              />
              <text className="ring-center" x="50" y="56" textAnchor="middle">
                100%
              </text>
            </svg>
            <div>
              <div className="tile-label">Tagesziel</div>
              <div className="tile-foot" style={{ marginTop: 4 }}>
                Liegen: erfüllt
              </div>
            </div>
          </div>
        </div>

        <div className="tile">
          <div className="tile-label">Nickerchen</div>
          <div className="tile-value">
            3 <small>/ 3 Sätze</small>
          </div>
          <div className="tile-foot">Sauber durchgezogen</div>
        </div>

        <div className="tile">
          <div className="tile-label">Kalorien</div>
          <div className="tile-value">
            12 <small>kcal</small>
          </div>
          <div className="tile-foot">Fernbedienung gesucht</div>
        </div>

        <div className="tile tile-pulse">
          <div className="tile-label">Ruhepuls · stabil schläfrig</div>
          <svg className="pulse-svg" viewBox="0 0 600 54" preserveAspectRatio="none">
            <path
              className="pulse-path"
              d="M0 30 H120 l8 -4 7 8 7 -10 7 12 7 -6 H280 l10 -3 8 5 H420 l9 -16 9 30 9 -16 8 2 H600"
            />
          </svg>
          <div className="tile-foot">48 bpm — fester, gesunder Couch-Schlummer</div>
        </div>
      </div>
    </div>
  )
}
