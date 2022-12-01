import { ChangeEvent, FC, MouseEvent } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscStore';
import useOscillator from 'src/hooks/useOscillator';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

import ADSR from '../ADSR';
import MuteOsc from '../MuteOsc/MuteOsc';
import WaveTypeSelector from '../WaveTypeSelector';
import './OscController.scss';

const OscController: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { detune, gain } = settings;
    useOscillator();

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        let newSettings = {
            ...settings,
            [id]: value as unknown as number,
        } as OscSettings;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    const handleClick = (e: MouseEvent, val: number): void => {
        let { detail, target } = e;
        let { id } = target as HTMLInputElement;
        if (detail === 2) {
            let newSettings: OscSettings = {
                ...settings,
                [id]: val,
            };
            dispatchOscState({
                type: UPDATE_SETTINGS,
                payload: { settings: newSettings },
            });
        }
    };

    // TODO: detune 100 is a semitone.
    // TODO: Create Detune Component and add options to decide from where to where to detune
    return (
        <div className="osccontroller">
            <MuteOsc />
            <WaveTypeSelector />
            <Slider
                id="detune"
                value={detune}
                min={-100}
                change={change}
                onClick={(e) => handleClick(e, 0)}
            />
            <Slider
                id="gain"
                value={gain}
                min={0.1}
                max={2}
                step={0.1}
                change={change}
                onClick={(e) => handleClick(e, 1)}
            />
            <ADSR />
        </div>
    );
};
export default OscController;
