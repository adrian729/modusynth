import { FC } from 'react';

import OctaveSelectorButton from './OctaveSelectorButton';

const octaves = [...Array(9).keys()];

const OctaveSelector: FC = () => {
    return (
        <div style={{ margin: '1rem' }}>
            <span>Octave: </span>
            {octaves.map((octave) => (
                <OctaveSelectorButton key={octave} octaveNumber={octave} />
            ))}
        </div>
    );
};

export default OctaveSelector;
