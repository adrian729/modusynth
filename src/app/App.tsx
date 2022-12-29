import { Provider } from 'react-redux';
import Section from 'src/components/common/core/section';
import Freezer from 'src/components/specific/freezer';
import OscillatorsPanel from 'src/components/specific/oscillatorsPanel';
import SynthPanel from 'src/components/specific/synthPanel/SynthPanel';
import { MainAudioContextProvider } from 'src/context/MainAudioContext';

import store from './store';

const App = () => {
    return (
        <Provider store={store}>
            <MainAudioContextProvider>
                <Section>
                    <h1 className="center__text">ModuSynth</h1>
                </Section>
                <Section>
                    <SynthPanel />
                </Section>
                <Section>
                    <Freezer />
                </Section>
                <Section>
                    <OscillatorsPanel />
                </Section>
            </MainAudioContextProvider>
        </Provider>
    );
};

export default App;
