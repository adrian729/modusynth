import { useEffect, useState } from 'react';

import { CTX } from 'src/context/MainAudioContext';
import OscNode, { OscNodeProps, OscNodeType } from 'src/context/OscNode';
import { OscCTX } from 'src/context/oscContext';
import { getFreezeCount } from 'src/reducers/dronesSlice';
import { getNotes } from 'src/reducers/notesSlice';
import { OscSettings } from 'src/types/oscillator';

import useSafeContext from './useSafeContext';

interface OscState {
    noteNodes: Record<string, OscNodeType>;
    droneNodes: Record<string, OscNodeType>;
    gainControl: GainNode;
}

const useOscillator = (): void => {
    const { audioContext, mainGain } = useSafeContext(CTX);
    const { oscCtxState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { type, detune, envelope, gain, mute } = settings;
    const defaultState = {
        noteNodes: {},
        droneNodes: {},
        gainControl: audioContext.createGain(),
    };
    const [oscState, setOscState] = useState<OscState>(defaultState);
    let { noteNodes, gainControl } = oscState;
    const freezeCount = getFreezeCount();
    const activeNotes = getNotes();

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
        setOscState((prevOscState) => {
            let { noteNodes } = prevOscState;
            let newNoteNodes = updateNodes(
                audioContext,
                gainControl,
                noteNodes,
                activeNotes,
                settings,
            );
            return { ...prevOscState, noteNodes: newNoteNodes };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeNotes]);

    /**
     * Update nodes on droneNotes change
     */
    useEffect((): void => {
        setOscState((prevOscState) => {
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
                        oscNodeProps,
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
        Object.values(noteNodes).map((val) => val.changeSettings(settings));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);
};
export default useOscillator;

const removeInactive = (
    records: Record<string, OscNodeType>,
    activeKeys: Set<string>,
): void => {
    Object.keys(records)
        .filter((key) => !activeKeys.has(key))
        .forEach((key) => {
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
    oscNodeProps: OscNodeProps,
): void => {
    activeKeys
        .filter((key) => !records[key])
        .forEach((key) => {
            let oscNodePropsWithFreq: OscNodeProps = {
                ...oscNodeProps,
                frequency: activeRecords[key],
            };
            records[key] = OscNode(
                audioContext,
                connection,
                oscNodePropsWithFreq,
            );
        });
};

const updateNodes = (
    audioContext: AudioContext,
    connection: AudioNode,
    oldNodes: Record<string, OscNodeType>,
    notes: Record<string, number>,
    settings: OscSettings,
    addIfMuted: boolean = true,
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
            oscNodeProps,
        );
    }

    return newNodes;
};
