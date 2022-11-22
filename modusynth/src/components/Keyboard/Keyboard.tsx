import './Keyboard.scss';
import { QwertyHancock } from 'qwerty-hancock';
import { useContext, useEffect } from 'react';
import { ActionKind, CTX } from '../../context/Store';

const Keyboard = () => {
    const { dispatch } = useContext(CTX);
    console.log('UPS', dispatch);

    useEffect(() => {
        console.log('Setup KB');
        const keyboard = new QwertyHancock({
            id: 'keyboard',
            width: '449',
            height: '90',
            octaves: 2,
            startNote: 'C4',
            whiteKeyColour: 'black',
            blackKeyColour: 'white',
            activeColour: 'rgb(166, 49, 172)',
            borderColour: 'white',
        });
        keyboard.keyDown = (note: string, freq: number) => {
            dispatch({
                type: ActionKind.MAKE_OSC,
                payload: { note, freq },
            });
        };

        // keyboard.keyUp = (note: string, freq: number) => {
        //     dispatch({
        //         type: ActionKind.KILL_OSC,
        //         payload: { note, freq },
        //     });
        // };
    }, [dispatch]);

    return (
        <div className='keyboard'>
            <div id='keyboard'></div>
        </div>
    );
};

export default Keyboard;
