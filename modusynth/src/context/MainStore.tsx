import { createContext, useReducer, ReactNode, Dispatch } from 'react';
import {
    ActionKind,
    CHANGE_STARTING_NOTE,
    MAKE_OSC,
    STOP_OSC,
    FREEZE_DRONES,
    RELEASE_DRONES,
} from '../actions/synthActions';

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
    freezeCount: number;
}

interface Action {
    type: ActionKind;
    payload: CTXState;
}

const reducer = (state: CTXState, action: Action) => {
    let { note, freq, keyboardStartingNote } = action.payload;
    switch (action.type) {
        case CHANGE_STARTING_NOTE:
            return {
                ...state,
                keyboardStartingNote:
                    keyboardStartingNote ?? state.keyboardStartingNote,
                activeNotes: {},
            };
        case MAKE_OSC:
            return {
                ...state,
                activeNotes:
                    note && freq
                        ? { ...state.activeNotes, [note]: freq }
                        : state.activeNotes,
            };
        case STOP_OSC:
            if (!note) return { ...state };
            let { [note]: _, ...newActiveNotes } = state.activeNotes;
            return {
                ...state,
                activeNotes: newActiveNotes,
            };
        case FREEZE_DRONES:
            return {
                ...state,
                freezeCount: state.freezeCount + 1,
            };
        case RELEASE_DRONES:
            return { ...state, freezeCount: 0 };
        default:
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

interface ContextProps {
    state: CTXState;
    dispatch: Dispatch<any>;
}
export const CTX = createContext<ContextProps | null>(null);

const defaultState: CTXState = {
    keyboardStartingNote: 'C4',
    audioContext,
    mainGain,
    activeNotes: {},
    freezeCount: 0,
};
const MainStore = ({ children }: { children?: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <CTX.Provider value={{ state, dispatch }}>{children}</CTX.Provider>;
};
export default MainStore;
