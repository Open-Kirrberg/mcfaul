const steps = [
  { k: '00:01', t: 'Aufstehen — leider unvermeidlich, aber nur ganz kurz.' },
  { k: '00:04', t: 'Die offizielle mcfaul-Sporttasche greifen. Inhalt: ausschließlich Snacks.' },
  { k: '00:08', t: 'Zielstrebiger Marsch ins Wohnzimmer. Die einzige Strecke des Tages.' },
  { k: '00:11', t: 'Punktlandung auf der Couch. Saubere Form, volle Hingabe.' },
  { k: '00:14', t: 'Tasche öffnen, Chips entnehmen. Workout abgeschlossen.' },
]

export default function VideoSection() {
  return (
    <section className="section" id="video">
      <div className="container video-wrap">
        <div className="video-frame reveal">
          <span className="video-tag">
            <span className="live-dot" /> Offizieller Imagefilm
          </span>
          <video
            src={`${import.meta.env.BASE_URL}mcfaul-video.mp4`}
            controls
            playsInline
            preload="metadata"
            aria-label="mcfaul Imagefilm: ein perfekter Trainingstag auf der Couch"
          >
            <track
              kind="captions"
              src={`${import.meta.env.BASE_URL}mcfaul-video.de.vtt`}
              srcLang="de"
              label="Deutsch"
              default
            />
          </video>
        </div>

        <div className="reveal">
          <span className="eyebrow">Das mcfaul-Trainingsvideo</span>
          <h2 className="section-title">So sieht ein perfekter Trainingstag aus.</h2>
          <p className="section-sub">
            Kein Hochglanz-Studio, keine schreienden Trainer. Nur reine, ehrliche Technik —
            von der Sporttasche bis zur Chipstüte. Schau dir an, wie die Profis es machen.
          </p>
          <ul className="video-list">
            {steps.map((s) => (
              <li key={s.k}>
                <span className="vk">{s.k}</span>
                <span>{s.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
