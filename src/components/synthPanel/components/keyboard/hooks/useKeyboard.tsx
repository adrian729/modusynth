import { RefObject } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import { useAppDispatch } from 'src/app/hooks';
import { addNote, getOctave, removeNote } from 'src/reducers/synthSlice';
import { useWindowSize } from 'usehooks-ts';

interface CreateKeyboardParams {
    octave: number;
    windowWidth: number;
}
interface CreateKeyboardReturn {
    keyboard: any;
    keyboardWidth: number;
}
const createKeyboard = ({
    octave,
    windowWidth,
}: CreateKeyboardParams): CreateKeyboardReturn => {
    const [keyboardWidth, keyboardHeight, numOctaves] =
        windowWidth && windowWidth < 600
            ? [Math.floor(windowWidth * 0.9), 150, 1]
            : [449, 90, 2];

    const keyboard = new QwertyHancock({
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

    return { keyboard, keyboardWidth };
};

interface UseKeyboardArgs {
    keyboardRef: RefObject<HTMLDivElement>;
}
export const useKeyboard = ({ keyboardRef }: UseKeyboardArgs): number => {
    const dispatch = useAppDispatch();
    const octave = getOctave();
    const { width: windowWidth } = useWindowSize();

    if (keyboardRef.current) {
        const { keyboard, keyboardWidth } = createKeyboard({
            octave,
            windowWidth,
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch(addNote({ note, freq }));
        };

        keyboard.keyUp = (note: string): void => {
            dispatch(removeNote(note));
        };
        return keyboardWidth;
    }

    return -1;
};
