import { FC } from 'react';

import { MainContextProvider } from 'src/context/MainContext/MainContext';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import OscilloscopeComponent from '../oscilloscope/OscilloscopeComponent';
import MainAudioContent from './components/MainAudioContent/MainAudioContent';
import useMainAudio from './hooks/useMainAudio';

// import OscilloscopeComponent from '../oscilloscope/OscilloscopeComponent';

const MainAudioComponent: FC = () => {
    return (
        <MainContextProvider>
            <MainAudioControl />
            <MainAudioContent />
        </MainContextProvider>
    );
};

export default MainAudioComponent;

/**
 * DO MAIN CONTROL CONTEXT CHANGES HERE AND IN THE useMainAudio() HOOK!
 * To avoid re-render of everything when we change a main control (p.e. main gain).
 */
const MainAudioControl: FC = () => {
    useMainAudio();

    return (
        <>
            <h1>Main Audio</h1>
            {/* <OscilloscopeComponent /> */}
        </>
    );
};
