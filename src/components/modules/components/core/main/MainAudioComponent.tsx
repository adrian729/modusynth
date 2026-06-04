import { FC } from 'react';

import { MainContextProvider } from 'src/context/MainContext/MainContext';

// import OscilloscopeComponent from '../oscilloscope/OscilloscopeComponent';
import MainAudioContent from './components/MainAudioContent/MainAudioContent';
import useMainAudio from './hooks/useMainAudio';

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
 * ! DO MAIN CONTROL CONTEXT CHANGES HERE AND IN THE useMainAudio() HOOK
 * ? To avoid re-render of everything when we change a main control (p.e. main gain).
 */
const MainAudioControl: FC = () => {
    useMainAudio();

    return (
        <>
            <h1 className="mb-4 border-b border-border pb-2 font-display text-lg font-bold uppercase tracking-widest text-text">
                Main Audio
            </h1>
            {/* <OscilloscopeComponent /> */}
        </>
    );
};
