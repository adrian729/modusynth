import { FC } from 'react';

import { useKeyboard } from 'src/components/Keyboard/hooks/useKeyboard';

import './Keyboard.scss';
import OctaveSelector from './components/OctaveSelector/OctaveSelector';

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
