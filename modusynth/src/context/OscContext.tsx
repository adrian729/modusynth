import {
    createContext,
    useReducer,
    ReactNode,
    Dispatch,
    useEffect,
} from 'react';
import { INIT_OSC_GAIN, OscActionKind } from 'src/actions/oscActions';
import useSafeContext from 'src/hooks/useSafeContext';
import { Envelope, OscSettings } from 'src/types/oscillator';
import { CTX } from './MainStore';

export interface OscCTXState {
    audioContext?: AudioContext;
    oscGainControl?: GainNode;
    oscSettings: OscSettings;
}

interface Action {
    type: OscActionKind;
    payload: OscCTXState;
}

const reducer = (state: OscCTXState, action: Action) => {
    let {} = action.payload;
    switch (action.type) {
        // TODO: mirar com arreglar aixo, l'estat hauria de ser "immutable", pero si canviem el node
        // per una copia tot el que apunta a l'antic tururu....
        default:
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

interface OscContextProps {
    oscCtxState: OscCTXState;
    dispatchOscState: Dispatch<any>;
}
export const OscCTX = createContext<OscContextProps | null>(null);

const defaultEnvelope: Envelope = {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
};

const defaultOscSettings: OscSettings = {
    type: 'sine',
    detune: 0,
    envelope: defaultEnvelope,
    gain: 0.5,
    mute: false,
};

const OscStore = ({ children }: { children?: ReactNode }) => {
    const defaultState = {
        oscSettings: defaultOscSettings,
    };
    const [oscCtxState, dispatchOscState] = useReducer(reducer, defaultState);

    return (
        <OscCTX.Provider value={{ oscCtxState, dispatchOscState }}>
            {children}
        </OscCTX.Provider>
    );
};
export default OscStore;
