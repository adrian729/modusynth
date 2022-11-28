import {
    createContext,
    useReducer,
    ReactNode,
    Dispatch,
    useEffect,
    useState,
} from 'react';
import { OscActionKind, UPDATE_SETTINGS } from 'src/actions/oscActions';
import OscNode, { OscNodeProps, OscNodeType } from 'src/components/Osc/OscNode';
import useSafeContext from 'src/hooks/useSafeContext';
import { Envelope, OscSettings } from 'src/types/oscillator';
import { CTX } from './MainStore';

export interface OscCTXState {
    drones: Record<string, number>;
    settings: OscSettings;
    gainControl: GainNode;
}

export interface OscState {
    noteNodes: Record<string, OscNodeType>;
    droneNodes: Record<string, OscNodeType>;
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
const defaultSettings: OscSettings = {
    type: 'sine',
    detune: 0,
    envelope: defaultEnvelope,
    gain: 0.5,
    mute: false,
};

const defaultState = {
    noteNodes: {},
    droneNodes: {},
};

const OscStore = ({ children }: { children?: ReactNode }) => {
    const { state } = useSafeContext(CTX);
    let { audioContext, mainGain, activeNotes, freezeCount } = state;

    const defaultCtxState = {
        drones: {},
        settings: defaultSettings,
        gainControl: audioContext.createGain(),
    };
    const [oscCtxState, dispatchOscState] = useReducer(
        reducer,
        defaultCtxState
    );
    let { settings, gainControl } = oscCtxState;
    let { type, detune, envelope, gain, mute } = settings;

    const setOscState = useState<OscState>(defaultState)[1];

    /**
     * Setup gainControl connection and initial gain
     */
    useEffect((): void => {
        gainControl.gain.value = 0.5;
        gainControl.connect(mainGain);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Update gainControl on gain or mute change
     */
    useEffect((): void => {
        let { currentTime } = audioContext;
        gainControl.gain.cancelScheduledValues(currentTime);
        gainControl.gain.setValueAtTime(mute ? 0 : gain, currentTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mute, gain]);

    /**
     * Update nodes on activeNotes change
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let { noteNodes } = prevOscState;
            let newNoteNodes = updateNodes(
                audioContext,
                gainControl,
                noteNodes,
                activeNotes,
                settings
            );
            return { ...prevOscState, noteNodes: newNoteNodes };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeNotes]);

    /**
     * Update nodes on droneNotes change
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let { droneNodes } = prevOscState;
            let newDroneNodes = { ...droneNodes };
            if (freezeCount > 0) {
                if (!mute) {
                    let oscNodeProps: OscNodeProps = {
                        type,
                        frequency: 0,
                        detune,
                        envelope,
                    };

                    addActive(
                        newDroneNodes,
                        activeNotes,
                        Object.keys(activeNotes),
                        audioContext,
                        gainControl,
                        oscNodeProps
                    );
                }
            } else {
                removeInactive(newDroneNodes, new Set());
            }
            return { ...prevOscState, droneNodes: newDroneNodes };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [freezeCount]);

    /**
     * Update osc settings
     */
    useEffect((): void => {
        setOscState(prevOscState => {
            let newNodes = { ...prevOscState.noteNodes };
            Object.values(newNodes).map(val => val.changeSettings(settings));
            return { ...prevOscState, noteNodes: newNodes };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    return (
        <OscCTX.Provider value={{ oscCtxState, dispatchOscState }}>
            {children}
        </OscCTX.Provider>
    );
};
export default OscStore;

const removeInactive = (
    records: Record<string, OscNodeType>,
    activeKeys: Set<string>
): void => {
    Object.keys(records)
        .filter(key => !activeKeys.has(key))
        .forEach(key => {
            records[key].stop();
            delete records[key];
        });
};

const addActive = (
    records: Record<string, OscNodeType>,
    activeRecords: Record<string, number>,
    activeKeys: string[],
    audioContext: AudioContext,
    connection: AudioNode,
    oscNodeProps: OscNodeProps
): void => {
    activeKeys
        .filter(key => !records[key])
        .forEach(key => {
            let oscNodePropsWithFreq: OscNodeProps = {
                ...oscNodeProps,
                frequency: activeRecords[key],
            };
            records[key] = OscNode(
                audioContext,
                connection,
                oscNodePropsWithFreq
            );
        });
};

const updateNodes = (
    audioContext: AudioContext,
    connection: AudioNode,
    oldNodes: Record<string, OscNodeType>,
    notes: Record<string, number>,
    settings: OscSettings,
    addIfMuted: boolean = true
): Record<string, OscNodeType> => {
    let { type, detune, envelope, mute } = settings;
    let newNodes = { ...oldNodes };
    let noteKeys = Object.keys(notes);
    let noteKeysSet = new Set(noteKeys);

    removeInactive(newNodes, noteKeysSet);

    if (addIfMuted || !mute) {
        let oscNodeProps: OscNodeProps = {
            type,
            frequency: 0,
            detune,
            envelope,
        };
        addActive(
            newNodes,
            notes,
            noteKeys,
            audioContext,
            connection,
            oscNodeProps
        );
    }

    return newNodes;
};
