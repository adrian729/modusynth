import { useEffect, useState } from 'react';

import { CTX } from 'src/context/MainAudioContext';
import { OscCTX } from 'src/context/OscContext';
import OscNode, { OscNodeType } from 'src/hooks/OscNode';
import {
    getNotes,
    getOscillatorDrones,
    getOscillatorSettings,
} from 'src/reducers/oscillatorsSlice';
import { OscNodeSettings } from 'src/types/oscillator';

import useSafeContext from './useSafeContext';

interface OscState {
    noteNodes: Record<string, OscNodeType | undefined>;
    droneNodes: Record<string, OscNodeType | undefined>;
    gainControl: GainNode;
}

const useOscillator = (): void => {
    const { context } = useSafeContext(CTX);
    const { audioContext, mainGain } = context;
    const { oscId } = useSafeContext(OscCTX);
    const activeNotes = getNotes();
    const settings = getOscillatorSettings(oscId);
    const { type, detune, gain, mute } = settings;
    const drones = getOscillatorDrones(oscId);
    const [{ noteNodes, droneNodes, gainControl }, setOscState] =
        useState<OscState>({
            noteNodes: {},
            droneNodes: {},
            gainControl: audioContext.createGain(),
        });

    /**
     * Setup gainControl connection and initial gain
     */
    useEffect((): void => {
        gainControl.gain.value = 0.5;
        gainControl.connect(mainGain);
    }, []);

    /**
     * Update gainControl on gain or mute change
     */
    useEffect((): void => {
        let { currentTime } = audioContext;
        gainControl.gain.cancelScheduledValues(currentTime);
        gainControl.gain.setValueAtTime(mute ? 0 : gain, currentTime);
    }, [mute, gain]);

    /**
     * Update note nodes on active notes change
     */
    useEffect((): void => {
        setOscState((prevOscState) => {
            const newNoteNodes = { ...prevOscState.noteNodes };
            const { mute, ...oscSettings } = settings;

            // Remove inactive notes
            deleteInactive(newNoteNodes, activeNotes, droneNodes);

            if (!mute) {
                // Add active notes
                Object.keys(activeNotes)
                    .filter((key) => !newNoteNodes[key])
                    .forEach((key) => {
                        newNoteNodes[key] = OscNode(audioContext, gainControl, {
                            ...oscSettings,
                            frequency: activeNotes[key],
                            envelope: { ...oscSettings.envelope },
                        } as OscNodeSettings);
                    });
            }

            return { ...prevOscState, noteNodes: newNoteNodes };
        });
    }, [activeNotes]);

    /**
     * Update drone nodes and note nodes on drone notes change
     */
    useEffect((): void => {
        setOscState((prevOscState) => {
            let { droneNodes } = prevOscState;
            let newDroneNodes = { ...droneNodes };

            // Delete inactive drones
            deleteInactive(newDroneNodes, drones, noteNodes);

            // Add new drone nodes references to the note nodes
            Object.entries(noteNodes)
                .filter(
                    ([key]) => !newDroneNodes[key] && drones[key] !== undefined,
                )
                .forEach(([key, val]) => {
                    if (val !== undefined) {
                        newDroneNodes[key] = val;
                    }
                });
            return { ...prevOscState, droneNodes: newDroneNodes };
        });
    }, [drones]);

    /**
     * Update osc settings
     */
    useEffect((): void => {
        Object.values(noteNodes).map((val) =>
            val?.changeSettings({ type, detune }),
        );
    }, [settings]);
};
export default useOscillator;

const deleteInactive = (
    nodes: Record<string, OscNodeType | undefined>,
    keyMapping: Record<string, any>,
    dependencyNodes: Record<string, OscNodeType | undefined>,
): void => {
    Object.keys(nodes)
        .filter((key) => !keyMapping[key])
        .forEach((key) => {
            if (nodes[key] !== dependencyNodes[key]) {
                nodes[key]?.stop();
            }
            nodes[key] = undefined;
            delete nodes[key];
        });
};
