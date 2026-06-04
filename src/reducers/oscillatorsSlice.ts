import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from 'src/app/hooks';

type NoteKey = string;
type Frequency = number;

export interface Note {
    frequency: Frequency;
    velocity?: number;
}

export interface SynthPadNote {
    frequency: Frequency;
    velocity: number;
}

export interface OscillatorsState {
    synthPadNote: SynthPadNote;
    notes: Record<NoteKey, Note>;
    // Frozen notes ("drones"): kept sounding after key release until cleared.
    frozenNotes: Record<NoteKey, Note>;
}

const defaultSynthPadNote: SynthPadNote = {
    frequency: 0,
    velocity: 0,
};

const initialState: OscillatorsState = {
    synthPadNote: defaultSynthPadNote,
    notes: {},
    frozenNotes: {},
};

export const oscillatorsSlice = createSlice({
    name: 'oscillators',
    initialState,
    reducers: {
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
        removeNote: (state, action: PayloadAction<string>): void => {
            delete state.notes[action.payload];
        },
        /** SynthPad */
        updateSynthPad: (
            state,
            action: PayloadAction<{ frequency: number; velocity: number }>,
        ): void => {
            const { frequency, velocity } = action.payload;
            state.synthPadNote = { frequency, velocity };
        },
        stopSynthPad: (state): void => {
            state.synthPadNote = { frequency: 0, velocity: 0 };
        },
        /** Freeze: snapshot currently-held notes as sustained drones */
        freeze: (state): void => {
            state.frozenNotes = { ...state.notes, ...state.frozenNotes };
        },
        clearDrones: (state): void => {
            state.frozenNotes = {};
        },
    },
});

export const {
    addNote,
    removeNote,
    updateSynthPad,
    stopSynthPad,
    freeze,
    clearDrones,
} = oscillatorsSlice.actions;

export const getNotes = () =>
    useAppSelector(({ oscillators }) => oscillators.notes);
export const getFrozenNotes = () =>
    useAppSelector(({ oscillators }) => oscillators.frozenNotes);
export const getSynthPadNote = () =>
    useAppSelector(({ oscillators }) => oscillators.synthPadNote);

export default oscillatorsSlice.reducer;
