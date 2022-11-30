import { FC } from 'react';

import { useKeyboard } from 'src/hooks/useKeyboard';

import OctaveSelectorButton from './OctaveSelectorButton';

const octaves = [...Array(9).keys()];

const OctaveSelector: FC = () => {
    let { startingOctave, changeOctave } = useKeyboard();

    return (
        <div style={{ margin: '1rem' }}>
            <span>Octave: </span>
            {octaves.map((octave) => (
                <OctaveSelectorButton
                    key={octave}
                    octave={octave}
                    startingOctave={startingOctave}
                    changeOctave={changeOctave}
                />
            ))}
        </div>
    );
};

export default OctaveSelector;
