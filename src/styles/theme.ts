/**
 * JS mirror of the design tokens in src/styles/tokens.css.
 *
 * For imperative consumers that can't read CSS custom properties at
 * config time: the QwertyHancock keyboard options and D3 .attr() colors.
 *
 * KEEP IN SYNC with src/styles/tokens.css.
 */
export const theme = {
    // surfaces
    surface: '#0b0e14',
    panel: '#141923',
    panel2: '#1b2230',
    border: '#232b3a',

    // text
    text: '#e6edf3',
    textDim: '#8b97a8',

    // accents
    accent: '#18ffff',
    accent2: '#00e5ff',
    accentDim: '#00b8d4',
    warning: '#ff5c57',

    // keyboard (QwertyHancock config)
    keyWhite: '#10151f',
    keyBlack: '#05070b',
    keyActive: '#18ffff',
    keyBorder: '#2a3346',

    // SVG grids / D3 wavetable editor
    grid: '#232b3a',
    gridStrong: '#33405a',
    bar: '#18ffff',
    guide: '#33405a',
    helper: '#00e5ff',
} as const;
