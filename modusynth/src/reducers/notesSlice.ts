import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from 'src/app/hooks';

export interface NotesState {
    octave: number;
    notes: Record<string, number>;
}

const initialState: NotesState = {
    octave: 4,
    notes: {},
};

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        changeOctave: (state, action: PayloadAction<number>): NotesState => {
            return {
                ...state,
                octave: action.payload,
                notes: {},
            };
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
    },
});

export const { changeOctave, addNote, removeNote } = notesSlice.actions;
export const getOctave = () => useAppSelector((state) => state.notes.octave);
export const getNotes = () => useAppSelector((state) => state.notes.notes);
export default notesSlice.reducer;
