import { ChangeEvent, FC, useEffect, useState } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscStore';
import useSafeContext from 'src/hooks/useSafeContext';
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
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    const { settings } = oscCtxState;
    const { detune } = settings;
    const [detuneState, setDetuneState] = useState<DetuneState>({
        slider: 0,
        down: 12,
        up: 12,
    });
    const { slider, down, up } = detuneState;

    useEffect(() => {
        console.log('UPS', detune, down, up, calculateSlider(detune, down, up));
        setDetuneState((prevState) => ({
            ...prevState,
            slider: calculateSlider(detune, down, up),
        }));
    }, [detune]);

    const changeDetune = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        setDetuneState({ ...detuneState, [id]: parseInt(value) });
    };

    const change = (e: ChangeEvent): void => {
        const { id, value } = e.target as HTMLInputElement;
        const newSettings = {
            ...settings,
            [id]: calculateDetune(parseInt(value), down, up),
        } as OscSettings;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const onResetValue = (id: string, val: number): void => {
        const newSettings: OscSettings = {
            ...settings,
            [id]: calculateDetune(val, down, up),
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
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
                id="detune"
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
