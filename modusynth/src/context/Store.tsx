import { createContext, useReducer, ReactNode, Dispatch } from 'react';

let audioContext = new AudioContext();
let out = audioContext.destination;

let mainGain = audioContext.createGain();
mainGain.gain.value = 0.2;
let filter = audioContext.createBiquadFilter();

mainGain.connect(filter);
filter.connect(out);

export interface CTXState {
    keyboardStartingNote: string;
    note?: string;
    freq?: number;
    audioContext: AudioContext;
    mainGain: GainNode;
    activeNotes: Record<string, number>;
    droneNotes: Record<string, number>;
}

export enum ActionKind {
    CHANGE_STARTING_NOTE = 'CHANGE_STARTING_NOTE',
    MAKE_OSC = 'MAKE_OSC',
    STOP_OSC = 'STOP_OSC',
    FREEZE_DRONES = 'FREEZE_DRONES',
    RELEASE_DRONES = 'RELEASE_DRONES',
}

interface Action {
    type: ActionKind;
    payload: CTXState;
}

const reducer = (state: CTXState, action: Action) => {
    let { note, freq, keyboardStartingNote } = action.payload;
    switch (action.type) {
        case ActionKind.CHANGE_STARTING_NOTE:
            return {
                ...state,
                keyboardStartingNote:
                    keyboardStartingNote ?? state.keyboardStartingNote,
                activeNotes: {},
            };
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
        case ActionKind.FREEZE_DRONES:
            return {
                ...state,
                droneNotes: { ...state.droneNotes, ...state.activeNotes },
            };
        case ActionKind.RELEASE_DRONES:
            return { ...state, droneNotes: {} };
        default:
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

const defaultState: CTXState = {
    keyboardStartingNote: 'C4',
    audioContext,
    mainGain,
    activeNotes: {},
    droneNotes: {},
};

const CTX = createContext<{
    state: CTXState;
    dispatch: Dispatch<any>;
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
