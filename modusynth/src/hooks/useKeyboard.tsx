import { useEffect, useState } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import {
    CHANGE_STARTING_NOTE,
    MAKE_OSC,
    STOP_OSC,
} from 'src/actions/synthActions';
import { CTX } from 'src/context/MainStore';

import useSafeContext from './useSafeContext';

interface UseKeyboardResult {
    keyboardStartingNote: string;
    changeOctave(id: string): void;
}
export const useKeyboard = (): UseKeyboardResult => {
    const { state, dispatch } = useSafeContext(CTX);
    let { keyboardStartingNote } = state;
    const [keyboard, setKeyboard] = useState<any>();

    useEffect((): void => {
        const keyboard = new QwertyHancock({
            id: 'keyboard',
            width: '449',
            height: '90',
            octaves: 2,
            startNote: keyboardStartingNote || 'C4',
            whiteKeyColour: 'black',
            blackKeyColour: 'white',
            activeColour: 'mediumturquoise',
            borderColour: 'white',
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch({
                type: MAKE_OSC,
                payload: { note, freq },
            });
        };
        keyboard.keyUp = (note: string, freq: number): void => {
            dispatch({
                type: STOP_OSC,
                payload: { note, freq },
            });
        };
        setKeyboard(keyboard);
    }, [keyboardStartingNote]);

    useEffect((): void => {
        keyboard?.setKeyOctave(
            keyboardStartingNote[keyboardStartingNote.length - 1],
        );
    }, [keyboardStartingNote]);

    const changeOctave = (id: string): void => {
        dispatch({
            type: CHANGE_STARTING_NOTE,
            payload: { keyboardStartingNote: id },
        });
    };

    return { keyboardStartingNote, changeOctave };
};
