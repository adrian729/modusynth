import { ChangeEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import {
    SynthSettings,
    getSynthDetune,
    getSynthGain,
    updateSynthSetting,
} from 'src/reducers/synthSlice';

import Slider from '../01_core/slider/Slider';
import Keyboard from './components/keyboard/Keyboard';
import './styles.scss';

const SynthPanel = () => {
    const dispatch = useAppDispatch();
    const synthGain = getSynthGain();
    const detune = getSynthDetune();

    const change = (id: string, value: number): void => {
        dispatch(
            updateSynthSetting({
                settingId: id as keyof SynthSettings,
                value: value,
            }),
        );
    };

    const changeGain = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        change('gain', parseFloat(value));
    };

    const changeDetune = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        change('detune', parseFloat(value));
    };

    const onResetValue = (id: string, value: number): void => {
        dispatch(
            updateSynthSetting({
                settingId: id as keyof SynthSettings,
                value,
            }),
        );
    };
    const onResetGain = (id: string, value: number): void => {
        onResetValue('gain', value);
    };
    const onResetDetune = (id: string, value: number): void => {
        onResetValue('detune', value);
    };

    // TODO: finish detune from Oscillators and reuse here
    // TODO: add main detune to useOscModules
    return (
        <div className="synthPanel center">
            <Slider
                id="synthGain"
                label="gain"
                value={synthGain}
                max={1}
                step={0.005}
                onChange={changeGain}
                onSliderReset={onResetGain}
                resetValue={0.2}
                sliderSize={8}
                sliderSizeUnits="rem"
            />
            <Slider
                id="synthDetune"
                label="detune"
                value={detune}
                max={100}
                min={-100}
                step={1}
                onChange={changeDetune}
                onSliderReset={onResetDetune}
                resetValue={0}
                sliderSize={8}
                sliderSizeUnits="rem"
            />
            <Keyboard />
        </div>
    );
};

export default SynthPanel;
