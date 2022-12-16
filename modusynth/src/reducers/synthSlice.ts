import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useAppSelector } from 'src/App/hooks';
import {
    Envelope,
    OscSettingsTypes,
    OscillatorSettings,
} from 'src/types/oscillator';

type OscID = string;
type NoteName = string;
type Frequency = number;

export interface OscillatorState {
    drones: Record<NoteName, Frequency>;
    settings: OscillatorSettings;
}

export interface SynthState {
    octave: number;
    notes: Record<NoteName, Frequency>;
    oscillators: Record<OscID, OscillatorState>;
}

const initialState: SynthState = {
    octave: 4,
    notes: {},
    oscillators: {},
};

const defaultEnvelope: Envelope = {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.6,
    release: 0.1,
};

const defaultSettings: OscillatorSettings = {
    type: 'sine',
    detune: 0,
    envelope: defaultEnvelope,
    gain: 0.5,
    mute: false,
};

export const synthSlice = createSlice({
    name: 'oscillators',
    initialState,
    reducers: {
        changeOctave: (state, action: PayloadAction<number>): void => {
            state.octave = action.payload;
            state.notes = {};
        },
        addNote: (
            state,
            action: PayloadAction<{ note: string; freq: number }>,
        ): void => {
            let { note, freq } = action.payload;
            if (note && freq) {
                state.notes[note] = freq;
            }
        },
        removeNote: (state, action: PayloadAction<string>): void => {
            let { notes } = state;
            delete notes[action.payload];
        },
        addOscillator: (state, action: PayloadAction<string>): void => {
            state.oscillators[action.payload] = {
                drones: {},
                settings: defaultSettings,
            };
        },
        updateOscSetting: (
            state,
            action: PayloadAction<{
                oscId: string;
                settingId: keyof OscillatorSettings;
                value: OscSettingsTypes;
            }>,
        ): void => {
            const { oscId, settingId, value } = action.payload;
            const { settings } = state.oscillators[oscId];
            if (settingId === 'type') {
                // eslint-disable-next-line no-undef
                settings[settingId] = value as OscillatorType;
            } else if (settingId === 'detune' || settingId === 'gain') {
                settings[settingId] = value as number;
            } else if (settingId === 'envelope') {
                settings[settingId] = value as Envelope;
            } else if (settingId === 'mute') {
                settings[settingId] = value as boolean;
            }
        },
        updateOscSettings: (
            state,
            action: PayloadAction<{
                oscId: string;
                settings: OscillatorSettings;
            }>,
        ): void => {
            const { oscId, settings } = action.payload;
            state.oscillators[oscId].settings = settings;
        },
        freeze: (state): void => {
            const { oscillators } = state;
            Object.entries(oscillators)
                .filter(([, osc]) => !osc.settings.mute)
                .forEach(
                    ([, osc]) =>
                        (osc.drones = { ...state.notes, ...osc.drones }),
                );
        },
        release: (state): void => {
            const { oscillators } = state;
            Object.entries(oscillators).forEach(([, osc]) => (osc.drones = {}));
        },
    },
});

export const {
    changeOctave,
    addNote,
    removeNote,
    addOscillator,
    updateOscSetting,
    updateOscSettings,
    freeze,
    release,
} = synthSlice.actions;
export const getOctave = () =>
    useAppSelector(({ oscillators }) => oscillators.octave);
export const getNotes = () =>
    useAppSelector(({ oscillators }) => oscillators.notes);
export const getOscillators = () =>
    useAppSelector(({ oscillators }) => oscillators.oscillators);
export const getOscillator = (id: string) =>
    useAppSelector(({ oscillators }) => oscillators.oscillators[id]);
export const getOscillatorDrones = (id: string) =>
    useAppSelector(({ oscillators }) => oscillators.oscillators[id].drones);
export const getOscillatorSettings = (id: string) =>
    useAppSelector(({ oscillators }) => oscillators.oscillators[id].settings);
export const getActiveOscillatorsCount = () =>
    useAppSelector(
        ({ oscillators }) =>
            Object.values(oscillators.oscillators).filter(
                (osc) => osc.settings && !osc.settings.mute,
            ).length,
    );

export default synthSlice.reducer;
