import { createContext, useState } from 'react';

import { getActiveOscillatorsCount } from 'src/reducers/synthSlice';
import { Props } from 'src/types/core';

const audioContext = new AudioContext();
const out = audioContext.destination;

const mainGain = audioContext.createGain();
mainGain.gain.value = 0.2;
const filter = audioContext.createBiquadFilter();
mainGain.connect(filter);
filter.connect(out);
const compressor = audioContext.createDynamicsCompressor();
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
    const [prevActiveOscillatorsCount, setPrevActiveOscillatorsCount] =
        useState<number>(0);
    if (prevActiveOscillatorsCount !== activeOscillatorsCount) {
        mainGain.gain.value = Math.max(
            0.005,
            0.25 / Math.max(activeOscillatorsCount, 1),
        );
        setPrevActiveOscillatorsCount(activeOscillatorsCount);
    }

    return (
        <MainAudioContext.Provider value={{ context: defaultContext }}>
            {children}
        </MainAudioContext.Provider>
    );
};

export default MainAudioContext;
