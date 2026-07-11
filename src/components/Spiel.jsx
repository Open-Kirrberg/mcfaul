import { useCallback, useEffect, useRef, useState } from 'react'
import { content } from '../data/content.js'

const G = content.game

/* ----------------------------------------------------------------
   Bleib liegen! — Die Couch-Verteidigung
   Sport-Versuchungen steigen zur Aufsteh-Zone. Wegtippen = faul bleiben,
   Snacks einsammeln = Couch-Streak halten. Premium-App-Optik, fauler Inhalt.
   Loop laeuft ueber requestAnimationFrame; Spielzustand liegt in einem Ref
   (kein setState pro Item), die Anzeige wird pro Frame einmal angestossen.
   ---------------------------------------------------------------- */

const TUNE = {
  ZONE: 9, // % von oben: ab hier ist eine Versuchung "durchgekommen"
  START_Y: 106, // Spawn knapp unter dem sichtbaren Feld
  SPAWN_START: 1.7, // s zwischen Spawns im 1. Satz
  SPAWN_FLOOR: 0.72, // schnellstes Spawn-Intervall
  SPAWN_STEP: 0.16, // Verkuerzung pro Satz
  RISE_BASE: 12.5, // % Hoehe pro Sekunde
  RISE_PER_SATZ: 1.7,
  SATZ_LEN: 12, // s pro Satz (Welle)
  MAX_ITEMS: 9,
  SNACK_RATIO: 0.24,
  BOSS_FROM_SATZ: 3,
  BOSS_CHANCE: 0.07,
  LIVES: 3,
  BASE_PTS: 10,
  SNACK_PTS: 15,
  BOSS_PTS: 80,
  METER_MAX: 100,
  SNACK_METER: 26,
  BEAST_DUR: 4.5, // s Spielzeit
  BEAST_SLOW: 0.45,
  RECEIPT_LIFE: 0.85, // s
}

const HS_KEY = 'mcfaul_couch_highscore'
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function loadBest() {
  try {
    const v = localStorage.getItem(HS_KEY)
    return v ? parseInt(v, 10) || 0 : 0
  } catch {
    return 0
  }
}
function saveBest(v) {
  try {
    localStorage.setItem(HS_KEY, String(v))
  } catch {
    /* localStorage nicht verfuegbar — egal, ist nur ein Spiel */
  }
}

function rankFor(score) {
  let r = G.ranks[0]
  for (const cand of G.ranks) if (score >= cand.min) r = cand
  return r
}

function freshState(best, regen, reduce) {
  return {
    items: [],
    receipts: [],
    seq: 1,
    score: 0,
    streak: 0,
    maxStreak: 0,
    lives: TUNE.LIVES,
    meter: 0,
    satz: 1,
    elapsed: 0,
    lastTs: 0,
    spawnTimer: 0.6,
    satzTimer: TUNE.SATZ_LEN,
    beastUntil: -1,
    hurtAt: -10,
    over: false,
    active: false,
    best,
    regen,
    reduce,
    announce: '',
  }
}

export default function Spiel() {
  const [phase, setPhase] = useState('bereit') // bereit | laeuft | pausiert | vorbei
  const [, force] = useState(0)
  const [regen, setRegen] = useState(false)
  const [best, setBest] = useState(0)
  const reduceRef = useRef(false)
  const overRef = useRef(null)
  const g = useRef(freshState(0, false, false))

  const tick = useCallback(() => force((n) => (n + 1) % 1000000), [])

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    reduceRef.current = !!mq?.matches
    const onMq = (e) => {
      reduceRef.current = e.matches
    }
    mq?.addEventListener?.('change', onMq)
    const b = loadBest()
    setBest(b)
    g.current.best = b
    return () => mq?.removeEventListener?.('change', onMq)
  }, [])

  // Fokus auf die Game-Over-Karte legen (A11y: Ergebnis + Restart erreichbar)
  useEffect(() => {
    if (phase === 'vorbei') overRef.current?.focus()
  }, [phase])

  // ---- Item-Erzeugung ----
  const spawn = useCallback(() => {
    const s = g.current
    if (s.items.length >= TUNE.MAX_ITEMS) return
    let kind = 'temptation'
    if (s.satz >= TUNE.BOSS_FROM_SATZ && Math.random() < TUNE.BOSS_CHANCE) kind = 'boss'
    else if (Math.random() < TUNE.SNACK_RATIO) kind = 'snack'

    let emoji, label, hp = 1, size = 1, isWecker = false
    if (kind === 'snack') {
      const it = pick(G.snacks)
      emoji = it.emoji
      label = it.label
    } else if (kind === 'boss') {
      emoji = G.boss.emoji
      label = G.boss.label
      hp = 2
      size = 1.4
    } else {
      const it = pick(G.temptations)
      emoji = it.emoji
      label = it.label
      isWecker = it.label === 'Wecker'
    }

    const speedMul =
      kind === 'snack' ? 0.82 : kind === 'boss' ? 0.66 : 0.9 + Math.random() * 0.35
    const drift = (Math.random() * 2 - 1) * (kind === 'snack' ? 6 : 2.5)
    s.items.push({
      id: s.seq++,
      kind,
      emoji,
      label,
      hp,
      size,
      isWecker,
      snooze: 0,
      taunted: false,
      x: 8 + Math.random() * 84,
      y: TUNE.START_Y,
      speedMul,
      drift,
    })
  }, [])

  const addReceipt = useCallback((s, x, y, text, tone) => {
    s.receipts.push({ id: s.seq++, x, y, text, tone, age: 0 })
  }, [])

  const beastActive = (s) => s.beastUntil > s.elapsed

  // ---- Treffer (Tap/Klick) ----
  const hit = useCallback(
    (id, ev) => {
      ev?.preventDefault?.()
      ev?.stopPropagation?.()
      const s = g.current
      if (!s.active || s.over) return
      const it = s.items.find((x) => x.id === id)
      if (!it) return

      const combo = 1 + Math.floor(s.streak / 5)
      const bm = beastActive(s) ? 2 : 1
      const remove = () => {
        s.items = s.items.filter((x) => x.id !== it.id)
      }
      const bump = () => {
        s.streak += 1
        if (s.streak > s.maxStreak) s.maxStreak = s.streak
      }

      if (it.kind === 'snack') {
        s.score += TUNE.SNACK_PTS * combo * bm
        bump()
        // Meter nur ausserhalb des Beast-Modus fuellen, sonst klebt er bei 100
        // und ein neues Beast triggert direkt nach Ende statt verdient
        if (!beastActive(s)) {
          s.meter = Math.min(TUNE.METER_MAX, s.meter + TUNE.SNACK_METER)
          if (s.meter >= TUNE.METER_MAX) {
            s.beastUntil = s.elapsed + TUNE.BEAST_DUR
            s.meter = 0
          }
        }
        addReceipt(s, it.x, it.y, pick(G.snackGrabs), 'good')
        remove()
      } else if (it.kind === 'boss') {
        it.hp -= 1
        if (it.hp > 0) {
          it.taunted = true
          addReceipt(s, it.x, it.y, 'Nö, ernsthaft.', 'no')
        } else {
          s.score += TUNE.BOSS_PTS * combo * bm
          bump()
          addReceipt(s, it.x, it.y, G.bossDown, 'good')
          remove()
        }
      } else {
        // Versuchung: spaeter wegtippen = mehr Punkte (Last-Minute-Faulheit)
        const progress = clamp((TUNE.START_Y - it.y) / (TUNE.START_Y - TUNE.ZONE), 0, 1)
        const timing = 1 + progress
        const pts = Math.round(TUNE.BASE_PTS * timing * combo * bm)
        if (it.isWecker && it.snooze < 2) {
          // Schlummertaste: kommt schneller wieder
          it.snooze += 1
          it.y = TUNE.START_Y
          it.speedMul *= 1.45
          s.score += pts
          bump()
          addReceipt(s, it.x, 100, G.snoozeLabels[it.snooze - 1], 'snooze')
        } else {
          s.score += pts
          bump()
          addReceipt(s, it.x, it.y, pick(G.refusals), 'no')
          remove()
        }
      }
      tick()
    },
    [addReceipt, tick]
  )

  const endGame = useCallback((s) => {
    s.over = true
    s.active = false
    const nb = Math.max(s.best, Math.round(s.score))
    s.newRecord = Math.round(s.score) > s.best && s.score > 0
    s.best = nb
    saveBest(nb)
    const rank = rankFor(Math.round(s.score))
    s.headline = pick(G.gameOverHeadlines)
    s.rank = rank
    s.announce = `Vorbei. ${Math.round(s.score)} ${G.labels.score}. Rang: ${rank.title}.`
    setBest(nb)
    setPhase('vorbei')
  }, [])

  // ---- Game-Loop ----
  useEffect(() => {
    if (phase !== 'laeuft') return
    const s = g.current
    s.active = true
    s.lastTs = performance.now()
    let raf = 0

    const tempo = (s.regen ? 0.8 : 1) * (s.reduce ? 0.86 : 1)

    const frame = (ts) => {
      if (!s.active || s.over) return
      let dt = (ts - s.lastTs) / 1000
      s.lastTs = ts
      if (dt > 0.05) dt = 0.05 // Tab-Wechsel-Spruenge daempfen
      const slow = beastActive(s) ? TUNE.BEAST_SLOW : 1
      s.elapsed += dt

      // Satz / Welle
      s.satzTimer -= dt
      if (s.satzTimer <= 0) {
        s.satz += 1
        s.satzTimer = TUNE.SATZ_LEN
        addReceipt(s, 50, 18, pick(G.satzAnnounce), 'satz')
      }

      // Spawnen
      s.spawnTimer -= dt
      if (s.spawnTimer <= 0) {
        spawn()
        const base = Math.max(TUNE.SPAWN_FLOOR, TUNE.SPAWN_START - (s.satz - 1) * TUNE.SPAWN_STEP)
        s.spawnTimer = (base / tempo) * (0.75 + Math.random() * 0.5)
      }

      // Items bewegen
      const rise = TUNE.RISE_BASE + (s.satz - 1) * TUNE.RISE_PER_SATZ
      for (let i = s.items.length - 1; i >= 0; i--) {
        const it = s.items[i]
        it.y -= rise * it.speedMul * tempo * slow * dt
        it.x = clamp(it.x + it.drift * dt, 4, 92)
        if (it.y <= TUNE.ZONE) {
          s.items.splice(i, 1)
          // Snacks kosten nichts (faul bleiben ist erlaubt); nur durchgekommene
          // Sport-Versuchungen reissen den Streak und kosten ein Couch-Leben.
          if (it.kind !== 'snack') {
            s.lives -= 1
            s.streak = 0
            s.hurtAt = s.elapsed
            s.announce = `${pick(G.lifeLossLines)} ${s.lives} ${G.labels.lives} übrig.`
            if (s.lives <= 0) {
              endGame(s)
              return
            }
          }
        }
      }

      // Quittungen floaten + altern
      const floatV = s.reduce ? 0 : 32
      for (let i = s.receipts.length - 1; i >= 0; i--) {
        const r = s.receipts[i]
        r.age += dt
        r.y -= floatV * dt
        if (r.age > TUNE.RECEIPT_LIFE) s.receipts.splice(i, 1)
      }

      tick()
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      s.active = false
      cancelAnimationFrame(raf)
    }
  }, [phase, spawn, addReceipt, endGame, tick])

  // Auto-Pause bei Tab-Wechsel — kein unfairer Verlust im Hintergrund
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPhase((p) => (p === 'laeuft' ? 'pausiert' : p))
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const start = useCallback(() => {
    g.current = freshState(best, regen, reduceRef.current)
    setPhase('laeuft')
  }, [best, regen])

  const s = g.current
  const hurt = s.elapsed - s.hurtAt
  const showHurt = hurt >= 0 && hurt < 0.4
  const shaking = showHurt && !s.reduce
  const inBeast = beastActive(s) && (phase === 'laeuft' || phase === 'pausiert')
  const lives = Array.from({ length: TUNE.LIVES }, (_, i) => i < s.lives)
  const meterPct = clamp((s.meter / TUNE.METER_MAX) * 100, 0, 100)

  return (
    <section className="section spiel" id="spiel" aria-labelledby="spiel-title">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">{G.eyebrow}</span>
          <h2 className="section-title" id="spiel-title">
            {G.name}
          </h2>
          <p className="section-sub">{G.intro}</p>
        </div>

        <div className={`spiel-console${shaking ? ' is-shake' : ''}`}>
          {/* HUD */}
          <div className="spiel-hud">
            <div className="hud-cell">
              <span className="hud-label">{G.labels.score}</span>
              <span className="hud-value">{Math.round(s.score)}</span>
            </div>
            <div className="hud-cell">
              <span className="hud-label">{G.labels.combo}</span>
              <span className="hud-value">
                ×{1 + Math.floor(s.streak / 5)} <small>· {s.streak}</small>
              </span>
            </div>
            <div className="hud-cell hud-meter-cell">
              <span className="hud-label">{G.labels.meter}</span>
              <span className="hud-meter">
                <span className="hud-meter-fill" style={{ width: meterPct + '%' }} />
              </span>
            </div>
            <div className="hud-cell hud-lives">
              <span className="hud-label">
                {G.labels.satz} {s.satz}
              </span>
              <span className="lives-row" aria-label={`${s.lives} ${G.labels.lives}`}>
                {lives.map((on, i) => (
                  <span key={i} className={`life${on ? '' : ' life-off'}`} aria-hidden="true">
                    🛋️
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Spielfeld */}
          <div
            className={`spiel-field${inBeast ? ' is-beast' : ''}${
              s.regen || s.reduce ? ' is-calm' : ''
            }`}
          >
            <div className="zone" aria-hidden="true">
              <span>↑ {G.labels.zone} ↑</span>
            </div>

            {phase === 'laeuft' &&
              s.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  tabIndex={-1}
                  className={`spiel-item item-${it.kind}${it.kind === 'boss' ? ' item-boss' : ''}`}
                  style={{
                    left: it.x + '%',
                    top: it.y + '%',
                    fontSize: `clamp(1.7rem, ${4.4 * it.size}vw, ${2.6 * it.size}rem)`,
                  }}
                  onPointerDown={(e) => hit(it.id, e)}
                  aria-label={`${it.label} ${it.kind === 'snack' ? 'einsammeln' : 'wegtippen'}`}
                >
                  <span aria-hidden="true">{it.emoji}</span>
                  {it.kind === 'boss' && it.taunted && (
                    <span className="boss-bubble" aria-hidden="true">
                      {G.boss.taunt}
                    </span>
                  )}
                </button>
              ))}

            {phase === 'laeuft' &&
              s.receipts.map((r) => (
                <span
                  key={r.id}
                  className={`receipt receipt-${r.tone}`}
                  style={{
                    left: r.x + '%',
                    top: r.y + '%',
                    opacity: clamp(1 - r.age / TUNE.RECEIPT_LIFE, 0, 1),
                  }}
                  aria-hidden="true"
                >
                  {r.text}
                </span>
              ))}

            {inBeast && (
              <div className="beast-banner" aria-hidden="true">
                <strong>{G.beast.label}</strong>
                <span>{G.beast.sub}</span>
              </div>
            )}

            {showHurt && s.reduce && <div className="hurt-flash" aria-hidden="true" />}

            {/* Start-Karte */}
            {phase === 'bereit' && (
              <div className="spiel-overlay" role="dialog" aria-modal="true" aria-label={G.name}>
                <div className="overlay-card">
                  <span className="overlay-kicker">{G.subtitle}</span>
                  <p className="overlay-tag">{G.tagline}</p>
                  <ul className="howto">
                    {G.howto.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <label className="regen-toggle">
                    <input
                      type="checkbox"
                      checked={regen}
                      onChange={(e) => setRegen(e.target.checked)}
                    />
                    <span>
                      <b>{G.regen.label}</b>
                      <small>{G.regen.hint}</small>
                    </span>
                  </label>
                  <button className="btn btn-block" onClick={start}>
                    {G.buttons.start}
                  </button>
                </div>
              </div>
            )}

            {/* Pause */}
            {phase === 'pausiert' && (
              <div className="spiel-overlay" role="dialog" aria-modal="true" aria-label={G.labels.paused}>
                <div className="overlay-card">
                  <span className="overlay-kicker">{G.labels.paused}</span>
                  <p className="overlay-tag">{G.labels.pausedSub}</p>
                  <div className="overlay-actions">
                    <button className="btn" onClick={() => setPhase('laeuft')}>
                      {G.buttons.resume}
                    </button>
                    <button className="btn btn-ghost" onClick={start}>
                      {G.buttons.restart}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over */}
            {phase === 'vorbei' && (
              <div className="spiel-overlay" role="dialog" aria-modal="true" aria-label={s.headline}>
                <div className="overlay-card overlay-over" tabIndex={-1} ref={overRef}>
                  <span className="overlay-kicker over-headline">{s.headline}</span>
                  <div className="over-score">
                    <span className="over-num">{Math.round(s.score)}</span>
                    <span className="over-unit">{G.labels.score}</span>
                  </div>
                  {s.newRecord && <p className="over-record">{G.labels.newRecord}</p>}
                  <p className="over-rank">{s.rank?.title}</p>
                  <p className="over-blurb">{s.rank?.blurb}</p>
                  <div className="over-meta">
                    <span>
                      {G.labels.maxStreak}: <b>{s.maxStreak}</b>
                    </span>
                    <span>
                      {G.labels.satzReached}: <b>{Math.max(0, s.satz - 1)}</b>
                    </span>
                  </div>
                  <button className="btn btn-block" onClick={start}>
                    {G.buttons.restart}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Steuerleiste */}
          <div className="spiel-bar">
            <span className="spiel-best">
              {G.labels.best}: <b>{best}</b> 🔥
            </span>
            {phase === 'laeuft' && (
              <button className="btn btn-ghost btn-sm" onClick={() => setPhase('pausiert')}>
                {G.buttons.pause}
              </button>
            )}
          </div>
        </div>

        {/* Screenreader-Status: nur Ereignisse, nicht jedes Item */}
        <p className="sr-only" aria-live="polite">
          {s.announce}
        </p>
      </div>
    </section>
  )
}
