import { FC, useRef } from 'react';

import { useKeyboard } from 'src/components/keyboard/hooks/useKeyboard';

import Container from '../00_layouts/container';
import OctaveSelector from './components/octaveSelector';

const Keyboard: FC = () => {
    const keyboardWrapperRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<HTMLDivElement>(null);
    const keyboardWidth = useKeyboard({ keyboardRef });
    const { current } = keyboardWrapperRef;

    if (current && keyboardWidth > 0) {
        current.style.width = `${keyboardWidth}px`;
    }

    return (
        <Container alignContent="center-content">
            <div ref={keyboardWrapperRef}>
                <div id="keyboard" ref={keyboardRef}></div>
            </div>
            <OctaveSelector />
        </Container>
    );
};

export default Keyboard;
