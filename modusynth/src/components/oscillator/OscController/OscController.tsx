import { ChangeEvent, FC } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/OscStore';
import useOscillator from 'src/hooks/useOscillator';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

import ADSR from '../ADSR';
import Detune from '../Detune';
import MuteOsc from '../MuteOsc/MuteOsc';
import WaveTypeSelector from '../WaveTypeSelector';
import './OscController.scss';

const OscController: FC = () => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { gain } = settings;
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

    const onResetValue = (id: string, val: number): void => {
        let newSettings: OscSettings = {
            ...settings,
            [id]: val,
        };
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: newSettings },
        });
    };

    return (
        <div className="osccontroller">
            <MuteOsc />
            <WaveTypeSelector />
            <Detune />
            <Slider
                id="gain"
                value={gain}
                min={0.1}
                max={2}
                step={0.1}
                onChange={change}
                onSliderReset={onResetValue}
                resetValue={1}
            />
            <ADSR />
        </div>
    );
};
export default OscController;
