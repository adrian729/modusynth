import { FC } from 'react';

import classNames from 'classnames';
import { useAppDispatch } from 'src/app/hooks';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/oscillatorsSlice';

import './MuteOsc.scss';

const MuteOsc: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscCTX);
    const settings = getOscillatorSettings(oscId);
    let { mute } = settings;

    const toggleMuted = (): void => {
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'mute',
                value: !mute,
            }),
        );
    };

    return (
        <button
            id="mute"
            name="mute"
            className={classNames(
                'muteosc__button',
                mute && 'muteosc__button--active',
            )}
            onClick={toggleMuted}
        >
            M
        </button>
    );
};

export default MuteOsc;
