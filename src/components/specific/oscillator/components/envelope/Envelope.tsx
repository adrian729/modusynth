import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider';
import List from 'src/components/common/layouts/list/List';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/oscillatorsSlice';

const Envelope: FC = () => {
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
        <List direction="row">
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
        </List>
    );
};

export default Envelope;
