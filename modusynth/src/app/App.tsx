import { Provider } from 'react-redux';
import Section from 'src/components/01_core/section';
import Freezer from 'src/components/freezer';
import Keyboard from 'src/components/keyboard';
import OscillatorsPanel from 'src/components/oscillatorsPanel';
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
                    <Keyboard />
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
