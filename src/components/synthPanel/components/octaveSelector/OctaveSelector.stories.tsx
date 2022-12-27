import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import store from 'src/app/store';
import { MainAudioContextProvider } from 'src/context/MainAudioContext';

import OctaveSelector from './OctaveSelector';

export default {
    component: OctaveSelector,
    title: 'components/synth/components/OctaveSelector',
} as ComponentMeta<typeof OctaveSelector>;

const OctaveSelectorStory: ComponentStory<typeof OctaveSelector> = () => (
    <Provider store={store}>
        <MainAudioContextProvider>
            <OctaveSelector />
        </MainAudioContextProvider>
    </Provider>
);

// Button Kind
export const Default = OctaveSelectorStory.bind({});
