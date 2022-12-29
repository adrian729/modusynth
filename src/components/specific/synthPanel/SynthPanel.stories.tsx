import { ReactElement } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';

import SynthPanel from './SynthPanel';

export default {
    component: SynthPanel,
    title: 'components/synth/SynthPanel',
} as ComponentMeta<typeof SynthPanel>;

const SynthPanelStory: ComponentStory<typeof SynthPanel> = (): ReactElement => (
    <Provider store={store}>
        <SynthPanel />
    </Provider>
);

export const Default = SynthPanelStory.bind({});
