# modusynth

Modular synthesizer: React 18 + Redux Toolkit + Web Audio API + Web MIDI. CRA (react-scripts 5), TypeScript, Tailwind 3 + SCSS, Storybook, d3.

Commands: `npm start` · `npm test` · `npm run build` · `npm run storybook`

## Core architecture: two worlds, one bridge

React/Redux expects **immutable, serializable state**. Web Audio (and Web MIDI) expects **long-lived mutable objects** whose *identity is the audio graph* — replacing a node silently drops all its connections. The codebase keeps these worlds strictly separated and bridges them in one direction:

```
user gesture / MIDI / keyboard
        │ dispatch (immutable descriptions)
        ▼
  Redux store ──────────────► bridge hooks ──────────► live audio graph
  src/reducers/*              useEffect translates     MainContext registry
  "what it should sound like" state → imperative calls "the objects making sound"
```

- **Redux** (`synthesisSlice`, `oscillatorsSlice`, `synthSlice`): serializable module *descriptions* (type, freq, gain, envelope, child ids) and live/frozen notes. Never holds an AudioNode.
- **MainContext** (`src/context/MainContext/`): the mutable world — the singleton `AudioContext`, `mainConnection`, and `modules: Record<string, ModuleInterface>`, a registry of **pointers to live AudioNodes** plus connection callbacks (`addInputs`, `addGainInputs`, `addFreqInputs`).
- **The module `id` is the join key**: the same id keys a module's Redux description and its live nodes in the MainContext registry.
- **Bridge hooks** (`useOscillator`, `useCombinator`, `useModulator`, `useMainAudio`): subscribe to Redux via selectors, then mutate the audio graph inside `useEffect` (create nodes, `.connect()`, schedule param changes).

Data flows one way. Audio-graph state never flows back into Redux.

## Invariants — violating these breaks sound, not tests

- **Never put AudioNodes, AudioParams, or MIDI objects in Redux.** Immer would proxy/freeze them and RTK warns on non-serializable values; the live references would break. New mutable handles go in the MainContext registry, keyed by module id.
- **Node identity must be stable across renders.** Nodes live in once-initialized `useState` containers and are never replaced (only the per-note `oscillators` record changes). Note: `useState(new GainNode(...))` re-runs the constructor every render but keeps only the first value — the discarded nodes are harmless because they're never connected. Don't "fix" this into a render-scope variable.
- **Never set `param.value` directly.** Always schedule: `param.setTargetAtTime(value, audioContext.currentTime, 0.005)`. Direct assignment causes audible clicks/zipper noise. The stop sequence in `useOscillator.ts` (`cancelAndHoldAtTime` → `exponentialRampToValueAtTime(0.001)` → `setTimeout` stop/disconnect after the ramp) is deliberate click-avoidance — don't simplify it.
- **OscillatorNodes are one-shot.** `start()` once, never restart. One oscillator per held note, keyed by note name. Pitch changes go through `frequency`/`detune` params: each oscillator module owns one `ConstantSourceNode` (pitch + master detune, in cents) connected to all of its voices' `detune` params.
- **`.connect()` is cumulative and idempotent per source→target pair.** Effects re-call `connect` freely on re-runs; duplicates are ignored by the spec. Un-wiring requires an explicit `disconnect()` — there is no declarative reconciliation of the graph.
- **The MainContext registry is intentionally mutated in places** (e.g. `delete modules[moduleId]` on unmount). `ADD_MODULE` goes through dispatch so subscribers re-render; reads always yield live handles.
- **Beware stale closures in long-lived callbacks.** Callbacks stored in a `ModuleInterface` (e.g. `addInputs`) are captured on first render and close over first-render state; the effects keyed on that state do the corrective wiring. When a created-once closure needs fresh state, use the ref pattern from `useKeyboard.tsx` (`octaveRef`) rather than recreating the imperative object.
- **`get*` selectors are hooks.** `getModule`, `getNotes`, `getSynthGain`, etc. call `useAppSelector` internally despite the `get` prefix — Rules of Hooks apply (top level of components/hooks only).
- **Keep audio hooks in leaf components.** `useOscillator` is mounted in `AudioControl` (renders `null`) and `useMainAudio` in `MainAudioControl`, so note-triggered re-renders don't re-render whole panels. Don't hoist these hooks into visual components.
- **StrictMode is intentionally disabled** (`src/index.tsx`): double-invoked effects/renders would double-create and double-connect audio nodes. Don't re-enable it without making the bridge hooks idempotent.
- **Other imperative islands**: the d3 oscilloscope owns its `<svg>` subtree via ref (React must not render children into it); qwerty-hancock owns the keyboard DOM; Web MIDI listeners dispatch Redux actions (mutable → immutable direction).

## Testing

jsdom has no Web Audio/MIDI. `src/setupTests.ts` installs minimal class mocks (construction, params, connect/disconnect). They use plain methods, **not `jest.fn()`** — CRA's `resetMocks: true` would wipe mock implementations between tests.

Tests assert **graph topology, not sound**: re-wrap the node globals with recording subclasses that log nodes and `connect` edges, then check reachability. `rmRouting.test.tsx` is the template.

## Notes

- react-scripts 5.0.1 is EOL; remaining `npm audit` findings are CRA internals. The real fix is a Vite migration, not dependency patching.
