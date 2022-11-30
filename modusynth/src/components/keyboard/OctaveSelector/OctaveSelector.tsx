import { FC } from 'react';

import { useKeyboard } from 'src/hooks/useKeyboard';

import OctaveSelectorButton from './OctaveSelectorButton';

const octaveNames = [...Array(9).keys()].map((val) => `C${val}`);

const OctaveSelector: FC = () => {
    let { keyboardStartingNote, changeOctave } = useKeyboard();

    return (
        <div style={{ margin: '1rem' }}>
            <span>Octave: </span>
            {octaveNames.map((octaveName) => (
                <OctaveSelectorButton
                    key={octaveName}
                    octaveName={octaveName}
                    keyboardStartingNote={keyboardStartingNote}
                    changeOctave={changeOctave}
                />
            ))}
        </div>
    );
};

export default OctaveSelector;
