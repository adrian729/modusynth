import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Button from 'src/components/01_core/button';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';

const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
const WaveTypeSelector: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscillatorContext);
    const settings = getOscillatorSettings(oscId);
    const { type } = settings;

    const changeType = (e: MouseEvent): void => {
        const { id } = e.target as HTMLInputElement;
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'type',
                // eslint-disable-next-line no-undef
                value: id as OscillatorType,
            }),
        );
    };

    return (
        <div>
            {waveTypes.map((waveType) => (
                <Button
                    id={waveType}
                    key={waveType}
                    title={waveType}
                    buttonKind={waveType === type ? 'active' : undefined}
                    onClick={changeType}
                />
            ))}
        </div>
    );
};

export default WaveTypeSelector;
