import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useAppSelector } from 'src/app/hooks';
import {
    Envelope,
    OscSettingsTypes,
    OscillatorSettings,
} from 'src/types/oscillator';

type OscID = string;
type NoteKey = string;
type Frequency = number;

export interface OscillatorState {
    drones: Record<NoteKey, Note>;
    settings: OscillatorSettings;
}

export interface SynthSettings {
    gain: number;
    detune: number;
}

export interface Note {
    frequency: Frequency;
    velocity?: number;
}

export interface SynthState {
    octave: number;
    synthSettings: SynthSettings;
    notes: Record<NoteKey, Note>;
    oscillators: Record<OscID, OscillatorState>;
}

const initialSynthSettings: SynthSettings = {
    gain: 0.2,
    detune: 0,
};

const initialState: SynthState = {
    octave: 4,
    synthSettings: initialSynthSettings,
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
    name: 'synth',
    initialState,
    reducers: {
        changeOctave: (state, action: PayloadAction<number>): void => {
            state.octave = action.payload;
            state.notes = {};
        },
        /** Synth Settings */
        updateSynthGain: (state, action: PayloadAction<number>): void => {
            state.synthSettings.gain = action.payload;
        },
        updateSynthDetune: (state, action: PayloadAction<number>): void => {
            state.synthSettings.detune = action.payload;
        },
        updateSynthSetting: (
            state,
            action: PayloadAction<{
                settingId: keyof SynthSettings;
                value: OscSettingsTypes;
            }>,
        ): void => {
            const { settingId, value } = action.payload;
            const { synthSettings } = state;

            if (settingId === 'gain') {
                synthSettings[settingId] = value as number;
            } else if (settingId === 'detune' || settingId === 'gain') {
                synthSettings[settingId] = value as number;
            }
        },
        /** Notes */
        addNote: (
            state,
            action: PayloadAction<{
                note: string;
                frequency: number;
                velocity?: number;
            }>,
        ): void => {
            const { note, frequency, velocity } = action.payload;
            if (note && frequency) {
                state.notes[note] = { frequency, velocity };
            }
        },
        /** Oscillators */
        removeNote: (state, action: PayloadAction<string>): void => {
            const { notes } = state;
            delete notes[action.payload];
        },
        addOscillator: (
            state,
            action: PayloadAction<{
                oscId: OscID;
                // eslint-disable-next-line no-undef
                type?: OscillatorType;
                mute?: boolean;
            }>,
        ): void => {
            const { oscId, type, mute } = action.payload;
            let osc = state.oscillators[oscId];
            if (!osc) {
                osc = {
                    drones: {},
                    settings: _.cloneDeep(defaultSettings),
                };
                state.oscillators[oscId] = osc;
            }
            if (type !== undefined) {
                osc.settings.type = type;
            }
            if (mute !== undefined) {
                osc.settings.mute = mute;
            }
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
            const osc = state.oscillators[oscId];
            if (!osc) {
                return;
            }

            const { settings } = osc;
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
            const osc = state.oscillators[oscId];
            if (osc) {
                osc.settings = settings;
            }
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
    updateSynthGain,
    updateSynthDetune,
    updateSynthSetting,
    addNote,
    removeNote,
    addOscillator,
    updateOscSetting,
    updateOscSettings,
    freeze,
    release,
} = synthSlice.actions;
export const getOctave = () => useAppSelector(({ synth }) => synth.octave);
export const getSynthGain = () =>
    useAppSelector(({ synth }) => synth.synthSettings.gain);
export const getSynthDetune = () =>
    useAppSelector(({ synth }) => synth.synthSettings.detune);
export const getNotes = () => useAppSelector(({ synth }) => synth.notes);
export const isNoteActive = (id: string) =>
    useAppSelector(({ synth }) => !!synth.notes[id]);
export const getOscillators = () =>
    useAppSelector(({ synth }) => synth.oscillators);
export const oscillatorExists = (id: string) =>
    useAppSelector(({ synth }) => !!synth.oscillators[id]);
export const getOscillator = (id: string) =>
    useAppSelector(({ synth }) => synth.oscillators[id]);
export const getOscillatorDrones = (id: string) =>
    useAppSelector(({ synth }) => synth.oscillators[id].drones);
export const getOscillatorSettings = (id: string) =>
    useAppSelector(({ synth }) => synth.oscillators[id].settings);
export const getActiveOscillatorsCount = () =>
    useAppSelector(
        ({ synth }) =>
            Object.values(synth.oscillators).filter(
                (osc) => osc.settings && !osc.settings.mute,
            ).length,
    );
export const isDroneActive = (oscId: OscID, noteKey: NoteKey) =>
    useAppSelector(({ synth }) => !!synth.oscillators[oscId].drones[noteKey]);

export default synthSlice.reducer;
