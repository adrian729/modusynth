import { createContext, useEffect } from 'react';

import { getActiveOscillatorsCount } from 'src/reducers/oscillators/oscillatorsSlice';
import { Props } from 'src/types/core';

import { MainAudioCTXState } from './types';

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

export const CTX = createContext<{
    context: MainAudioCTXState;
} | null>(null);

const MainAudioCTX = ({ children }: Props) => {
    const activeOscillatorsCount = getActiveOscillatorsCount();
    const defaultContext: MainAudioCTXState = {
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
        <CTX.Provider value={{ context: defaultContext }}>
            {children}
        </CTX.Provider>
    );
};
export default MainAudioCTX;
