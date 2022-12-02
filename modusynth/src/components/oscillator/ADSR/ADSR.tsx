import { ChangeEvent, FC } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscStore';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

const ADSR: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    const { settings } = oscCtxState;
    const { envelope } = settings;
    const { attack, decay, sustain, release } = envelope;

    const change = (e: ChangeEvent): void => {
        const { id, value } = e.target as HTMLInputElement;
        const newEnvelope = { ...envelope, [id]: parseFloat(value) };
        const newSettings: OscSettings = {
            ...settings,
            envelope: newEnvelope,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const onResetValue = (id: string, val: number): void => {
        const newEnvelope = { ...envelope, [id]: val };
        const newSettings: OscSettings = {
            ...settings,
            envelope: newEnvelope,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
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
