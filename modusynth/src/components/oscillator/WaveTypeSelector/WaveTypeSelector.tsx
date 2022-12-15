import { FC, MouseEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/oscillators/oscillatorsSlice';

const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
const WaveTypeSelector: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscCTX);
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
                <button
                    id={waveType}
                    key={waveType}
                    onClick={changeType}
                    className={(waveType === type && 'active') || ''}
                >
                    {waveType}
                </button>
            ))}
        </div>
    );
};

export default WaveTypeSelector;
