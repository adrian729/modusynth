import { createContext, useState } from 'react';

import { getActiveOscillatorsCount } from 'src/reducers/oscillatorsSlice';
import { getSynthGain } from 'src/reducers/synthSlice';
import { Props } from 'src/types/core';

const audioContext = new AudioContext();
const out = audioContext.destination;

const mainGainNode = audioContext.createGain();
mainGainNode.gain.value = 0.2;
const filter = audioContext.createBiquadFilter();
mainGainNode.connect(filter);
filter.connect(out);
const compressor = audioContext.createDynamicsCompressor();
filter.connect(compressor);
compressor.connect(out);

// TODO: add store for setGain and other settings
export interface MainAudioContextState {
    audioContext: AudioContext;
    connection: AudioNode;
}

const MainAudioContext = createContext<{
    context: MainAudioContextState;
} | null>(null);

interface Previous {
    prevMainGain: number;
    prevActiveOscCount: number;
}

const calculateGainValue = (gain: number, oscCount: number): number =>
    gain / Math.min(Math.max(oscCount, 1), 100);

export const MainAudioContextProvider = ({ children }: Props) => {
    const activeOscillatorsCount = getActiveOscillatorsCount();
    const mainGain = getSynthGain();
    const defaultContext: MainAudioContextState = {
        audioContext,
        connection: mainGainNode,
    };
    const [previous, setPrevious] = useState<Previous>({
        prevMainGain: 0.2,
        prevActiveOscCount: 1,
    });
    const { prevMainGain, prevActiveOscCount } = previous;

    if (
        prevActiveOscCount !== activeOscillatorsCount ||
        prevMainGain !== mainGain
    ) {
        mainGainNode.gain.value = calculateGainValue(
            mainGain,
            activeOscillatorsCount,
        );
        setPrevious({
            ...previous,
            prevMainGain: mainGain,
            prevActiveOscCount: activeOscillatorsCount,
        });
    }

    return (
        <MainAudioContext.Provider value={{ context: defaultContext }}>
            {children}
        </MainAudioContext.Provider>
    );
};

export default MainAudioContext;
