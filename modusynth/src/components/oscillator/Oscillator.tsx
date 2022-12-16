import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/App/hooks';
import OscillatorContext from 'src/context/OscillatorContext';
import {
    addOscillator,
    getOscillator,
    updateOscSetting,
} from 'src/reducers/synthSlice';

import OscController from './components/OscController';

interface OscProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}
const Oscillator: FC<OscProps> = ({ type, mute }) => {
    const dispatch = useAppDispatch();
    const [oscId] = useState<string>(_.uniqueId('osc_'));
    const oscillatorCreated = getOscillator(oscId);

    useEffect((): void => {
        dispatch(addOscillator(oscId));
        if (type) {
            dispatch(
                updateOscSetting({
                    oscId,
                    settingId: 'type',
                    value: type,
                }),
            );
        }
        if (mute !== undefined) {
            dispatch(
                updateOscSetting({ oscId, settingId: 'mute', value: mute }),
            );
        }
    }, []);

    return (
        <OscillatorContext.Provider value={{ oscId }}>
            {oscillatorCreated ? <OscController /> : null}
        </OscillatorContext.Provider>
    );
};

export default Oscillator;
