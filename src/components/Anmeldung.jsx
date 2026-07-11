import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content.js'
import { PowerIcon } from './icons.jsx'

const COUCH_TYPES = [
  'Ecksofa (Profi-Liga)',
  'Schlafsofa',
  'Récamiere',
  'Sessel mit Hocker',
  'Futon',
  'Boden + Kuscheldecke',
]

const SNACKS = ['Chips', 'Schokolade', 'Tiefkühlpizza', 'Kekse', 'Eis', 'Alles gleichzeitig']

const STORAGE_KEY = 'mcfaul_member'

function mitgliedsNr(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return 'MCF-' + String(10000 + (h % 89999))
}

function heute() {
  try {
    return new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return new Date().toLocaleDateString()
  }
}

function ladeMember() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Anmeldung({ open, onClose, selectedTier }) {
  const tiers = content.membership.map((m) => m.name)
  const [form, setForm] = useState({
    name: '',
    email: '',
    couch: COUCH_TYPES[0],
    snack: SNACKS[0],
    tier: selectedTier || tiers[1] || tiers[0],
  })
  const [errors, setErrors] = useState({})
  const [member, setMember] = useState(() => ladeMember())
  const firstFieldRef = useRef(null)
  const modalRef = useRef(null)

  // Tarif beim Öffnen setzen: gewählter Tarif oder Standard (kein stale Tarif).
  useEffect(() => {
    if (!open) return
    setForm((f) => ({ ...f, tier: selectedTier || tiers[1] || tiers[0] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedTier])

  // Esc schließt, Body-Scroll sperren, Fokus fangen & zurückgeben.
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      window.clearTimeout(t)
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const err = {}
    if (!form.name.trim()) err.name = 'Ohne Namen kein Mitgliedsausweis. Ein Wort reicht aber.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Bitte eine echte E-Mail — wir verschicken zwar nichts, aber der Form halber.'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const m = {
      name: form.name.trim(),
      tier: form.tier,
      couch: form.couch,
      snack: form.snack,
      nr: mitgliedsNr(form.name.trim()),
      seit: heute(),
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(m))
    } catch {
      /* egal — Faulheit braucht keinen Speicher */
    }
    setMember(m)
  }

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setMember(null)
    setForm((f) => ({ ...f, name: '', email: '' }))
    setErrors({})
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mitglied werden bei mcfaul"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Schließen">
          ✕
        </button>

        {member ? (
          <div className="success">
            <div className="success-emoji" aria-hidden="true">
              🛋️
            </div>
            <h3>Willkommen im Team Couch!</h3>
            <p className="modal-lead">
              Glückwunsch, {member.name}. Du bist jetzt offiziell Mitglied bei mcfaul. Es gibt
              nichts zu tun, nichts zu zahlen und nirgendwo hinzugehen. Du machst das schon jetzt
              hervorragend.
            </p>

            <div className="member-card">
              <div className="mc-top">
                <span>mcfaul · Mitgliedsausweis</span>
                <span>★ {member.tier}</span>
              </div>
              <div className="mc-name">{member.name}</div>
              <div className="mc-row">
                <span>
                  Mitgliedsnr.: <b>{member.nr}</b>
                </span>
                <span>
                  Mitglied seit: <b>{member.seit}</b>
                </span>
              </div>
              <div className="mc-row">
                <span>
                  Couch: <b>{member.couch}</b>
                </span>
                <span>
                  Treibstoff: <b>{member.snack}</b>
                </span>
              </div>
            </div>

            <button className="btn btn-block" onClick={onClose}>
              Alles klar, ich leg mich wieder hin
            </button>
            <p className="modal-fineprint">
              mcfaul existiert nicht als echtes Studio. Dein Ausweis auch nicht. Aber der gute
              Vorsatz zählt. ·{' '}
              <a href="#mitgliedschaft" onClick={reset} style={{ color: 'var(--accent)' }}>
                Mitgliedschaft löschen (zu anstrengend)
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="modal-eyebrow">Beitritt in 20 Sekunden (oder weniger)</div>
            <h3>Jetzt Mitglied werden</h3>
            <p className="modal-lead">
              Kein Probetraining, keine Beratung, kein Verkaufsgespräch. Trag dich ein, bleib
              liegen — fertig.
            </p>

            <div className="field">
              <label htmlFor="m-name">Wie sollen wir dich nennen?</label>
              <input
                id="m-name"
                ref={firstFieldRef}
                type="text"
                value={form.name}
                onChange={setField('name')}
                placeholder="z. B. Kevin von der Couch"
                autoComplete="name"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field">
              <label htmlFor="m-email">E-Mail (für nichts, versprochen)</label>
              <input
                id="m-email"
                type="email"
                value={form.email}
                onChange={setField('email')}
                placeholder="liegen@bleiben.de"
                autoComplete="email"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="m-tier">Dein Tarif</label>
              <select id="m-tier" value={form.tier} onChange={setField('tier')}>
                {tiers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="m-couch">Dein bevorzugtes Trainingsgerät</label>
              <select id="m-couch" value={form.couch} onChange={setField('couch')}>
                {COUCH_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="m-snack">Bevorzugter Trainings-Treibstoff</label>
              <select id="m-snack" value={form.snack} onChange={setField('snack')}>
                {SNACKS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-block">
              <PowerIcon className="btn-power-icon" />
              Anmelden &amp; liegen bleiben
            </button>
            <p className="modal-fineprint">
              Mit dem Beitritt versprichst du, dich heute zu nichts zu zwingen. mcfaul ist eine
              Satire — es werden keine Daten gesendet, nichts berechnet, niemand erscheint.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
