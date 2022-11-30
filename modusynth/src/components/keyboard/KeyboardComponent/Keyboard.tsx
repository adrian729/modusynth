import { FC } from 'react';

import OctaveSelector from '../OctaveSelector';
import './Keyboard.scss';

const Keyboard: FC = () => {
    return (
        <div className="keyboard">
            <div id="keyboard"></div>
            <OctaveSelector />
        </div>
    );
};

export default Keyboard;
