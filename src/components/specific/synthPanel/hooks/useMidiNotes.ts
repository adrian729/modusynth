const useMidiNotes = (
    note: string | number,
): [string | undefined, number | undefined] => {
    let noteName = undefined;
    let midiNote = undefined;

    if (typeof note === 'string') {
        noteName = note;
        const [noteKey, octaveNum] = [
            noteName.slice(0, -1),
            noteName[noteName.length - 1],
        ];
        midiNote = parseFloat(noteKey + octaveNum); // TODO: calculate which midiNote from noteKey and octaveNum
    }
    if (typeof note === 'number') {
        midiNote = note;
        const noteKey = arrayNotes[(note - 21) % 12];
        const octaveNum = Math.floor((note - 21) / 12);
        noteName = `${noteKey}${octaveNum}`;
    }

    return [noteName, midiNote];
};

export default useMidiNotes;

const arrayNotes = [
    'A',
    'A#',
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
];
