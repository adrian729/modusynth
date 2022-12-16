import { ChangeEvent, FC, useEffect, useState } from 'react';

import { useAppDispatch } from 'src/App/hooks';
import Slider from 'src/components/core/Slider';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';

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
    const { oscId } = useSafeContext(OscillatorContext);
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
            <select id="down" onChange={changeDetune} value={down}>
                <option value={24}>2OCT</option>
                <option value={12}>OCT</option>
                <option value={11}>7TH</option>
                <option value={10}>-7TH</option>
                <option value={9}>6TH</option>
                <option value={8}>-6TH</option>
                <option value={7}>5TH</option>
                <option value={6}>-5TH</option>
                <option value={5}>4TH</option>
                <option value={4}>3RD</option>
                <option value={3}>-3RD</option>
                <option value={2}>2ND</option>
                <option value={1}>-2ND</option>
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
            <select id="up" onChange={changeDetune} value={up}>
                <option value={24}>2OCT</option>
                <option value={12}>OCT</option>
                <option value={11}>7TH</option>
                <option value={10}>-7TH</option>
                <option value={9}>6TH</option>
                <option value={8}>-6TH</option>
                <option value={7}>5TH</option>
                <option value={6}>-5TH</option>
                <option value={5}>4TH</option>
                <option value={4}>3RD</option>
                <option value={3}>-3RD</option>
                <option value={2}>2ND</option>
                <option value={1}>-2ND</option>
                <option value={0}>-</option>
            </select>
        </div>
    );
};

export default Detune;
