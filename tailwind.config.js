/** @type {import('tailwindcss').Config} */
// CRA 5 activates Tailwind solely on this file's existence — no postcss.config.js
// is needed (react-scripts hardcodes its PostCSS plugin list and ignores one).
// Keep tailwindcss pinned to v3: CRA loads the plugin by the name 'tailwindcss',
// which v4 renamed to '@tailwindcss/postcss'.
module.exports = {
    content: ['./src/**/*.{ts,tsx}', './public/index.html'],
    // The legacy layout <Container> component uses the class name "container";
    // disable Tailwind's same-named core utility (width:100% + breakpoint
    // max-widths) so it doesn't stretch those elements.
    corePlugins: {
        container: false,
    },
    // Dark-only theme: the dark palette IS the default theme.
    // No darkMode key, no dark: variants.
    theme: {
        extend: {
            colors: {
                // NOTE: var()-based colors can't take /opacity modifiers
                // (e.g. bg-accent/40). Use shadow-glow or explicit rgba instead.
                surface: 'var(--surface)',
                panel: 'var(--panel)',
                'panel-2': 'var(--panel-2)',
                border: 'var(--border)',
                text: 'var(--text)',
                'text-dim': 'var(--text-dim)',
                accent: 'var(--accent)',
                'accent-2': 'var(--accent-2)',
                'accent-dim': 'var(--accent-dim)',
                warning: 'var(--warning)',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'Lucida Console', 'monospace'],
                display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 0 1px rgba(24, 255, 255, 0.35), 0 0 12px rgba(24, 255, 255, 0.25)',
                panel: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6)',
            },
        },
    },
    plugins: [],
};
