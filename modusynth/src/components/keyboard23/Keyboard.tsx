import { FC } from 'react';

import { useKeyboard } from 'src/components/keyboard/hooks/useKeyboard';

import './Keyboard.scss';
import OctaveSelector from './components/octaveSelector';

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
