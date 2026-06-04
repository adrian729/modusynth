/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/preset-create-react-app',
        '@storybook/addon-links',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
};

module.exports = config;
