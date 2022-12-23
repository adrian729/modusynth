import { QwertyHancock } from 'qwerty-hancock';
import { useAppDispatch } from 'src/app/hooks';
import { addNote, getOctave, removeNote } from 'src/reducers/synthSlice';
import { useWindowSize } from 'usehooks-ts';

const createKeyboard = (width: number, octave: number): any => {
    const [keyboardWidth, keyboardHeight, numOctaves] =
        width && width < 600 ? [Math.floor(width * 0.9), 150, 1] : [449, 90, 2];

    return new QwertyHancock({
        id: 'keyboard',
        width: keyboardWidth,
        height: keyboardHeight,
        octaves: numOctaves,
        startNote: `C${octave !== undefined ? octave : 4}`,
        whiteKeyColour: 'black',
        blackKeyColour: 'white',
        activeColour: 'mediumturquoise',
        borderColour: 'white',
    });
};

export const useKeyboard = (): void => {
    const dispatch = useAppDispatch();
    const octave = getOctave();
    const { width } = useWindowSize();

    if (document.getElementById('keyboard')) {
        const keyboard = createKeyboard(width, octave);
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch(addNote({ note, freq }));
        };

        keyboard.keyUp = (note: string): void => {
            dispatch(removeNote(note));
        };
    }
};
