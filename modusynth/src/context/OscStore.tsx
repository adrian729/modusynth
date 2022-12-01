import { Dispatch, createContext, useReducer } from 'react';

import { OscActionKind, UPDATE_SETTINGS } from 'src/actions/oscActions';
import { ChildrenProps } from 'src/types/core';
import { Envelope, OscSettings } from 'src/types/oscillator';

export interface OscCTXState {
    settings: OscSettings;
}

interface Action {
    type: OscActionKind;
    payload: OscCTXState;
}

interface OscContextProps {
    oscCtxState: OscCTXState;
    dispatchOscState: Dispatch<any>;
}
export const OscCTX = createContext<OscContextProps | null>(null);

const reducer = (state: OscCTXState, action: Action) => {
    let { settings } = action.payload;
    switch (action.type) {
        case UPDATE_SETTINGS:
            return {
                ...state,
                settings,
            };
        default:
            // eslint-disable-next-line no-console
            console.log('reducer error, action: ', action);
            return { ...state };
    }
};

const defaultEnvelope: Envelope = {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
};

interface OscStoreProps extends ChildrenProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}
const OscStore = ({ children, type, mute }: OscStoreProps) => {
    const defaultSettings: OscSettings = {
        type: type || 'sine',
        detune: 0,
        envelope: defaultEnvelope,
        gain: 0.5,
        mute: mute || false,
    };

    const defaultCtxState = {
        settings: defaultSettings,
    };
    const [oscCtxState, dispatchOscState] = useReducer(
        reducer,
        defaultCtxState,
    );

    return (
        <OscCTX.Provider value={{ oscCtxState, dispatchOscState }}>
            {children}
        </OscCTX.Provider>
    );
};
export default OscStore;
