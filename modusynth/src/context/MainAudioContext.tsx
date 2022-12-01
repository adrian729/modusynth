import { ReactNode, createContext } from 'react';

export interface CTXState {
    audioContext: AudioContext;
    mainGain: GainNode;
}

export const CTX = createContext<CTXState | null>(null);

let audioContext = new AudioContext();
let out = audioContext.destination;

let mainGain = audioContext.createGain();
mainGain.gain.value = 0.2;
let filter = audioContext.createBiquadFilter();

mainGain.connect(filter);
filter.connect(out);

const MainAudioContext = ({ children }: { children?: ReactNode }) => {
    const defaultContext: CTXState = {
        audioContext,
        mainGain,
    };
    return <CTX.Provider value={defaultContext}>{children}</CTX.Provider>;
};
export default MainAudioContext;
