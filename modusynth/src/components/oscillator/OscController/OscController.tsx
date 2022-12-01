import { ChangeEvent, FC, MouseEvent, useEffect } from 'react';

import { UPDATE_SETTINGS } from 'src/actions/oscActions';
import Slider from 'src/components/core/Slider';
import { OscCTX } from 'src/context/oscContext';
import useOscillator from 'src/hooks/useOscillator';
import useSafeContext from 'src/hooks/useSafeContext';
import { OscSettings } from 'src/types/oscillator';

import ADSR from '../ADSR';
import './OscController.scss';

interface OscProps {
    // eslint-disable-next-line no-undef
    defaultType?: OscillatorType;
    defaultMute?: boolean;
}
const OscController: FC<OscProps> = ({
    defaultType = 'sine',
    defaultMute = false,
}) => {
    const { oscCtxState, dispatchOscState } = useSafeContext(OscCTX);
    let { settings } = oscCtxState;
    let { type, detune, gain, mute } = settings;
    useOscillator();

    useEffect((): void => {
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: {
                settings: { ...settings, mute: defaultMute, type: defaultType },
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeMuted = (e: ChangeEvent): void => {
        let { checked } = e.target as HTMLInputElement;
        dispatchOscState({
            type: UPDATE_SETTINGS,
            payload: { settings: { ...settings, mute: !checked } },
        });
    };

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

    const changeType = (e: MouseEvent): void => {
        let { id } = e.target as HTMLInputElement;
        let newSettings: OscSettings = {
            ...settings,
            // eslint-disable-next-line no-undef
            type: id as OscillatorType,
        };
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

    const WaveTypeSelector: FC = () => {
        const waveTypes = ['sine', 'triangle', 'square', 'sawtooth'];
        return (
            <>
                {waveTypes.map((waveType) => (
                    <button
                        id={waveType}
                        key={waveType}
                        onClick={changeType}
                        className={(waveType === type && 'active') || ''}
                    >
                        {waveType}
                    </button>
                ))}
            </>
        );
    };

    return (
        <div className="osccontroller">
            <h5>
                Osc: {type}
                <input
                    type="checkbox"
                    id="osc"
                    name="osc"
                    onChange={changeMuted}
                    defaultChecked={!mute}
                />
            </h5>
            <div>
                <h6>Type</h6>
                <WaveTypeSelector />
            </div>
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
