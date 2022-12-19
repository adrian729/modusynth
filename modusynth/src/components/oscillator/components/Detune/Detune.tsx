import { ChangeEvent, FC, useState } from 'react';

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

interface SliderChangeProps {
    slider: number;
    down: number;
    up: number;
}
interface DetuneChangeProps {
    detune: number;
    down: number;
    up: number;
}

interface SaveDivisionProps {
    dividend: number;
    divisor: number;
}

const calculateDetune = ({ slider, down, up }: SliderChangeProps): number => {
    return slider < 0 ? slider * down : slider * up;
};

const saveDivision = ({ dividend, divisor }: SaveDivisionProps): number =>
    divisor === 0 ? 0 : dividend / divisor;

const calculateSlider = ({ detune, down, up }: DetuneChangeProps): number =>
    saveDivision({ dividend: detune, divisor: detune < 0 ? down : up });

const defaultOptionVal = 12;

const Detune: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscillatorContext);
    const settings = getOscillatorSettings(oscId);
    const { detune } = settings;
    const [detuneState, setDetuneState] = useState<DetuneState>({
        slider: calculateSlider({
            detune,
            down: defaultOptionVal,
            up: defaultOptionVal,
        }),
        down: defaultOptionVal,
        up: defaultOptionVal,
    });
    const { slider, down, up } = detuneState;

    const updateDetuneOscSetting = ({
        slider,
        down,
        up,
    }: SliderChangeProps): void => {
        dispatch(
            updateOscSetting({
                oscId,
                settingId: 'detune',
                value: calculateDetune({ slider, down, up }),
            }),
        );
    };

    const changeDetune = (e: ChangeEvent): void => {
        const { id, value } = e.target as HTMLInputElement;
        const intValue = parseInt(value);
        setDetuneState({ ...detuneState, [id]: value });
        updateDetuneOscSetting({
            slider,
            down: id === 'down' ? intValue : down,
            up: id === 'up' ? intValue : up,
        });
    };

    const change = (e: ChangeEvent): void => {
        const { value } = e.target as HTMLInputElement;
        const intValue = parseInt(value);
        setDetuneState({ ...detuneState, slider: intValue });
        updateDetuneOscSetting({ slider: intValue, down, up });
    };

    const onResetValue = (id: string, val: number): void => {
        setDetuneState({ ...detuneState, [id]: val });
        updateDetuneOscSetting({ slider: val, down, up });
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
