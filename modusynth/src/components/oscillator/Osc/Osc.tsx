import { FC, useEffect, useState } from 'react';

import _ from 'lodash';
import { useAppDispatch } from 'src/app/hooks';
import { OscCTX } from 'src/context/OscContext';
import {
    addOscillator,
    getOscillator,
    updateOscSetting,
} from 'src/reducers/oscillatorsSlice';

import OscController from '../OscController';

interface OscProps {
    // eslint-disable-next-line no-undef
    type?: OscillatorType;
    mute?: boolean;
}
const Osc: FC<OscProps> = ({ type, mute }) => {
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
        <OscCTX.Provider value={{ oscId }}>
            {oscillatorCreated ? <OscController /> : null}
        </OscCTX.Provider>
    );
};

export default Osc;
