import { FC, useRef } from 'react';

import OctaveSelector from '../octaveSelector/OctaveSelector';
import { useKeyboard } from './hooks/useKeyboard';

const Keyboard: FC = () => {
    const keyboardWrapperRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<HTMLDivElement>(null);
    const keyboardWidth = useKeyboard({ keyboardRef });
    const { current } = keyboardWrapperRef;

    if (current && keyboardWidth > 0) {
        current.style.width = `${keyboardWidth}px`;
    }

    return (
        <div ref={keyboardWrapperRef}>
            <OctaveSelector />
            <div id="keyboard" ref={keyboardRef}></div>
        </div>
    );
};

export default Keyboard;
