import { NoteName } from 'src/types/notes';

// Octave rolls over at C (scientific pitch notation), so C4 = MIDI 60 —
// matching the note names the on-screen qwerty-hancock keyboard emits.
const arrayNotes: NoteName[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
];

export const midiNoteName = (midiNote: number): string => {
    const noteKey = arrayNotes[midiNote % 12];
    const octaveNum = Math.floor(midiNote / 12) - 1;
    return `${noteKey}${octaveNum}`;
};
