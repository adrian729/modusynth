import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import OscillatorContext from 'src/context/OscillatorContext';
import { addOscillator, oscillatorExists } from 'src/reducers/synthSlice';

import OscController from './components/oscController';

interface OscProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}

const Oscillator: FC<OscProps> = ({ type, mute }) => {
    const dispatch = useAppDispatch();
    const [oscId] = useState<string>(_.uniqueId('osc_'));
    const oscillatorCreated = oscillatorExists(oscId);

    useEffect((): void => {
        dispatch(addOscillator({ oscId, type, mute }));
    }, []);

    return (
        <OscillatorContext.Provider value={{ oscId }}>
            {oscillatorCreated ? <OscController /> : null}
        </OscillatorContext.Provider>
    );
};

export default Oscillator;
