import { content } from '../data/content.js'
import { PowerIcon } from './icons.jsx'

export default function Footer({ onAnmelden }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand" style={{ fontSize: '1.7rem' }}>
              <img className="brand-mark" src="/favicon.svg" alt="" aria-hidden="true" />
              <span className="brand-name">
                mc<b>faul</b>
              </span>
            </div>
            <p>
              {content.brand.tagline} {content.brand.slogan} Das Fitnessstudio, in das du nie
              gehen musst — weil es das beste ist, das es nicht gibt.
            </p>
            <button className="btn" style={{ marginTop: 20 }} onClick={() => onAnmelden()}>
              <PowerIcon className="btn-power-icon" />
              Jetzt anmelden &amp; liegen bleiben
            </button>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h5>Studio</h5>
              <a href="#vorteile">Vorteile</a>
              <a href="#trainingsplan">Trainingsplan</a>
              <a href="#mitgliedschaft">Mitgliedschaft</a>
            </div>
            <div className="footer-col">
              <h5>Mehr</h5>
              <a href="#video">Trainingsvideo</a>
              <a href="#stimmen">Stimmen</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </div>

        <div className="footer-legal">{content.footerLegal}</div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} mcfaul — Bestleistung im Liegen.</span>
          <span>Made on the couch · Kein echtes Fitnessstudio</span>
        </div>
      </div>
    </footer>
  )
}
