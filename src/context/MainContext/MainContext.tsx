import { Dispatch, FC, createContext, useMemo, useReducer } from 'react';

import { Props } from 'src/types/core';

import { MainContextActionType } from './actions';

export interface ModuleInterface {
    outputNode: AudioNode;
    addInputs?: (moduleIds: string[]) => void; // add given moduleIds to this module main inputs
    addGainInputs?: (moduleIds: string[]) => void; // add given moduleIds to this module gain inputs
    addFreqInputs?: (moduleIds: string[]) => void; // add given moduleIds to this module frequency inputs
    // TODO: check if -> removeInputs?: (moduleIds: string[]) => void; // Remove moduleIds from any of this module inputs
}

export interface MainContextState {
    audioContext: AudioContext;
    mainConnection: AudioNode;
    modules: Record<string, ModuleInterface>;
}

interface MainContextInterface {
    state: MainContextState;
    dispatch: Dispatch<MainContextActionType>;
}
const MainContext = createContext<MainContextInterface | null>(null);
export default MainContext;

const reducer = (state: MainContextState, action: MainContextActionType) => {
    switch (action.type) {
        case 'ADD_MODULE': {
            const { id, module } = action.payload;
            const { modules } = state;
            const result = {
                ...state,
                modules: { ...modules, [id]: module },
            };
            return result;
        }
        default: {
            // eslint-disable-next-line no-console
            console.log('CTX reducer error, action: ', action);
            return { ...state };
        }
    }
};

export const MainContextProvider: FC<Props> = ({ children }) => {
    const audioContext = useMemo(() => new AudioContext(), []);
    const [state, dispatch] = useReducer(reducer, {
        audioContext: audioContext,
        mainConnection: new GainNode(audioContext, { gain: 1 }),
        modules: {}, // Pointers
    });

    return (
        <MainContext.Provider value={{ state, dispatch }}>
            {children}
        </MainContext.Provider>
    );
};
