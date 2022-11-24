import React, { createContext, useReducer, ReactNode } from 'react';

let audioContext = new AudioContext();
let out = audioContext.destination;

let mainGain = audioContext.createGain();
mainGain.gain.value = 0.2;
let filter = audioContext.createBiquadFilter();

mainGain.connect(filter);
filter.connect(out);

interface CTXState {
    note?: string;
    freq?: number;
    audioContext: AudioContext;
    mainGain: GainNode;
    activeNotes: Record<string, number>;
}

export enum ActionKind {
    MAKE_OSC = 'MAKE_OSC',
    STOP_OSC = 'STOP_OSC',
}

interface Action {
    type: ActionKind;
    payload: CTXState;
}

const reducer = (state: CTXState, action: Action) => {
    let { note, freq } = action.payload;
    switch (action.type) {
        case ActionKind.MAKE_OSC:
            return {
                ...state,
                activeNotes:
                    note && freq
                        ? { ...state.activeNotes, [note]: freq }
                        : state.activeNotes,
            };
        case ActionKind.STOP_OSC:
            if (!note) return { ...state };
            let { [note]: _, ...newActiveNotes } = state.activeNotes;
            return {
                ...state,
                activeNotes: newActiveNotes,
            };
        default:
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

const defaultState: CTXState = { audioContext, mainGain, activeNotes: {} };

const CTX = createContext<{
    state: CTXState;
    dispatch: React.Dispatch<any>;
}>({
    state: defaultState,
    dispatch: () => null,
});
export { CTX };

const Store = ({ children }: { children?: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <CTX.Provider value={{ state, dispatch }}>{children}</CTX.Provider>;
};

export default Store;
