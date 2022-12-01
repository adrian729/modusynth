import { FC } from 'react';

import { useKeyboard } from 'src/hooks/useKeyboard';

import OctaveSelector from '../OctaveSelector';
import './Keyboard.scss';

const Keyboard: FC = () => {
    useKeyboard();

    return (
        <div className="keyboard">
            <div id="keyboard"></div>
            <OctaveSelector />
        </div>
    );
};

export default Keyboard;
