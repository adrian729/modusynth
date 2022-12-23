import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Slider from 'src/components/01_core/slider';
import OscillatorContext from 'src/context/OscillatorContext';
import useOscillator from 'src/hooks/useOscillator/useOscillator';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/synthSlice';
import { OscSettingsTypes, OscillatorSettings } from 'src/types/oscillator';

import Detune from '../detune';
import Envelope from '../envelope';
import MuteOsc from '../muteOsc';
import WaveTypeSelector from '../waveTypeSelector';
import './styles.scss';

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
            <Envelope />
        </div>
    );
};
export default OscController;
