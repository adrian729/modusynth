import { ChangeEvent, FC } from 'react';

import { useAppDispatch } from 'src/app/hooks';
import Box from 'src/components/common/core/box/Box';
import Slider from 'src/components/common/core/slider';
import List from 'src/components/common/layouts/list';
import useOscillator from 'src/components/specific/oscillator/hooks/useOscillator';
import OscillatorContext from 'src/context/OscillatorContext';
import useSafeContext from 'src/hooks/useSafeContext';
import {
    getOscillatorSettings,
    updateOscSetting,
} from 'src/reducers/oscillatorsSlice';
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
        const { id, value } = e.target as HTMLInputElement;
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
        <Box className="osccontroller">
            <MuteOsc />
            <WaveTypeSelector />
            <List direction="row" alignment="center">
                <Detune />
                <Slider
                    id="gain"
                    value={gain}
                    max={2}
                    step={0.01}
                    onChange={change}
                    onSliderReset={onResetValue}
                    resetValue={1}
                />
                <Envelope />
            </List>
        </Box>
    );
};
export default OscController;
