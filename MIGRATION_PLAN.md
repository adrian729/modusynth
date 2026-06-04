# Modusynth: CRA → Vite migration + Tailwind 4 + de-SCSS + cleanup

## Step 0 — persist this plan in the repo

Copy this plan verbatim to `/Users/adriansanchezalbanell/projects/modusynth/MIGRATION_PLAN.md` as the first implementation action, and work from it (check items off as they land).

## Final step — remove the plan file

When implementation is complete and verified (all Verification items pass), **delete `MIGRATION_PLAN.md`** — it must not remain in the repo after the migration is done.

## Context

Modusynth runs on EOL react-scripts 5 (CRA). The goals, per user decisions:
1. **Migrate CRA → Vite**, modeled on `~/projects/thalia` (only hard requirement: GitHub Pages hosting at `https://adrian729.github.io/modusynth/` keeps working).
2. **Remove Storybook** entirely.
3. **Upgrade Tailwind 3 → 4** (CSS-first config, `@tailwindcss/vite`, like thalia).
4. **Convert all SCSS to Tailwind** (utilities + plain CSS where pseudo-elements force it), drop the `sass` dep.
5. **Drop tests for now**: remove Jest config, the 3 test files, `setupTests.ts`, testing deps. (Resurrectable from git when adding Vitest later.)
6. **Remove CRA leftovers**: web-vitals/reportWebVitals, gh-pages dep + deploy scripts + `homepage`, PWA manifest + logo192/512 (keep favicon.ico, robots.txt).
7. **Global `user-select: none`** — the page is a click-to-play instrument; re-enable selection on `input`/`textarea`.

Keep: React 18, RTK 1.9, react-redux 8 (no React 19 upgrade). StrictMode stays **disabled** (double effects break the Web Audio bridge — CLAUDE.md invariant).

Note: working tree has uncommitted in-progress work (appInfo, oscillator refactors). This migration touches build config + styles; no conflicts expected, but commit/stash nothing without asking.

## Verified facts (checked, not assumed)

- **48 files** use absolute imports `from 'src/...'` (CRA `baseUrl` behavior) → Vite needs a `src` alias + tsconfig `paths`.
- `.env.local` contains only `PORT=4400` → move to `server.port` in vite.config, delete file.
- **10** `*.stories.tsx` files exist.
- `public/index.html:32` loads `https://unpkg.com/input-knob` — dead (no usage in src) → drop.
- `outline-none` (renamed in TW4) appears 3×: `src/styles/tailwind.css:47,61` + `src/components/specific/appInfo/AppInfo.tsx:61`.
- No other TW4-breaking utilities in use (no `ring`, no `shadow-sm`/`rounded-sm` scales, no `*-opacity-*`; all `border` usages have explicit `border-border`).
- `TestingBox` has no consumers outside stories/tests → delete the whole `src/components/testUtils/testingBox/` dir.
- No CSS modules, no `REACT_APP_*` env vars, no SVG ReactComponent imports, no router.
- `@types/webmidi` provides the global `WebMidi.*` namespace used by `useMidiDevice.ts`; current tsconfig has explicit `types` array → new tsconfig must keep `"webmidi"` in `types`.

---

## Part A — Build system migration (CRA → Vite)

### A1. Deletions

- `.storybook/` (main.js, preview.js)
- All 10 `src/**/*.stories.tsx`
- `src/setupTests.ts`, `src/app/App.test.tsx`, `src/components/modules/components/modulators/modulator/rmRouting.test.tsx`, `src/components/specific/synthPanel/hooks/useMidiDevice.test.tsx`
- `src/reportWebVitals.ts`, `src/react-app-env.d.ts`
- `src/components/testUtils/testingBox/` (orphaned)
- `src/components/common/core/section/` (whole dir — audit verified: zero consumers, and its styles.scss is never even imported; the `Section` in AppInfo.tsx is a different, inline component)
- `public/index.html` (moves to root), `public/manifest.json`, `public/logo192.png`, `public/logo512.png`
- `.env.local`, `.eslintrc.json` (replaced by flat config)

### A2. `package.json` rewrite

Add `"type": "module"`. Remove fields: `homepage`, `browserslist`, `jest`, `eslintConfig`, `types`, `overrides` (CRA-vuln patches for nth-check/serialize-javascript/postcss — tree no longer contains them once react-scripts/webpack/storybook are gone; verify with `npm ls nth-check serialize-javascript`).

Scripts:
```json
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview",
"lint": "eslint .",
"prettier-format": "prettier --write \"./**/*.{js,jsx,ts,tsx,json}\""
```

**Remove deps**: `react-scripts`, `webpack`, `sass`, `web-vitals`, `gh-pages`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`, `@types/react-redux` (stale v7; react-redux 8 bundles types), all `@storybook/*`, `storybook`, `eslint-plugin-storybook`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` (→ unified `typescript-eslint`).

**Add devDeps**: `vite@^6.1`, `@vitejs/plugin-react@^4.3` (Babel-based, React 18 OK), `tailwindcss@^4` + `@tailwindcss/vite@^4`, `typescript@~5.7` (from 4.9), `@eslint/js@^9`, `eslint@^9`, `typescript-eslint@^8`, `eslint-plugin-react@^7.34` (≥7.34 required for flat-config `configs.flat` export; was previously transitive via react-scripts), `eslint-plugin-react-hooks@^5`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y@^6.10` (≥6.8 required for `flatConfigs` export; keep — interactive-controls app), `eslint-config-prettier@^9`, `globals`. Bump `@types/node` 16 → 20.

**Keep prettier 2.8 + `@trivago/prettier-plugin-sort-imports@4`** (lowest churn; prettier 3 would force plugin v5 + repo-wide reformat). Keep `tabWidth: 4`. **Do NOT add `eslint-plugin-prettier`** (audit finding: v5 peer-requires prettier ≥3, v4 doesn't support ESLint 9 flat config — incompatible either way with prettier 2.8). Instead: `eslint-config-prettier` only (disables conflicting rules, works with any prettier version); formatting stays a separate concern via `npm run prettier-format`. Drop the old `eslint-plugin-prettier@4.2.1` dep. Keep all runtime deps (d3, lodash, classnames, usehooks-ts, qwerty-hancock, @mohayonao/wave-tables, @fontsource/*) — all verified in use.

Keep `.npmrc` `legacy-peer-deps=true` (mixed-version ecosystem + github-tarball dep).

### A3. `vite.config.ts` (new, root)

```ts
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/modusynth/',
    plugins: [react(), tailwindcss()],
    resolve: { alias: { src: path.resolve(__dirname, 'src') } },
    server: { port: 4400 },
});
```

The `src` alias is **mandatory** (48 files break without it).

### A4. Root `index.html` (new; replaces `public/index.html`)

Standard Vite entry: no `%PUBLIC_URL%`, no manifest/apple-touch-icon links, **no unpkg input-knob script**, `<link rel="icon" href="/favicon.ico" />` (root-relative — Vite rewrites public-dir asset URLs in index.html against `base` at build time; do NOT hardcode `/modusynth/`, it would break `vite preview` portability and base changes), **keep `<meta name="viewport">` and `<meta name="theme-color" content="#000000">`**, update `<meta name="description">` (currently CRA boilerplate), title `ModuSynth`, `<div id="root">`, `<script type="module" src="/src/index.tsx">` (keep existing entry filename).

### A5. tsconfig restructure (mirror thalia's project references)

- `tsconfig.json`: `{ "files": [], "references": [tsconfig.app.json, tsconfig.node.json] }`
- `tsconfig.app.json`: target ES2020 (bump from es5 — a real behavioral jump, but no generators/iterator-reliant down-compilation found; makes `downlevelIteration` moot), lib ES2020/DOM/DOM.Iterable, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `noEmit` (drops current `outDir`/`declaration`/`declarationMap` — incompatible with noEmit, app doesn't need them), **carry over `esModuleInterop: true`** (default imports like `import ReactDOM from 'react-dom/client'` depend on it), `isolatedModules`, `strict: true` (already on today), **`"baseUrl": ".", "paths": { "src/*": ["src/*"] }`**, **`"types": ["node", "webmidi", "vite/client"]`** (drop jest/testing-library entries; webmidi must stay or `useMidiDevice.ts` fails; an explicit `types` array disables automatic @types inclusion, so list `vite/client` here explicitly rather than relying only on the vite-env.d.ts triple-slash — belt and suspenders for the CSS side-effect imports). **Do NOT enable** `noUnusedLocals`/`noUnusedParameters`/`noUncheckedSideEffectImports` (thalia has them; here they'd flood errors — ESLint covers unused vars). Include: `["src"]`.
- `tsconfig.node.json`: thalia's verbatim (ES2022, includes only `vite.config.ts`).
- Keep ambient shims: `src/types/d3.d.ts`, `src/types/waveTables.d.ts`, `quertyhancock.d.ts`. **Do not add `@types/d3`** (would surface new strict errors).

### A6. `src/vite-env.d.ts` (new)

`/// <reference types="vite/client" />`

### A7. `src/index.tsx`

Remove `reportWebVitals` import + call **including** the CRA explainer comment block and the now-orphaned `// eslint-disable-next-line no-console` above the call (audit: leaving it triggers unused-disable noise). Keep the commented-out StrictMode exactly as is. Keep font + `./styles/tailwind.css` imports.

### A8. `eslint.config.js` (new flat config)

Thalia-style `tseslint.config(...)` with: `js.configs.recommended`, `tseslint.configs.recommended` (not `strict` — lowest churn), then — **note thalia is NOT a valid template for these two; it doesn't use them** — `react.configs.flat.recommended` (eslint-plugin-react ≥7.34 flat-config export) and `jsxA11y.flatConfigs.recommended` (≥6.8), plus react-hooks + react-refresh plugins, `eslintConfigPrettier` last (config only — no eslint-plugin-prettier, see A2). Preserve modusynth conventions: `no-console: warn`, `@typescript-eslint/no-unused-vars` with `varsIgnorePattern/argsIgnorePattern: '^_'`, `react/react-in-jsx-scope: off`, `settings: { react: { version: 'detect' } }`. Ignores: `dist`.

### A9. Prettier config

`.prettierrc.js` uses `module.exports` → breaks under `"type": "module"`. Rename to **`.prettierrc.cjs`** and add explicit `"plugins": ["@trivago/prettier-plugin-sort-imports"]`.

### A10. Deploy + housekeeping

- `.github/workflows/deploy.yml`: change artifact `path: build` → `path: dist`. Everything else (Node 20, npm ci, upload-pages-artifact@v3, deploy-pages@v4, permissions, concurrency) stays.
- `.gitignore`: `/build` → `/dist`; drop `/storybook-static`.

---

## Part B — Tailwind 4 + SCSS → Tailwind conversion

### B1. `src/styles/tailwind.css` rewrite (TW4 CSS-first)

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
    --color-surface: var(--surface);
    --color-panel: var(--panel);
    --color-panel-2: var(--panel-2);
    --color-border: var(--border);
    --color-text: var(--text);
    --color-text-dim: var(--text-dim);
    --color-accent: var(--accent);
    --color-accent-2: var(--accent-2);
    --color-accent-dim: var(--accent-dim);
    --color-warning: var(--warning);
    --font-mono: "JetBrains Mono", "Lucida Console", monospace;
    --font-display: "Space Grotesk", system-ui, sans-serif;
    --shadow-glow: 0 0 0 1px rgba(24, 255, 255, 0.35), 0 0 12px rgba(24, 255, 255, 0.25);
    --shadow-panel: 0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6);
}
```

(`inline` so utilities emit `var(--surface)` literally — preserves v3 behavior incl. the no-opacity-modifier caveat. Values must match the current `tailwind.config.js` theme.)

- `@layer base` body: replace `theme(...)` calls with `var(--surface)` / `var(--text)` / `var(--font-mono)`.
- **user-select** in `@layer base`:
  ```css
  html { -webkit-user-select: none; user-select: none; }
  input, textarea { -webkit-user-select: text; user-select: text; }
  ```
  (On `html` so it covers the AppInfo portal; inputs re-enabled for knob number input, freq fields, etc. This also resolves the existing TODO at `Knob.tsx:152` "while moving avoid selecting text". Audit confirmed qwerty-hancock renders div-based keys — no inputs — and `user-select: none` doesn't block pointer events, so keyboard/knob-drag/d3-drag are unaffected. Per the requirement, the AppInfo help-modal prose also becomes non-selectable — intentional, all text is non-selectable.)
- `@layer components`: keep `.module-card*`, `.control-*`, `.segmented`, `.sect*` blocks (shared primitives used across ~12 files) — only change `outline-none` → **`outline-hidden`** (2×, lines 47/61). Move `.button` rules here from `core/button/styles.scss` (needed because `.segmented .button` descendant selectors depend on the literal class):
  ```css
  .button {
      @apply m-2 max-w-40 cursor-pointer rounded border border-border bg-panel-2 px-[0.9rem] py-[0.4rem] text-[0.8rem] tracking-[0.04em] text-text;
      transition: color 0.12s ease, background-color 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; /* keep literal — audit: duration-100 (0.1s) + ease-out ≠ the SCSS 0.12s ease */
  }
  .button:hover { @apply border-accent-dim; }
  .button.active { @apply border-accent text-accent shadow-glow; background-color: rgba(24, 255, 255, 0.12); }
  .button.warning { @apply border-warning text-warning; background-color: rgba(255, 92, 87, 0.12); }
  .button.warning:hover { @apply border-warning; }
  ```
- Delete `.testborder` (Storybook-only).
- **Delete `tailwind.config.js`** (fully replaced; the `corePlugins.container` disable becomes moot — see B3 Container).
- `src/styles/tokens.css` and `src/styles/theme.ts`: **unchanged** (token source; JS mirror used by d3/qwerty-hancock). (`--glow` in tokens.css loses its last CSS consumer once button SCSS moves to `shadow-glow` — harmless, optional cleanup.)
- TW4 breaking-change audit (done): `outline-none` (3×: tailwind.css:47,61 + `AppInfo.tsx:61`) → `outline-hidden`, **and** the leading-`!` important prefix at `OscillatorComponent.tsx:75` (`!m-0 !px-2 !py-0.5 !text-[0.65rem]`) → TW4 trailing syntax `m-0! px-2! py-0.5! text-[0.65rem]!` (v4 moved the important modifier to the end). Nothing else applies (no ring/shadow-sm/rounded-sm/*-opacity usage).

### B2. Hard files → colocated plain CSS (pseudo-elements can't be utilities)

- **`core/knob/styles.scss` → `core/knob/styles.css`**: styles `data`, `label::before`, `svg path:*-of-type`, and `transform: rotate(calc(1deg * var(--knob-deg)))` driven imperatively by `Knob.tsx`. Resolve SCSS vars to literals: `$knob-d`→4em, `$knob-border-w`/`$knob-ind-w`→0.3em; colors already `var(--*)`. SCSS math → literal `calc()` (e.g. `calc(4em / 0.75)`). Keep `.knob`/`.small`/`.big` class contract — **no TSX className changes**, just the import extension.
- **`core/slider/styles.scss` (109 lines) → `core/slider/styles.css`**: `::-webkit-slider-runnable-track`/`::-webkit-slider-thumb` must stay CSS. Keep BEM classes (`slider__header` etc. — referenced in TSX, plus `Slider.tsx` imperatively sets style.height/transform; `$thumb-width: 1.5rem` is mirrored as `1.5 / 2` in JS — keep in sync, no change). Resolve vars: `$slider-height`→10rem, `$track-width`→0.3rem, `$thumb-width`→1.5rem, `$thumb-height`→2.6rem, `$outline-offset`→0.15rem. Tighten the bare `input[type='range']` selector to `.slider input[type='range']` (behavior-preserving scoping).

### B3. Mechanical SCSS → utility conversions (delete .scss, update TSX)

| File | Conversion |
|---|---|
| `core/box/styles.scss` + `Box.tsx` | `.box` → `rounded-lg border border-border bg-panel shadow-panel` in `classNames(...)` |
| `core/section/` | **Delete whole dir** (audit: component has zero consumers AND its styles.scss was never imported — the `.section` flex rules are inert today; converting them would *add* layout the live app never had) |
| `layouts/container/styles.scss` + `Container.tsx` | `.container` → `px-8 py-4 [&>*]:mb-8 [&>*:last-child]:mb-0`; `center-content` → `flex flex-col flex-nowrap items-center justify-center` via conditional classnames. **Removes the literal `container` class** → resolves the TW4 container-utility clash (no `corePlugins` disable possible in v4) |
| `layouts/list/styles.scss` + `List.tsx` | base `flex flex-wrap` **without gap utilities** (audit: a consumer `gap-0` can't reliably override — `gap-0` is the shorthand, `gap-x-*`/`gap-y-*` are longhands and longhands win regardless of class order); `direction === 'row' ? 'flex-row' : 'flex-col'` (default column preserved); `alignment === 'center' && 'items-center justify-center'`. List has exactly 2 consumers (verified): **`Freezer.tsx:19`** gets the old gap explicitly via `className="gap-x-8 gap-y-4"` (= SCSS `gap: 1rem 2rem`); **OctaveSelector** gets none (its SCSS overrode to `gap: 0`) |
| `combinator/styles.scss` + `CombinatorComponent.tsx` | `.combinator` → `flex flex-row flex-wrap gap-4` |
| `oscillator/styles.scss` + `OscillatorComponent.tsx` | `.oscillator` → `flex w-fit min-w-[300px] max-w-full flex-col flex-nowrap overflow-hidden rounded-lg border border-border bg-panel shadow-panel`; `__header` → `flex items-center justify-between border-b border-border bg-panel-2 px-[0.6rem] py-[0.4rem] text-[0.7rem] uppercase tracking-[0.1em] text-accent`; `__body` → `flex flex-row flex-wrap overflow-hidden`; `__item` → `-mt-px -ml-px border-t border-l border-border p-2`; `--params` → `flex-[1_1_18rem]`; `--wave` → `flex-[0_1_auto]` (all values audit-verified against working tree). Also fix the mute button's `!`-prefix utilities at line 75 → trailing `!` (TW4 syntax, see B1). **Note: this file has uncommitted changes — convert from its current working-tree state** |
| `synthPanel/styles.scss` + `SynthPanel.tsx` | `synthPanel` → `w-fit` (keep `module-card`) |
| `octaveSelector/styles.scss` + `OctaveSelector.tsx` | wrapper → keep `segmented`, add `w-fit mx-auto mb-[0.4rem]` (no gap utility needed — List no longer emits one, see List row); item → `text-[x-small]` (audit: `x-small` is an absolute-size keyword, NOT 0.625rem — pass it through as arbitrary value for exact parity); **keep `id={...}`** (click handler parses it) |
| `synthPadPanel/styles.scss` + `SynthPadPanel.tsx` | only live rule is `.synthpad__grid:hover{cursor:crosshair}` → add `cursor-crosshair`; `.synth-pad` block is dead |
| `styles/common/01_settings.scss`, `styles/common/index.scss`, `testUtils/testingBox/styles.scss` | delete (orphaned once testingBox dir is removed) |

Also: `AppInfo.tsx:61` `outline-none` → `outline-hidden` (in working tree, untracked dir).

### Sequencing note

`sass` removal and `.scss` deletion must land together with Part A's package.json (single atomic change is fine since this is one PR): if any `.scss` import survives while `sass` is gone, `vite build` fails — final grep `grep -rn "\.scss" src` must be empty.

---

## Verification

1. `npm install` clean; `npm ls react-scripts webpack sass` → empty; `npm ls nth-check serialize-javascript postcss` → no vulnerable versions remaining (postcss especially — it stays in the tree via Vite/Tailwind tooling; confirm it resolves ≥8.4.31 without the dropped override).
2. `npx tsc -b` passes (validates TS 5.7 upgrade, `paths`, `types: ["node","webmidi"]` → `useMidiDevice.ts` compiles, d3/waveTables shims).
3. `npm run lint` runs flat config without errors.
4. `npm run dev` → app at `http://localhost:4400/modusynth/`; no unresolved `src/...` imports; fonts + favicon load.
5. **Functional audio** (the real test, per CLAUDE.md "violating these breaks sound, not tests"): press keys → notes play and release cleanly (no clicks); knobs/sliders change params audibly; oscilloscope + wavetable SVG render (d3); octave selector works; freezer FREEZE/RELEASE; MIDI if device available. Confirm no doubled oscillators (StrictMode still off).
6. **Visual parity sweep** (riskiest: knob + slider literal-calc translations): compare synth panel, oscillator module (−1px dividers, header bar), sliders (thumb gradient, vertical rotation, double-click reset), knobs in all 3 sizes (`--knob-deg` rotation, arc svg, data labels), octave selector segmented borders, `.sect--gen/--rm/--fm` accent borders, AppInfo modal.
7. **user-select**: drag across labels/headers → nothing selects; knob number input and freq `control-input` fields still allow selection/editing.
8. `npm run build` → `dist/` with `/modusynth/`-prefixed assets; `npm run preview` → full audio re-check on the built bundle.
9. Push → deploy.yml publishes `dist/`; `https://adrian729.github.io/modusynth/` loads with no 404s.
