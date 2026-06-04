import { ChangeEvent } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/common/core/slider';
import Freezer from 'src/components/specific/freezer/Freezer';
import {
    updateSynthDetuneValue,
    updateSynthGain,
    useSynthDetune,
    useSynthGain,
} from 'src/reducers/synthSlice';

import Keyboard from './components/keyboard/Keyboard';
import useMidiDevice from './hooks/useMidiDevice';

const SynthPanel = () => {
    const dispatch = useAppDispatch();
    const gain = useSynthGain();
    const detune = useSynthDetune();

    useMidiDevice();

    const changeGain = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        dispatch(updateSynthGain(parseFloat(value)));
    };

    const changeDetune = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        dispatch(updateSynthDetuneValue(parseFloat(value)));
    };

    const onResetGain = (id: string, value: number): void => {
        dispatch(updateSynthGain(value));
    };
    const onResetDetune = (id: string, value: number): void => {
        dispatch(updateSynthDetuneValue(value));
    };

    // TODO: CHECK TO SEPARATE SLIDERS AND KB, SINCE ON RERENDER THE KB RERENDERS ALSO (green notes removed)
    return (
        <div className="module-card w-fit">
            <h3 className="module-card__header">synth</h3>
            <div className="flex flex-wrap items-start gap-4 p-4">
                <div className="flex flex-col gap-3">
                    <Slider
                        id="synthGain"
                        label="gain"
                        value={gain}
                        max={1.5}
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
                </div>
                <Keyboard />
                <Freezer />
            </div>
        </div>
    );
};

export default SynthPanel;
