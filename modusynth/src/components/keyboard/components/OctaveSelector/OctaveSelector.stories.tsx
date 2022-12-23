import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { MainAudioContextProvider } from 'src/context/MainAudioContext';

import '../../../../app/App.scss';
import store from '../../../../app/store';
import '../../../../index.scss';
import OctaveSelector from './OctaveSelector';
import './OctaveSelector.scss';

export default {
    component: OctaveSelector,
    title: 'core/OctaveSelector',
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
