import { FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/01_core/button';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';

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
            onClick={toggleMuted}
        />
    );
};

export default MuteOsc;
