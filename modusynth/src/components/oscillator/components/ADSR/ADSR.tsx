import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/App/hooks';
import Slider from 'src/components/core/Slider';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';

const ADSR: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscillatorContext);
    const settings = getOscillatorSettings(oscId);
    const { envelope } = settings;
    const { attack, decay, sustain, release } = envelope;

    const change = (e: ChangeEvent): void => {
        const { id, value } = e.target as HTMLInputElement;
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'envelope',
                value: { ...envelope, [id]: parseFloat(value) },
            }),
        );
    };

    const onResetValue = (id: string, val: number): void => {
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'envelope',
                value: { ...envelope, [id]: val },
            }),
        );
    };

    return (
        <div>
            <Slider
                id="attack"
                value={attack}
                min={0.005}
                max={2}
                step={0.005}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={0.005}
            />
            <Slider
                id="decay"
                value={decay}
                min={0}
                max={1}
                step={0.01}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={0.1}
            />
            <Slider
                id="sustain"
                value={sustain}
                min={0}
                max={1}
                step={0.01}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={0.6}
            />
            <Slider
                id="release"
                value={release}
                min={0}
                max={2}
                step={0.02}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={0.1}
            />
        </div>
    );
};

export default ADSR;
