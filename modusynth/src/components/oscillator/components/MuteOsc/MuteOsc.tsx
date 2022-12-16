import { FC } from 'react';

import { useAppDispatch } from 'src/App/hooks';
import Button from 'src/components/core/Button';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';

import './MuteOsc.scss';

const MuteOsc: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscillatorContext);
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
        <Button
            id="mute"
            name="mute"
            title="M"
            buttonKind={mute ? 'warning' : undefined}
            className="muteosc__button"
            onClick={toggleMuted}
        />
    );
};

export default MuteOsc;
