import { useEffect, useState } from 'react';

import MainAudioContext from 'src/context/MainAudioContext';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getNotes,
    getOscillatorDrones,
    getOscillatorSettings,
} from 'src/reducers/synthSlice';
import { OscModule, OscModuleSettings } from 'src/types/oscillator';

import OscillatorModule from '../useOscillatorModule/useOscillatorModule';
import { OscState } from './types';

const updateGainControl = (
    gainControlGain: AudioParam,
    gain: number,
    mute: boolean,
    currentTime: number,
): void => {
    gainControlGain.cancelScheduledValues(currentTime);
    gainControlGain.setValueAtTime(mute ? 0.0 : gain, currentTime);
};

const useOscillator = (): void => {
    const {
        context: { audioContext, mainGainNode },
    } = useSafeContext(MainAudioContext);
    const { oscId } = useSafeContext(OscillatorContext);
    const [{ noteModules, droneModules, gainControl }, setOscState] =
        useState<OscState>({
            noteModules: {},
            droneModules: {},
            gainControl: audioContext.createGain(),
        });

    const activeNotes = getNotes();
    const settings = getOscillatorSettings(oscId);
    const { type, detune, gain, mute } = settings;
    const drones = getOscillatorDrones(oscId);

    /**
     * Setup gainControl connection and initial gain
     */
    useEffect((): void => {
        gainControl.gain.value = 0.5;
        gainControl.connect(mainGainNode);
    }, []);

    /**
     * Update gainControl on gain or mute change
     */
    useEffect((): void => {
        const { currentTime } = audioContext;
        updateGainControl(gainControl.gain, gain, mute, currentTime);
    }, [mute, gain]);

    /**
     * Update note modules on active notes or mute change
     */
    useEffect((): void => {
        setOscState((prevOscState) => {
            const newNoteModules = { ...prevOscState.noteModules };
            const { mute, ...oscSettings } = settings;

            // Remove inactive notes
            deleteInactive(
                newNoteModules,
                mute ? {} : activeNotes,
                droneModules,
            );

            if (!mute) {
                // Add active notes
                Object.keys(activeNotes)
                    .filter((key) => !newNoteModules[key])
                    .forEach((key) => {
                        newNoteModules[key] = OscillatorModule(
                            audioContext,
                            gainControl,
                            {
                                ...oscSettings,
                                frequency: activeNotes[key],
                                envelope: { ...oscSettings.envelope },
                            } as OscModuleSettings,
                        );
                    });
            }

            return { ...prevOscState, noteModules: newNoteModules };
        });
    }, [activeNotes, mute]);

    /**
     * Update drone modules and note modules on drone notes change
     */
    useEffect((): void => {
        setOscState((prevOscState) => {
            let { droneModules } = prevOscState;
            let newDroneModules = { ...droneModules };

            // Delete inactive drones
            deleteInactive(newDroneModules, drones, noteModules);

            // Add new drone modules references to the note modules
            Object.entries(noteModules)
                .filter(
                    ([key]) =>
                        !newDroneModules[key] && drones[key] !== undefined,
                )
                .forEach(([key, val]) => {
                    if (val !== undefined) {
                        newDroneModules[key] = val;
                    }
                });
            return { ...prevOscState, droneModules: newDroneModules };
        });
    }, [drones]);

    /**
     * Update osc settings
     */
    useEffect((): void => {
        Object.values(noteModules).map((val) =>
            val?.changeOscSettings({ type, detune }),
        );
    }, [settings]);
};
export default useOscillator;

const deleteInactive = (
    modules: Record<string, OscModule | undefined>,
    keyMapping: Record<string, any>,
    dependencyModules: Record<string, OscModule | undefined>,
): void => {
    Object.keys(modules)
        .filter((key) => !keyMapping[key])
        .forEach((key) => {
            if (modules[key] !== dependencyModules[key]) {
                modules[key]?.stop();
            }
            modules[key] = undefined;
            delete modules[key];
        });
};
