import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';

import '../src/styles/tailwind.css';

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
    parameters: {
        backgrounds: {
            default: 'surface',
            values: [
                { name: 'surface', value: '#0b0e14' },
                { name: 'panel', value: '#141923' },
            ],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
