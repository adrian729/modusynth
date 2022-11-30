import { useEffect } from 'react';

import { QwertyHancock } from 'qwerty-hancock';
import {
    CHANGE_STARTING_OCTAVE,
    MAKE_OSC,
    STOP_OSC,
} from 'src/actions/synthActions';
import { CTX } from 'src/context/MainStore';

import useSafeContext from './useSafeContext';

interface UseKeyboardResult {
    startingOctave: number;
    changeOctave(id: number): void;
}
export const useKeyboard = (): UseKeyboardResult => {
    const { state, dispatch } = useSafeContext(CTX);
    let { startingOctave } = state;

    useEffect((): void => {
        const keyboard = new QwertyHancock({
            id: 'keyboard',
            width: '449',
            height: '90',
            octaves: 2,
            startNote: `C${startingOctave}` || 'C4',
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
    }, [startingOctave]);

    const changeOctave = (octave: number): void => {
        dispatch({
            type: CHANGE_STARTING_OCTAVE,
            payload: { startingOctave: octave },
        });
    };

    return { startingOctave, changeOctave };
};
