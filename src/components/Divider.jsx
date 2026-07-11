/** Liegende Herzfrequenz-Linie (EKG) als Section-Divider — fast flach,
 *  kurz vor dem Einschlafen. Parodiert das Vital-Tracking echter Gym-Apps. */
export default function Divider() {
  return (
    <div className="container" aria-hidden="true">
      <svg className="divider" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path d="M0 20 H280 l9 -4 7 9 7 -11 7 13 7 -7 H540 l13 -13 11 26 11 -20 9 7 H880 q7 -3 15 0 H1130 l8 -4 6 8 6 -4 H1200" />
      </svg>
    </div>
  )
}
