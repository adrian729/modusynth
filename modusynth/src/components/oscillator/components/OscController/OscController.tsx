import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/App/hooks';
import Slider from 'src/components/core/Slider';
import OscillatorContext from 'src/context/OscillatorContext';
import useOscillator from 'src/hooks/useOscillator/useOscillator';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';
import { OscSettingsTypes, OscillatorSettings } from 'src/types/oscillator';

import ADSR from '../ADSR';
import Detune from '../Detune';
import MuteOsc from '../MuteOsc/MuteOsc';
import WaveTypeSelector from '../WaveTypeSelector';
import './OscController.scss';

const OscController: FC = () => {
    const dispatch = useAppDispatch();
    const { oscId } = useSafeContext(OscillatorContext);
    const settings = getOscillatorSettings(oscId);
    let { gain } = settings;
    useOscillator();

    const change = (e: ChangeEvent): void => {
        let { id, value } = e.target as HTMLInputElement;
        dispatch(
            updateOscSetting({
                oscId,
                settingId: id as keyof OscillatorSettings,
                value: value as OscSettingsTypes,
            }),
        );
    };

    const onResetValue = (id: string, value: number): void => {
        dispatch(
            updateOscSetting({
                oscId,
                settingId: id as keyof OscillatorSettings,
                value: value as OscSettingsTypes,
            }),
        );
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
