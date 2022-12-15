import { useEffect } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import { useAppDispatch } from 'src/app/hooks';
import {
    addNote,
    getOctave,
    removeNote,
} from 'src/reducers/oscillators/oscillatorsSlice';

export const useKeyboard = (): void => {
    const dispatch = useAppDispatch();
    const octave = getOctave();

    useEffect((): void => {
        const keyboard = new QwertyHancock({
            id: 'keyboard',
            width: '449',
            height: '90',
            octaves: 2,
            startNote: `C${octave || 4}`,
            whiteKeyColour: 'black',
            blackKeyColour: 'white',
            activeColour: 'mediumturquoise',
            borderColour: 'white',
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch(addNote({ note, freq }));
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keyboard.keyUp = (note: string, _: number): void => {
            dispatch(removeNote(note));
        };
    }, [octave]);
};
