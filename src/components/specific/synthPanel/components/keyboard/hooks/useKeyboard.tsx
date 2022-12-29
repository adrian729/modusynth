import { RefObject } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import { useAppDispatch } from 'src/app/hooks';
import { addNote, removeNote } from 'src/reducers/oscillatorsSlice';
import { useWindowSize } from 'usehooks-ts';

interface CreateKeyboardParams {
    windowWidth: number;
}
interface CreateKeyboardReturn {
    keyboard: any;
    keyboardWidth: number;
}
const createKeyboard = ({
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
        startNote: 'C4',
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
    const { width: windowWidth } = useWindowSize();

    if (keyboardRef.current) {
        const { keyboard, keyboardWidth } = createKeyboard({
            windowWidth,
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch(addNote({ note, frequency: freq }));
        };

        keyboard.keyUp = (note: string): void => {
            dispatch(removeNote(note));
        };
        return keyboardWidth;
    }

    return -1;
};
