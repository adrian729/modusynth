import { FC } from 'react';

import './OctaveSelector.scss';
import OctaveSelectorButton from './OctaveSelectorButton';

const octaves = [...Array(9).keys()];

const OctaveSelector: FC = () => {
    return (
        <div className="octaveselector">
            {octaves.map((octave) => (
                <OctaveSelectorButton key={octave} octaveNumber={octave} />
            ))}
        </div>
    );
};

export default OctaveSelector;
