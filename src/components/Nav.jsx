import { useState } from 'react'
import { useScrolled } from '../hooks.js'
import { PowerIcon } from './icons.jsx'

const links = [
  { href: '#vorteile', label: 'Vorteile' },
  { href: '#video', label: 'Trainingsvideo' },
  { href: '#trainingsplan', label: 'Trainingsplan' },
  { href: '#spiel', label: 'Spiel' },
  { href: '#mitgliedschaft', label: 'Mitgliedschaft' },
  { href: '#stimmen', label: 'Stimmen' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav({ onAnmelden }) {
  const scrolled = useScrolled(10)
  const [open, setOpen] = useState(false)

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" aria-hidden="true" />
          <span className="brand-name">
            mc<b>faul</b>
          </span>
        </a>

        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <button className="btn" onClick={onAnmelden}>
            <PowerIcon className="btn-power-icon" />
            <span>Anmelden</span>
          </button>
          <button
            className="nav-burger"
            aria-label="Menü öffnen"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}
