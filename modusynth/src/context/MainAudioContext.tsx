import { createContext, useEffect } from 'react';

import { getActiveOscillatorsCount } from 'src/reducers/synthSlice';
import { Props } from 'src/types/core';

let audioContext = new AudioContext();
let out = audioContext.destination;

let mainGain = audioContext.createGain();
mainGain.gain.value = 0.2;
let filter = audioContext.createBiquadFilter();
mainGain.connect(filter);
filter.connect(out);
let compressor = audioContext.createDynamicsCompressor();
filter.connect(compressor);
compressor.connect(out);

export interface MainAudioContextState {
    audioContext: AudioContext;
    mainGain: GainNode;
}

const MainAudioContext = createContext<{
    context: MainAudioContextState;
} | null>(null);

export const MainAudioContextProvider = ({ children }: Props) => {
    const activeOscillatorsCount = getActiveOscillatorsCount();
    const defaultContext: MainAudioContextState = {
        audioContext,
        mainGain,
    };

    useEffect(() => {
        const { currentTime } = audioContext;
        mainGain.gain.setValueAtTime(
            0.25 / Math.max(activeOscillatorsCount, 1),
            currentTime,
        );
    }, [activeOscillatorsCount]);

    return (
        <MainAudioContext.Provider value={{ context: defaultContext }}>
            {children}
        </MainAudioContext.Provider>
    );
};

export default MainAudioContext;
