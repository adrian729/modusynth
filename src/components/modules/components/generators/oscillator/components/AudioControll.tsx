import { FC } from 'react';

import useOscillator from '../hooks/useOscillator';

/**
 * Separate logic so that render of whole OscillatorComponent doesn't happen when audio triggers
 */
const AudioControl: FC = () => {
    useOscillator();
    return null;
};

export default AudioControl;
