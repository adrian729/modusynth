import { ReactElement } from 'react';

import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';

import SynthPanel from './SynthPanel';

export default {
    component: SynthPanel,
    title: 'components/synth/SynthPanel',
} as Meta<typeof SynthPanel>;

const SynthPanelStory: StoryFn<typeof SynthPanel> = (): ReactElement => (
    <Provider store={store}>
        <SynthPanel />
    </Provider>
);

export const Default = SynthPanelStory.bind({});
