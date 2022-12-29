import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { useAppSelector } from 'src/app/hooks';

/**
 * value range [-100, 100]
 * detune range [-100*down, 100*up]
 */
export interface DetuneType {
    value: number;
    up: number;
    down: number;
}

export interface SynthSettings {
    gain: number;
    detune: DetuneType;
}

export interface SynthState {
    octave: number;
    synthSettings: SynthSettings;
}

const initialDetune: DetuneType = {
    value: 0,
    up: 1,
    down: 1,
};

const initialSynthSettings: SynthSettings = {
    gain: 0.2,
    detune: initialDetune,
};

const initialState: SynthState = {
    octave: 0,
    synthSettings: initialSynthSettings,
};

export const synthSlice = createSlice({
    name: 'synth',
    initialState,
    reducers: {
        changeOctave: (state, action: PayloadAction<number>): void => {
            state.octave = action.payload;
        },
        /** Synth Settings */
        updateSynthGain: (state, action: PayloadAction<number>): void => {
            state.synthSettings.gain = action.payload;
        },
        updateSynthDetune: (state, action: PayloadAction<DetuneType>): void => {
            state.synthSettings.detune = action.payload;
        },
        updateSynthDetuneValue: (
            state,
            action: PayloadAction<number>,
        ): void => {
            state.synthSettings.detune.value = action.payload;
        },
        updateSynthDetuneUp: (state, action: PayloadAction<number>): void => {
            state.synthSettings.detune.up = action.payload;
        },
        updateSynthDetuneDown: (state, action: PayloadAction<number>): void => {
            state.synthSettings.detune.down = action.payload;
        },
    },
});

export const {
    changeOctave,
    updateSynthGain,
    updateSynthDetune,
    updateSynthDetuneValue,
    updateSynthDetuneUp,
    updateSynthDetuneDown,
} = synthSlice.actions;
export const getOctave = () => useAppSelector(({ synth }) => synth.octave);
export const getSynthGain = () =>
    useAppSelector(({ synth }) => synth.synthSettings.gain);
export const getSynthDetune = () =>
    useAppSelector(({ synth }) => {
        const { value, up, down } = synth.synthSettings.detune;
        return value < 0 ? value * down : value * up;
    });
export const getSynthDetuneObject = () =>
    useAppSelector(({ synth }) => synth.synthSettings.detune);

export default synthSlice.reducer;
