# modusynth

A modular synthesizer in the browser, built on the Web Audio API. Play it with your computer keyboard or a MIDI controller, patch oscillators through modulators and combiners, shape notes with envelopes, and watch the output on a live oscilloscope.

**Live demo:** https://adrian729.github.io/modusynth/

## Features

- **Oscillators** — multiple waveforms (including custom wave tables), per-module pitch/detune, one voice per held note
- **Modulators & combiners** — patch module outputs into other modules' gain/frequency params to build FM/AM-style routings
- **Envelopes** — ADSR-style note shaping
- **Oscilloscope** — real-time waveform display rendered with d3
- **Input** — on-screen keyboard (qwerty-hancock), computer keyboard, and Web MIDI devices
- **Note freezer** — hold/freeze notes to play over them

> Web MIDI requires a Chromium-based browser. Audio starts after the first user gesture (browser autoplay policy).

## Tech stack

React 18 · Redux Toolkit · TypeScript · Vite · Tailwind CSS 4 · Web Audio API · Web MIDI API · d3

## Getting started

```bash
npm install
npm run dev      # dev server at http://localhost:4400/modusynth/
```

### Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start the Vite dev server (port 4400)    |
| `npm run build`           | Type-check (`tsc -b`) and build to `dist` |
| `npm run preview`         | Preview the production build locally     |
| `npm run lint`            | Run ESLint                               |
| `npm run prettier-format` | Format the codebase with Prettier        |

## Architecture in brief

The app keeps two worlds strictly separated:

- **Redux** holds immutable, serializable *descriptions* of synth modules (type, frequency, gain, envelope, routing) — never live audio objects.
- **A mutable registry** (React context) holds the singleton `AudioContext` and the live `AudioNode` graph, keyed by the same module ids.

Bridge hooks subscribe to Redux and translate state changes into imperative Web Audio calls (`connect`, scheduled param ramps) inside effects. Data flows one way: UI/MIDI → Redux → audio graph. See [CLAUDE.md](CLAUDE.md) for the invariants this design depends on.

```
src/
├── app/                  # store setup
├── components/
│   ├── modules/          # synth modules: generators, modulators, combiners, core (main out, oscilloscope, controllers)
│   └── specific/         # synth panel, pad panel, freezer, app info
├── context/              # mutable audio-graph registry (MainContext)
├── reducers/             # Redux Toolkit slices: synthesis, oscillators, synth
└── styles/
```

## Deployment

Pushes to `main` are built and deployed to GitHub Pages automatically via [GitHub Actions](.github/workflows/deploy.yml). The Vite `base` is set to `/modusynth/` accordingly.

## License

See [LICENSE](LICENSE).
