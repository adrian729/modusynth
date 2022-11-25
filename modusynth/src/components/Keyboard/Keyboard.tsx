import './Keyboard.scss';
import { QwertyHancock } from 'qwerty-hancock';
import { MouseEvent, FC, useContext, useEffect } from 'react';
import { ActionKind, CTX } from '../../context/Store';

const Keyboard: FC = () => {
    const { state, dispatch } = useContext(CTX);
    let { keyboardStartingNote } = state;

    useEffect((): void => {
        const keyboard = new QwertyHancock({
            id: 'keyboard',
            width: '449',
            height: '90',
            octaves: 2,
            startNote: keyboardStartingNote,
            whiteKeyColour: 'black',
            blackKeyColour: 'white',
            activeColour: 'mediumturquoise',
            borderColour: 'white',
        });
        keyboard.keyDown = (note: string, freq: number): void => {
            dispatch({
                type: ActionKind.MAKE_OSC,
                payload: { note, freq },
            });
        };

        keyboard.keyUp = (note: string, freq: number): void => {
            dispatch({
                type: ActionKind.STOP_OSC,
                payload: { note, freq },
            });
        };
    }, [dispatch, keyboardStartingNote]);

    const changeOctave = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        dispatch({
            type: ActionKind.CHANGE_STARTING_NOTE,
            payload: { keyboardStartingNote: id },
        });
    };

    const OctaveSelector: FC = () => {
        const octaveNames = [...Array(9).keys()].map(val => `C${val}`);
        return (
            <div style={{ margin: '1rem' }}>
                <label>Octave: </label>
                {octaveNames.map(octaveName => (
                    <button
                        id={octaveName}
                        key={octaveName}
                        onClick={changeOctave}
                        className={
                            (octaveName === keyboardStartingNote && 'active') ||
                            ''
                        }>
                        {octaveName}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <>
            <div className='keyboard'>
                <div id='keyboard'></div>
            </div>
            <OctaveSelector />
        </>
    );
};

export default Keyboard;
