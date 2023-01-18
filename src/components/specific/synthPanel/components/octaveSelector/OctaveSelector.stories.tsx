import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';

import OctaveSelector from './OctaveSelector';

export default {
    component: OctaveSelector,
    title: 'components/synth/components/OctaveSelector',
} as ComponentMeta<typeof OctaveSelector>;

const OctaveSelectorStory: ComponentStory<typeof OctaveSelector> = () => (
    <Provider store={store}>
        <OctaveSelector />
    </Provider>
);

// Button Kind
export const Default = OctaveSelectorStory.bind({});
