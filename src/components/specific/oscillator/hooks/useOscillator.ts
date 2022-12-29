/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import _ from 'lodash';
import MainAudioContext from 'src/context/MainAudioContext';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    Note,
    getNotes,
    getOscillatorDrones,
    getOscillatorSettings,
} from 'src/reducers/oscillatorsSlice';
import { getOctave, getSynthDetune } from 'src/reducers/synthSlice';

import OscillatorModule, {
    OscillatorModuleParams,
    OscillatorModuleType,
    UpdateParams,
} from './OscillatorModule';

const useOscillator = (): void => {
    const {
        context: { audioContext, connection },
    } = useSafeContext(MainAudioContext);
    const { oscId } = useSafeContext(OscillatorContext);
    const settings = getOscillatorSettings(oscId);
    const { type, detune, envelope, gain, mute } = settings;
    const synthDetune = getSynthDetune();
    const activeNotes = getNotes();
    const drones = getOscillatorDrones(oscId);
    const octave = getOctave();

    const [gainControl, setGainControl] = useState<GainNode>();
    const [noteModules, setNoteModules] = useState<
        Record<string, OscillatorModuleType | undefined>
    >({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [droneModules, setDroneModules] = useState<
        Record<string, OscillatorModuleType | undefined>
    >({});

    const [prevGain, setPrevGain] = useState<number>(gain);
    const [prevMute, setPrevMute] = useState<boolean>(mute);
    const [prevNotes, setPrevNotes] =
        useState<Record<string, Note>>(activeNotes);
    const [prevDrones, setPrevDrones] = useState<Record<string, Note>>(drones);
    const [prevModuleSettings, setPrevModuleSettings] = useState<UpdateParams>({
        type,
        detune,
        synthDetune,
        octave,
    });

    /**
     * Setup gainControl connection and initial gain
     */
    if (!gainControl) {
        const newGainControl = audioContext.createGain();
        newGainControl.gain.value = gain;
        newGainControl.connect(connection);
        setGainControl(newGainControl);
    }

    if (prevGain !== gain) {
        setPrevGain(gain);
    }

    if (prevMute !== mute) {
        setPrevMute(mute);
    }

    /**
     * Update gainControl on gain or mute change
     */
    if (gainControl && (prevGain !== gain || prevMute !== mute)) {
        const { currentTime } = audioContext;
        updateGainControl(gainControl.gain, gain, mute, currentTime);
    }

    /**
     * Update note modules on active notes or mute change
     */
    if (activeNotes !== prevNotes || mute !== prevMute) {
        setNoteModules((prevNoteModules) => {
            // DON'T do deep copy, we need to keep same instance for drones and notes.
            const newNoteModules = { ...prevNoteModules };
            deleteInactive(
                newNoteModules,
                mute ? {} : activeNotes,
                droneModules,
            );
            if (!mute) {
                Object.keys(activeNotes)
                    .filter((key) => !noteModules[key])
                    .forEach((key) => {
                        const { frequency, velocity } = activeNotes[key];
                        newNoteModules[key] = OscillatorModule({
                            frequency,
                            velocity,
                            audioContext,
                            connection: gainControl,
                            type,
                            detune,
                            envelope,
                            synthDetune,
                            octave,
                        } as OscillatorModuleParams);
                    });
            }
            return newNoteModules;
        });

        setPrevNotes(activeNotes);
    }

    /**
     * Update drone modules on drones change
     */
    if (drones !== prevDrones) {
        setDroneModules((prevDroneModules) => {
            // DON'T do deep copy, we need to keep same instance for drones and notes.
            const newDroneModules = { ...prevDroneModules };
            deleteInactive(newDroneModules, drones, noteModules);
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
            return newDroneModules;
        });

        setPrevDrones(drones);
    }

    /**
     * Update osc settings
     */
    const moduleSettings: UpdateParams = { type, detune, synthDetune, octave };
    if (!_.isEqual(prevModuleSettings, moduleSettings)) {
        Object.values(noteModules).map((val) =>
            val?.update({ type, detune, synthDetune, octave }),
        );
        setPrevModuleSettings(moduleSettings);
    }
};
export default useOscillator;

const deleteInactive = (
    modules: Record<string, OscillatorModuleType | undefined>,
    keyMapping: Record<string, any>,
    dependencyModules: Record<string, OscillatorModuleType | undefined>,
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

const updateGainControl = (
    gainControlGain: AudioParam,
    gain: number,
    mute: boolean,
    currentTime: number,
): void => {
    gainControlGain.cancelScheduledValues(currentTime);
    gainControlGain.setValueAtTime(mute ? 0.0 : gain, currentTime);
};
