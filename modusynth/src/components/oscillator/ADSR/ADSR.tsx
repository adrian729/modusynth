import { ChangeEvent, FC, MouseEvent } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscStore';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

const ADSR: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { envelope } = settings;
    let { attack, decay, sustain, release } = envelope;

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newEnvelope = { ...envelope, [id]: parseFloat(value) };
        let newSettings: OscSettings = {
            ...settings,
            envelope: newEnvelope,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const handleClick = (e: MouseEvent, value: number): void => {
        let { detail, target } = e;
        let { id } = target as HTMLInputElement;
        if (detail === 2) {
            let newEnvelope = { ...envelope, [id]: value };
            let newSettings: OscSettings = {
                ...settings,
                envelope: newEnvelope,
            };
            dispatchOscState({
                type: UPDATE_SETTINGS,
                payload: { settings: newSettings },
            });
        }
    };

    return (
        <div>
            <Slider
                id="attack"
                value={attack}
                min={0.005}
                max={2}
                step={0.005}
                change={change}
                onClick={(e) => handleClick(e, 0.005)}
            />
            <Slider
                id="decay"
                value={decay}
                min={0}
                max={1}
                step={0.01}
                change={change}
                onClick={(e) => handleClick(e, 0.1)}
            />
            <Slider
                id="sustain"
                value={sustain}
                min={0}
                max={1}
                step={0.01}
                change={change}
                onClick={(e) => handleClick(e, 0.6)}
            />
            <Slider
                id="release"
                value={release}
                min={0}
                max={2}
                step={0.02}
                change={change}
                onClick={(e) => handleClick(e, 0.1)}
            />
        </div>
    );
};

export default ADSR;
