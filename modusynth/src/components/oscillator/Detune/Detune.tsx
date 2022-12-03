import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/oscillatorsSlice';
import { OscSettings } from 'src/types/oscillator';

interface DetuneState {
    slider: number;
    down: number;
    up: number;
}

const calculateDetune = (slider: number, down: number, up: number): number => {
    return slider < 0 ? slider * down : slider * up;
};

const saveDivision = (dividend: number, divisor: number): number =>
    divisor === 0 ? 0 : dividend / divisor;

const calculateSlider = (detune: number, down: number, up: number): number =>
    detune < 0 ? saveDivision(detune, down) : saveDivision(detune, up);

const Detune: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscCTX);
    const settings = getOscillatorSettings(oscId);
    const { detune } = settings;
    const [detuneState, setDetuneState] = useState<DetuneState>({
        slider: 0,
        down: 12,
        up: 12,
    });
    const { slider, down, up } = detuneState;

    useEffect(() => {
        setDetuneState({
            ...detuneState,
            slider: calculateSlider(detune, down, up),
        });
    }, []);

    useEffect(() => {
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'detune',
                value: calculateDetune(slider, down, up),
            }),
        );
    }, [slider, up, down]);

    const changeDetune = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        setDetuneState({ ...detuneState, [id]: parseInt(value) });
    };

    const change = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        setDetuneState({ ...detuneState, slider: parseInt(value) });
    };

    const onResetValue = (id: string, val: number): void => {
        setDetuneState({ ...detuneState, [id]: val });
    };

    // TODO: refactor this into smaller parts/array of values/change names (2ND, 3RD, 4TH etc)
    return (
        <div>
            <select id="down" onChange={changeDetune}>
                <option value={12}>Oct</option>
                <option value={11}>VII</option>
                <option value={10}>VIIb</option>
                <option value={9}>VI</option>
                <option value={8}>VIb</option>
                <option value={7}>V</option>
                <option value={6}>Vb</option>
                <option value={5}>IV</option>
                <option value={4}>III</option>
                <option value={3}>IIIb</option>
                <option value={2}>II</option>
                <option value={1}>IIb</option>
                <option value={0}>-</option>
            </select>
            <Slider
                id="slider"
                value={slider}
                min={down > 0 ? -100 : 0}
                max={up > 0 ? 100 : 0}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={0}
            />
            <select id="up" onChange={changeDetune}>
                <option value={12}>Oct</option>
                <option value={11}>VII</option>
                <option value={10}>VIIb</option>
                <option value={9}>VI</option>
                <option value={8}>VIb</option>
                <option value={7}>V</option>
                <option value={6}>Vb</option>
                <option value={5}>IV</option>
                <option value={4}>III</option>
                <option value={3}>IIIb</option>
                <option value={2}>II</option>
                <option value={1}>IIb</option>
                <option value={0}>-</option>
            </select>
        </div>
    );
};

export default Detune;
