import { RefObject, useEffect, useRef, useState } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import { useAppDispatch } from 'src/app/hooks';
import { addNote, removeNote } from 'src/reducers/oscillatorsSlice';
import { useOctave } from 'src/reducers/synthSlice';
import { theme } from 'src/styles/theme';
import { useWindowSize } from 'usehooks-ts';

interface CreateKeyboardParams {
    windowWidth: number;
}
interface CreateKeyboardReturn {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- qwerty-hancock has no types
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
        whiteKeyColour: theme.keyWhite,
        blackKeyColour: theme.keyBlack,
        activeColour: theme.keyActive,
        borderColour: theme.keyBorder,
    });

    return { keyboard, keyboardWidth };
};

interface UseKeyboardArgs {
    keyboardRef: RefObject<HTMLDivElement>;
}
export const useKeyboard = ({ keyboardRef }: UseKeyboardArgs): number => {
    const dispatch = useAppDispatch();
    const { width: windowWidth } = useWindowSize();
    const octave = useOctave();

    // Keep the latest octave available to the (created-once) keyDown closure
    // without rebuilding the keyboard — rebuilding would drop active-note
    // highlights, the bug we're fixing.
    const octaveRef = useRef(octave);
    useEffect(() => {
        octaveRef.current = octave;
    }, [octave]);

    const [keyboardWidth, setKeyboardWidth] = useState<number>(-1);

    useEffect(() => {
        if (!keyboardRef.current) {
            return;
        }
        // Drop any previously-rendered keyboard SVG before (re)creating.
        keyboardRef.current.replaceChildren();
        const { keyboard, keyboardWidth: width } = createKeyboard({
            windowWidth,
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            // Transpose the on-screen keyboard by the selected octave.
            dispatch(
                addNote({ note, frequency: freq * 2 ** octaveRef.current }),
            );
        };
        keyboard.keyUp = (note: string): void => {
            dispatch(removeNote(note));
        };
        setKeyboardWidth(width);
    }, [windowWidth, dispatch, keyboardRef]);

    return keyboardWidth;
};
