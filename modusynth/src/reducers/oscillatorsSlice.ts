import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useAppSelector } from 'src/app/hooks';
import { Envelope, OscSettings, OscSettingsTypes } from 'src/types/oscillator';

export type ID = string;
export type NoteCode = string;
export type Frequency = number;

export interface OscNodeState {
    drones: Record<NoteCode, Frequency>;
    settings: OscSettings;
}

export interface OscillatorState {
    octave: number;
    notes: Record<NoteCode, Frequency>;
    oscillators: Record<string, OscNodeState>;
}

const initialState: OscillatorState = {
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

const defaultSettings: OscSettings = {
    type: 'sine',
    detune: 0,
    envelope: defaultEnvelope,
    gain: 0.5,
    mute: false,
};

export const oscillatorsSlice = createSlice({
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
                settingId: keyof OscSettings;
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
            action: PayloadAction<{ oscId: string; settings: OscSettings }>,
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
} = oscillatorsSlice.actions;
export const getOctave = () =>
    useAppSelector((state) => state.oscillators.octave);
export const getNotes = () =>
    useAppSelector((state) => state.oscillators.notes);
export const getOscillators = () =>
    useAppSelector((state) => state.oscillators.oscillators);
export const getOscillator = (id: string) =>
    useAppSelector((state) => state.oscillators.oscillators[id]);
export const getOscillatorDrones = (id: string) =>
    useAppSelector((state) => state.oscillators.oscillators[id].drones);
export const getOscillatorSettings = (id: string) =>
    useAppSelector((state) => state.oscillators.oscillators[id].settings);
export default oscillatorsSlice.reducer;
