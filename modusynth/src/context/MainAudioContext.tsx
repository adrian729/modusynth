import { createContext } from 'react';

import { Props } from 'src/types/core';

export interface CTXState {
    audioContext: AudioContext;
    mainGain: GainNode;
}

export const CTX = createContext<{
    context: CTXState;
    addOscillator: (numOscs: number) => void;
} | null>(null);

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

const MainAudioContext = ({ children }: Props) => {
    const defaultContext: CTXState = {
        audioContext,
        mainGain,
    };

    const addOscillator = (numOscs: number): void => {
        let { currentTime } = audioContext;
        mainGain.gain.setValueAtTime(0.2 / Math.max(numOscs, 1), currentTime);
    };

    return (
        <CTX.Provider value={{ context: defaultContext, addOscillator }}>
            {children}
        </CTX.Provider>
    );
};
export default MainAudioContext;
