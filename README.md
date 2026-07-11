# mcfaul 🛋️

**Deutschlands faulstes Fitnessstudio** — eine humoristische React-Website, die den ganzen Fitness-, Gym- und Hustle-Trend liebevoll auf die Schippe nimmt.

Die Idee: Man „meldet sich an" bei einem Fitnessstudio, das es gar nicht gibt. Statt _„Warst du heute schon pumpen? Ab ins Studio!"_ gilt hier das Motto: **„Bleib zuhause auf der Couch."**

> ⚠️ **Satire.** mcfaul ist eine Parodie. Es gibt kein echtes Studio, keine echten Tarife, keine echten Mitglieder. Alle Statistiken, Trainingspläne und Stimmen sind frei erfunden und augenzwinkernd gemeint.

## Features

- **Fake-Performance-Dashboard** im Hero — sieht aus wie eine Premium-Fitness-App, trackt aber Couch-Zeit, Nickerchen und „beim Fernbedienung-Suchen verbrannte" Kalorien. Der Kontrast ist der Witz.
- **Spruch des Tages** — täglich wechselnde „Demotivation", stabil pro Kalendertag, mit Button zum Durchklicken.
- **7-Tage-Trainingsplan** — von „Couch-Drücken im Liegen" bis „Kühlschrank-Sprint", umschaltbar nach Wochentag.
- **Mitgliedschaft & Anmeldung** — drei Parodie-Tarife und ein Anmelde-Modal, das einen personalisierten „Mitgliedsausweis" ausstellt (lokal gespeichert, nichts wird gesendet).
- **Bonus-Stempelkarte**, **Mitglieder-Stimmen**, **FAQ** und der offizielle **Imagefilm** (`public/mcfaul-video.mp4`).
- Komplett **responsive** und mit **`prefers-reduced-motion`**-Unterstützung (die bewusst trägen „Anti-Hustle"-Animationen werden dann abgeschaltet).

## Tech-Stack

- [React 18](https://react.dev/) + [Vite 5](https://vite.dev/) (plain JSX, keine UI-Library)
- Eine handgeschriebene, themengetriebene `src/index.css` (CSS-Variablen, keine Framework-Defaults)
- Fonts: _Saira Condensed_ (Headlines), _Sora_ (Fließtext), _Space Mono_ (Daten/Ausweis)

## Entwicklung

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Dev-Server (http://localhost:5173)
npm run build    # Produktions-Build nach dist/
npm run preview  # Produktions-Build lokal ansehen
```

## Projektstruktur

```
src/
  App.jsx                 # Komposition + Modal-/Tarif-State
  hooks.js                # useScrolled, useRevealOnScroll, useInView, useCountUp
  lib/spruch.js           # "Spruch des Tages"-Logik (stabil pro Tag)
  data/content.js         # Gesamter deutscher Texte-/Daten-Bundle
  components/             # Nav, Hero, Dashboard, Trainingsplan, Membership, Anmeldung, …
public/
  mcfaul-video.mp4        # Marken-/Imagefilm
  favicon.svg             # Power-Button-Logo ("Workout starten" = Fernseher an)
```

Sämtliche Texte stecken in `src/data/content.js` und lassen sich dort zentral anpassen.
