import React, { createContext, useReducer, ReactNode } from 'react';

let actx = new AudioContext();
let out = actx.destination;

let gain1 = actx.createGain();
gain1.gain.value = 0.2;
let filter = actx.createBiquadFilter();

gain1.connect(filter);
filter.connect(out);

interface CTXState {
    id?: string;
    note?: string;
    freq?: number;
}

export enum ActionKind {
    MAKE_OSC = 'MAKE_OSC',
    KILL_OSC = 'KILL_OSC',
}

interface Action {
    type: ActionKind;
    payload: CTXState;
}

const reducer = (state: CTXState, action: Action) => {
    let { id, note, freq } = action.payload;
    switch (action.type) {
        case ActionKind.MAKE_OSC:
            console.log('MAKE', note, freq);
            return { ...state };
        case ActionKind.KILL_OSC:
            console.log('KILL', note, freq);
            return { ...state };
        default:
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

const CTX = createContext<{
    state: CTXState;
    dispatch: React.Dispatch<Action>;
}>({
    state: { id: 'test' },
    dispatch: () => null,
});
export { CTX };

const Store = ({ children }: { children?: ReactNode }) => {
    console.log('hey');
    const [state, dispatch] = useReducer(reducer, {
        id: 'test',
    } as CTXState);
    return <CTX.Provider value={{ state, dispatch }}>{children}</CTX.Provider>;
};

export default Store;
